import { PendaftaranRepository } from "../repositories/pendaftaranRepository";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/appError";
import {
   DokumenMasterDTO,
   GetAllJadwalRequest,
   PendaftaranDTO,
   PendaftaranSDResponse,
   PendaftaranSiswa,
   PendaftaranSiswaDTO,
   SekolahZona,
} from "../interfaces/pendaftaranInterface";
import { GetBatchResult } from "@prisma/client/runtime/library";
import axios from "axios";
import { env } from "../config/envConfig";
import { logger } from "../utils/logger";
import plimit from "p-limit";
import { generateAccessToken } from "../utils/jwt";
import { handleAxiosError } from "../utils/axiosError";
import { delayMs, mapboxLimiter } from "../utils/mapboxLimiter";

interface DokumenSiswa {
   dokumen_id: number;
   siswa_id: number;
}

export class PendaftaranService {
   static async createManyPendaftaran(
      datas: PendaftaranDTO[],
      periode_jalur_id: number,
      jadwal_pendaftaran: GetAllJadwalRequest
      // jalur_id: number
   ): Promise<{ count: number }> {
      const banjarIds = datas.map((d) => d.banjar_id);
      const zonasiList: Record<number, SekolahZona> =
         await this.getZonasiByBanjarIds(banjarIds);
      const limit = plimit(4);

      const masterDokumen = await this.getMasterDokumen()
      const dokumenUmum = masterDokumen
      .filter((dokumen) => dokumen.is_umum === true)
      .map((dokumen) => dokumen.dokumen_id)

      const siswaIds = datas.map((d) => d.siswa_id)

      const siswaTerdaftar = await PendaftaranRepository.findAllPendaftaranSiswa(siswaIds)
      const siswaTerdaftarIds = new Set(siswaTerdaftar.map((siswa) => siswa.siswa_id))

      let updatedSiswas = 0
      if (siswaTerdaftar.length > 0) {
         updatedSiswas = (await this.verifikasiSiswaSDTerdaftar(siswaTerdaftar.map((siswa) => siswa.pendaftaran_id))).count
      }

      const siswaBelumTerdaftar = datas.filter((data) => !siswaTerdaftarIds.has(data.siswa_id))
      const siswaBelumTerdaftarIds = siswaBelumTerdaftar.map((siswa) => siswa.siswa_id)
      const dokumenSiswa =
         await PendaftaranRepository.findDokumenSiswaBySiswaId(siswaBelumTerdaftarIds);
      
      const dokumenSiswaMap = new Map<number, number[]>()
      for (const dokumen of dokumenSiswa) {
         const doklist = dokumenSiswaMap.get(dokumen.siswa_id) ?? []
         doklist.push(dokumen.dokumen_id)
         dokumenSiswaMap.set(dokumen.siswa_id, doklist)
      }

      const results = await Promise.all(
         datas.map((data) =>
            limit(async () => {

               const dokumenDiperlukan: number[] = dokumenUmum
               const dokumenDiunggah: number[] = dokumenSiswaMap.get(data.siswa_id) ?? []
            
               const dokumenBelumDiunggah: number[] = dokumenDiperlukan.filter(
                  (id) => !dokumenDiunggah.includes(id)
               );
            
               if (dokumenBelumDiunggah.length > 0) {
                  throw new AppError(
                     `Student document with id ${data.siswa_id} is incomplete`,
                     400
                  );
               }

               const sekolah: SekolahZona = zonasiList[data.banjar_id];

               if (!sekolah) {
                  throw new AppError(
                     `zonasi not found for banjar with id ${data.banjar_id}`,
                     404
                  );
               }

               const umur = this.countUmur(data.tanggal_lahir, jadwal_pendaftaran.waktu_mulai)
               const jarak_lurus = this.calculateJarakLurus(
                  data.lintang,
                  data.bujur,
                  sekolah.lintang.toNumber(),
                  sekolah.bujur.toNumber()
               )
               
               const jarak_rumah_sekolah = await this.countJarakWithRouting(
                  [data.bujur, data.lintang],
                  [sekolah.bujur.toNumber(), sekolah.lintang.toNumber()]
               );
               const created_at = new Date().toISOString();

               return {
                  siswa_id: data.siswa_id,
                  periode_jalur_id: periode_jalur_id,
                  sekolah_id: sekolah.sekolah_id,
                  umur_siswa: umur,
                  jarak_lurus: jarak_lurus,
                  jarak_rute: jarak_rumah_sekolah,
                  status: 'VERIF_SD',
                  created_at: created_at,
               } as Prisma.PendaftaranCreateManyInput;
            })
         )
      );
      const daftarSiswa =  await PendaftaranRepository.createManyPendaftaran(
         results
      );

      return { count: updatedSiswas + daftarSiswa.count }
   }

   static async createPendaftaran(
      data: PendaftaranDTO,
      periode_jalur_id: number,
      jadwal_pendaftaran: GetAllJadwalRequest
   ) {
      const masterDokumen = await this.getMasterDokumen()
      const dokumenUmum: number[] = masterDokumen
      .filter((dokumen) => dokumen.is_umum === true)
      .map((dokumen) => dokumen.dokumen_id)

      const dokumenSiswa =
         await PendaftaranRepository.findDokumenSiswaBySiswaId([data.siswa_id]);

      const dokumenDiunggah: number[] = dokumenSiswa.map(
         (dokumen) => dokumen.dokumen_id
      );

      const dokumenBelumDiunggah: number[] = dokumenUmum.filter(
         (id) => !dokumenDiunggah.includes(id)
      );

      if (dokumenBelumDiunggah.length > 0) {
         throw new AppError(
            `Student document with id ${data.siswa_id} is incomplete`,
            400
         );
      }

      const isAllDokumenValid = dokumenSiswa.every((d) => d.status === 'VALID_SD')

      if (!isAllDokumenValid) {
         throw new AppError("Not all documents are valid", 400)
      }

      const sekolah = await PendaftaranRepository.findZonasiByBanjarId(
         data.banjar_id
      );

      if (!sekolah) {
         throw new AppError(
            `zonasi not found for banjar with id ${data.banjar_id}`,
            404
         );
      }

      const umur = this.countUmur(data.tanggal_lahir, jadwal_pendaftaran.waktu_mulai)
      const jarak_lurus = this.calculateJarakLurus(
         data.lintang,
         data.bujur,
         sekolah.sekolah.lintang.toNumber(),
         sekolah.sekolah.bujur.toNumber()
      )

      const jarak_rumah_sekolah = await this.countJarakWithRouting(
         [data.bujur, data.lintang],
         [sekolah.sekolah.bujur.toNumber(), sekolah.sekolah.lintang.toNumber()]
      );

      const status = isAllDokumenValid ? 'VERIF_SD' : 'BELUM_VERIF'
      const created_at = new Date().toISOString();
      const response = await PendaftaranRepository.createPendaftaran(
         data.siswa_id,
         periode_jalur_id,
         sekolah.sekolah_id,
         umur,
         jarak_lurus,
         jarak_rumah_sekolah,
         status,
         created_at
      );

      return response;
   }

   private static countUmur(tanggal_lahir: string, tanggal_mulai_pendaftaran: string): number {
      const tglLahir = new Date(tanggal_lahir).setHours(0, 0, 0, 0)
      const tglDaftar = new Date(tanggal_mulai_pendaftaran).setHours(0, 0, 0, 0)

      const selisihHari = tglDaftar - tglLahir
      const milidetikPerHari = 1000 * 60 * 60 * 24
      const umur = selisihHari / milidetikPerHari
      
      return umur
   }

   private static calculateJarakLurus(
     lat1: number,
     lon1: number,
     lat2: number,
     lon2: number
   ): number {
     const R = 6371000; // Radius bumi dalam meter

     const toRadians = (degree: number) => (degree * Math.PI) / 180;

     const dLat = toRadians(lat2 - lat1);
     const dLon = toRadians(lon2 - lon1);

     const a =
       Math.sin(dLat / 2) ** 2 +
       Math.cos(toRadians(lat1)) *
         Math.cos(toRadians(lat2)) *
         Math.sin(dLon / 2) ** 2;

     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

     return R * c; // Jarak dalam meter
   }

   private static async countJarakWithRouting(
      rumah: number[],
      sekolah: number[]
   ): Promise<number> {
      try {
         const status = await mapboxLimiter.get('global');
         if (!status) {
            await mapboxLimiter.consume('global');
         } else if (status.remainingPoints > 0) {
            await mapboxLimiter.consume('global');
            // langsung request
         } else {
            logger.info("request kuota sudah melebihi 300")
            const delay = status.msBeforeNext;
            await delayMs(delay);
            await mapboxLimiter.consume('global');
            // request setelah delay
         }
         const apiKey = env.MAPBOX_API_KEY;
         const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${rumah};${sekolah}?overview=full&geometries=geojson&access_token=${apiKey}`;
         const routing = await axios.get(url);
         return routing.data.routes[0].distance;
      } catch (error) {
         logger.error(`error in requesting to mapbox api`, error);
         throw error;
      }
   }

   private static async getZonasiByBanjarIds(banjarIds: number[]) {
      const zonasiList = await PendaftaranRepository.findAllZonasi(banjarIds);

      const zonasiMap = zonasiList.reduce<Record<number, SekolahZona>>(
         (map, zonasi) => {
            map[zonasi.banjar_id] = zonasi.sekolah;
            return map;
         },
         {}
      );

      return zonasiMap;
   }

   private static async getMasterDokumen(): Promise<DokumenMasterDTO[]> {
      try {
         const url = `${env.DOCUMENT_SERVICE_URL}/master-dokumen`
         const token = generateAccessToken({userId: 0, role: "adminDisdik"})
         const masterDokumen = await axios.get(url, {
            headers: {
                  Authorization: `Bearer ${token}`
            }
         })
         return masterDokumen.data.data
      } catch (error) {
         handleAxiosError(error)
      }
   }

   private static async verifikasiSiswaSDTerdaftar(pendaftaranIds: number[]
   ): Promise<GetBatchResult> {
      const pendaftarans = await PendaftaranRepository.updateManyStatusPendaftaran(pendaftaranIds, "VERIF_SD")
      return pendaftarans
   }

   static async getAllPendaftaran(
      filterKey: "SD" | "SMP",
      sekolahId: number,
      periodeJalurId: number,
      page: number,
      limit: number,
      filters: any
   ): Promise<{
      response: PendaftaranSDResponse[];
      total: number;
   }> {
      const skip: number = (page - 1) * limit;
      const conditions: Prisma.Sql[] = []

      switch (filterKey) {
         case "SD":
            conditions.push(Prisma.sql`sk.sekolah_id = ${sekolahId}`)
            if (filters.statusPendaftaran?.value) {
               // console.log(typeof filters.statusPendaftaran.value)
               conditions.push(Prisma.sql`p.status = ${filters.statusPendaftaran.value}`)
            } else {
               conditions.push(Prisma.sql`p.status IN ('VERIF_SD', 'VERIF_SMP')`)
            }
            break
         case "SMP":
            conditions.push(Prisma.sql`skt.sekolah_id = ${sekolahId}`)
            if (filters.statusPendaftaran?.value) {
               conditions.push(Prisma.sql`p.status = ${filters.statusPendaftaran.value}`)
            } else {
               conditions.push(Prisma.sql`p.status IN ('VERIF_SD', 'VERIF_SMP')`)
            }
            break
         default: 
            console.log(`Filterkey not recognized`)
            break
      }

      conditions.push(Prisma.sql`periode_jalur_id = ${periodeJalurId}`)

      if (filters.nama?.value) {
         conditions.push(Prisma.sql`s.nama LIKE '%${filters.nama.value}%'`)
      }

      if (filters.nisn?.value) {
         conditions.push(Prisma.sql`s.nisn LIKE '%${filters.nisn.value}%'`)
      }

      if (filters.totalDokumenValid?.value) {
         switch (Number(filters.totalDokumenValid.value)) {
            case 0:
               conditions.push(Prisma.sql`ds.valid_count = 0` )
               break
            case 1:
               conditions.push(Prisma.sql`ds.valid_count = 1`)
               break
            case 2:
               conditions.push(Prisma.sql`ds.valid_count > 1 AND ds.valid_count < 4`)
               break
            case 3:
               conditions.push(Prisma.sql`ds.valid_count = 4`)
         }
      }

      const whereClause = conditions.length > 0 ? Prisma.sql`${Prisma.join(conditions, ` AND `)}` : Prisma.sql``;
      console.log(whereClause)

      const pendaftarans = await PendaftaranRepository.findAllPendaftaranRaw(
         sekolahId,
         periodeJalurId,
         limit,
         skip,
         whereClause
      );
      
      const total = await PendaftaranRepository.countAllPendaftaranRaw(
         sekolahId,
         periodeJalurId, 
         limit, 
         skip, 
         whereClause
      );

      const result: PendaftaranSiswa[] = JSON.parse(JSON.stringify(pendaftarans, (key, value) =>
         typeof value === "bigint" ? Number(value) : value
      ));

      console.log(result)
      console.log(Number(total[0].total))

      const response: PendaftaranSDResponse[] = result.map(
         (pendaftaran) => ({
            siswa_id: pendaftaran.siswa_id,
            nama: pendaftaran.nama,
            nisn: pendaftaran.nisn,
            pendaftaran_id: pendaftaran.pendaftaran_id,
            sekolah_id: pendaftaran.sekolah_tujuan.sekolah_id,
            sekolah_nama: pendaftaran.sekolah_tujuan.sekolah_nama,
            sekolah_lintang: pendaftaran.sekolah_tujuan.lintang,
            sekolah_bujur: pendaftaran.sekolah_tujuan.bujur,
            sekolah_asal_id: pendaftaran.sekolah_asal ? pendaftaran.sekolah_asal.sekolah_id : null ,
            sekolah_asal_nama: pendaftaran.sekolah_asal ? pendaftaran.sekolah_asal.sekolah_nama : null ,
            status: pendaftaran.status,
            isAllDokumenValid: pendaftaran.totalDokumenValid === 4 ? true : false,
            totalDokumenValid: pendaftaran.totalDokumenValid,
            status_kelulusan: pendaftaran.status_kelulusan,
            keterangan: pendaftaran.keterangan,
            lintang: pendaftaran.lintang,
            bujur: pendaftaran.bujur
         })
      );
      return { 
         response,
         total: Number(total[0].total) 
      };
   }

   static async getZonasiSekolahByBanjarId(banjar_id: number): Promise<{
      sekolah_id: number;
      sekolah_nama: string;
      lintang: number;
      bujur: number;
   }> {
      const sekolah = await PendaftaranRepository.findZonasiByBanjarId(
         banjar_id
      );
      if (!sekolah) {
         throw new AppError("Zonasi sekolah tidak ditemukan", 404);
      }
      const response = {
         sekolah_id: sekolah.sekolah_id,
         sekolah_nama: sekolah.sekolah.sekolah_nama,
         lintang: Number(sekolah.sekolah.lintang),
         bujur: Number(sekolah.sekolah.bujur)
      };
      return response;
   }

   static async getAllPendaftaranBySiswaId(siswa_id: number): Promise<PendaftaranSiswaDTO[]> {
      const whereClause = { siswa_id: siswa_id }
      const pendaftarans = await PendaftaranRepository.findAllPendaftaran(whereClause, 0, 10)
      const response: PendaftaranSiswaDTO[] = pendaftarans.map((pendaftaran) => ({
         pendaftaran_id: pendaftaran.pendaftaran_id,
         siswa_id: pendaftaran.siswa.siswa_id,
         nama: pendaftaran.siswa.nama,
         nisn: pendaftaran.siswa.nisn,
         status: pendaftaran.status,
         status_kelulusan: pendaftaran.status_kelulusan,
         periode_jalur_id: pendaftaran.periode_jalur_id,
         jalur_id: pendaftaran.periodejalur.jalur_id,
         create_at: pendaftaran.created_at ? pendaftaran.created_at.toISOString() : null
      }))
      return response
   }

   static async testing(filters: any) {

      const conditions = []

      if (filters.nama?.value) {
         conditions.push(`s.nama LIKE '%${filters.nama.value}%'`)
      }

      if (filters.nisn?.value) {
         conditions.push(`s.nisn LIKE '%${filters.nisn.value}%'`)
      }

      if (filters.totalDokumenValid?.value) {
         switch (filters.totalDokumenValid.value) {
            case 0:
               conditions.push(`ds.valid_count = 0` )
               break
            case 1:
               conditions.push('ds.valid_count = 1')
               break
            case 2:
               conditions.push('ds.valid_count > 1 AND ds.valid_count < 4')
               break
            case 3:
               conditions.push('ds.valid_count = 4')
         }
      }

      const whereClause = conditions.length > 0 ? `AND ${conditions.join(" AND ")}`: ""

      const data = await PendaftaranRepository.findAllPendaftaranRaw(114, 9, 10, 0, whereClause)
      const count = await PendaftaranRepository.countAllPendaftaranRaw(114, 9, 10, 0, whereClause)
      const result = JSON.parse(JSON.stringify(data, (key, value) =>
         typeof value === "bigint" ? Number(value) : value
       ));
       return { 
         result, 
         count: Number(count[0].total) 
      }
   }

   private static delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }

  private static async batchProcess<T, R>(
    items: T[],
    batchSize: number,
    delayMs: number,
    task: (item: T) => Promise<R>
  ): Promise<R[]> {
    const results: R[] = [];
  
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
  
      const batchResults = await Promise.all(batch.map(task));
      results.push(...batchResults);
  
      if (i + batchSize < items.length) {
        await this.delay(delayMs); // Tunggu sebelum batch selanjutnya
      }
    }
  
    return results;
  }

   private static async getDistanceMatrix(origin: [number, number], destinations: [number, number][]) {
     const apiKey = env.MAPBOX_API_KEY;
     const coords = [origin, ...destinations].map(c => `${c[0]},${c[1]}`).join(';');
     const sources = "0"; // origin = index 0
     const destinationsIndexes = destinations.map((_, i) => i + 1).join(';'); // indexes 1,2,3
     try {
        const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/cycling/${coords}?sources=${sources}&destinations=${destinationsIndexes}&annotations=distance,duration&access_token=${apiKey}`;
        console.log(url)
   
        const res = await axios.get(url);
        console.log(res.data)
        return res.data.distances[0]; // array of distances from origin to each destination
     } catch (error) {
       console.log(error)
     }
   }

   private static async getNearestSchools(studentCoord: [number, number], limit: number) {
      const [lng1, lat1] = studentCoord
      const sekolahData = await PendaftaranRepository.findALlSekolahSmpData()
      const schoolsWithDistance = sekolahData.map((data) => {
        const distance = this.calculateJarakLurus(
          lat1, lng1,
          data.lintang.toNumber(), data.bujur.toNumber()
        );
     
        return {
          ...data,
          distance,
        }
      })

      // Urutkan berdasarkan jarak dan ambil 'limit' sekolah
      const nearestSchool =  schoolsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
      //   // memfilter agar jarak antar sekolah tidak lebih dari 500m
      //   .filter((s, i, arr) => {
      //        if (i === 0) return true
      //        return s.distance - arr[i-1].distance <= 500
      //    })
      return nearestSchool
   }

   static async testJarakTerdekat(siswaId: number) {
      const siswaData = await PendaftaranRepository.findSiswaData(siswaId)

      if (!siswaData || !(siswaData.bujur && siswaData.lintang)) {
         throw new AppError("siswa not found", 404)
      }
      // console.log(siswaData)
      // console.log(sekolahCoords)
      const siswaCoord: [number, number] = [siswaData.bujur, siswaData.lintang]
      const nearestSchools = await this.getNearestSchools(siswaCoord, 3);
      console.log(nearestSchools)
      const nearestSchoolCoords = nearestSchools.map<[number, number]>(data => [data.bujur.toNumber(), data.lintang.toNumber()])
      const distances = await this.batchProcess(
         nearestSchoolCoords,
         5,
         1000,
         async (data) => await this.countJarakWithRouting(siswaCoord, data)
      )
      // const distances = await this.getDistanceMatrix([siswaData.bujur, siswaData.lintang], nearestSchoolCoords)

      // Step 4: Pilih sekolah dengan jarak rute terpendek
      console.log(distances)
      let minIndex = 0;
      let minDistance = distances[0];

      for (let i = 1; i < distances.length; i++) {
        if (distances[i] < minDistance) {
          minDistance = distances[i];
          minIndex = i;
        }
      }

      // console.log(`Sekolah tedekat: ${sekolahData[minIndex].sekolah_nama}\n dengan jarak: ${minDistance}`)
      return `Sekolah tedekat: ${nearestSchools[minIndex].sekolah_nama} dengan jarak: ${minDistance}`
   }
}
