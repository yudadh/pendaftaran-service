import { Prisma, StatusPendaftaran } from "@prisma/client";
import { prisma } from "../utils/database";
import { PendaftaranDTO, PendaftaranSiswa } from "../interfaces/pendaftaranInterface";

export class PendaftaranRepository {
   static async createManyPendaftaran(
      data: Prisma.PendaftaranCreateManyInput[]
   ) {
      return await prisma.pendaftaran.createMany({
         data: data,
      });
   }

   static async createPendaftaran(
      siswaId: number,
      periodeJalurId: number,
      sekolahId: number,
      umur: number,
      jarakLurus: number,
      jarakRumahSekolah: number,
      status: StatusPendaftaran,
      created_at: string,
      keterangan?: string
   ) {
      return prisma.pendaftaran.create({
         data: {
            siswa_id: siswaId,
            periode_jalur_id: periodeJalurId,
            sekolah_id: sekolahId,
            umur_siswa: umur,
            jarak_lurus: jarakLurus,
            jarak_rute: jarakRumahSekolah,
            status: status,
            keterangan: keterangan,
            created_at: created_at
         },
         select: {
            pendaftaran_id: true,
            sekolah_id: true,
         }
      })
   }

   static async findAllPendaftaran(
      whereClause: object,
      skip: number,
      limit: number
   ) {
      return await prisma.pendaftaran.findMany({
         where: whereClause,
         skip: skip,
         take: limit,
         select: {
            siswa: {
               select: {
                  siswa_id: true,
                  nama: true,
                  nisn: true,
                  sekolah_asal: {
                     select: {
                        sekolah_id: true,
                        sekolah_nama: true
                     }
                  },
                  dokumen_siswas: {
                     select: {
                        dokumen_id: true,
                        status: true
                     }
                  }
               },
            },
            pendaftaran_id: true,
            sekolah_tujuan: {
               select: {
                  sekolah_id: true,
                  sekolah_nama: true
               }
            },
            status: true,
            status_kelulusan: true,
            periode_jalur_id: true,
            keterangan: true,
            created_at: true,
            periodejalur: {
               select: {
                  jalur_id: true
               }
            }
         },
      });
   }

   static async findAllPendaftaranRaw(sekolahId: number, periodeJalurId: number,limit: number, skip: number, whereClause: any) {
      return prisma.$queryRaw<PendaftaranSiswa[]>`
         SELECT 
         p.pendaftaran_id,
         p.status,
         p.status_kelulusan,
         s.siswa_id,
         s.nisn,
         s.nama,
         s.lintang,
         s.bujur,
         COALESCE(ds.valid_count, 0) as totalDokumenValid,
         p.keterangan,
         JSON_OBJECT(
            'sekolah_id', sk.sekolah_id,
            'sekolah_nama', sk.sekolah_nama
         ) AS sekolah_asal,
         JSON_OBJECT(
            'sekolah_id', skt.sekolah_id,
            'sekolah_nama', skt.sekolah_nama,
            'lintang', skt.lintang,
            'bujur', skt.bujur
         ) AS sekolah_tujuan
         FROM m_pendaftaran p
         JOIN m_siswas s ON s.siswa_id = p.siswa_id
         LEFT JOIN (
            SELECT siswa_id, COUNT(*) AS valid_count
            FROM dokumen_siswa
            WHERE status = 'VALID_SMP'
            GROUP BY siswa_id 
         ) ds ON ds.siswa_id = s.siswa_id
         LEFT JOIN m_sekolahs skt ON p.sekolah_id = skt.sekolah_id
         LEFT JOIN m_sekolahs sk ON s.sekolah_asal_id = sk.sekolah_id
         WHERE ${whereClause}
         LIMIT ${limit} OFFSET ${skip};
      `
   }

   static async countAllPendaftaranRaw(sekolahId: number, periodeJalurId: number,limit: number, skip: number, whereClause: any) {
      return prisma.$queryRaw<[{ total: string }]>`
         SELECT 
         CAST(COUNT(*) AS CHAR) AS total
         FROM m_pendaftaran p
         JOIN m_siswas s ON s.siswa_id = p.siswa_id
         JOIN (
            SELECT siswa_id, COUNT(*) AS valid_count
            FROM dokumen_siswa
            WHERE status = 'VALID_SMP'
            GROUP BY siswa_id 
         ) ds ON ds.siswa_id = s.siswa_id
         LEFT JOIN m_sekolahs skt ON p.sekolah_id = skt.sekolah_id
         LEFT JOIN m_sekolahs sk ON s.sekolah_asal_id = sk.sekolah_id
         WHERE ${whereClause}
         LIMIT ${limit} OFFSET ${skip};
      `
   }

   static async updateManyStatusPendaftaran(pendaftaranIds: number[], status: StatusPendaftaran) {
      return prisma.pendaftaran.updateMany({
         where: {
            pendaftaran_id: {
               in: pendaftaranIds
            }
         },
         data: {
            status: status
         }
      })
   }

   static async findAllPendaftaranSiswa(siswaIds: number[]) {
      return prisma.pendaftaran.findMany({
         where: {
            siswa_id: {
               in: siswaIds
            }
         },
         select: {
            pendaftaran_id: true,
            siswa_id: true
         }
      })
   }

   static async updateStatusPendaftaranSiswa(siswaIds: number[]) {
      return prisma.pendaftaran.updateMany({
         where: {
            siswa_id: {
               in: siswaIds
            }
         },
         data: {
            status: 'VERIF_SD'
         }
      })
   }
   
   static async countAllPendaftaran(whereClause: object) {
      return await prisma.pendaftaran.count({
         where: whereClause,
      });
   }

   static async findZonasiByBanjarId(banjarId: number) {
      return prisma.zonasi.findFirst({
         where: {banjar_id: banjarId},
         select: {
            sekolah_id: true,
            sekolah: {
               select: {
                  sekolah_nama: true,
                  lintang: true,
                  bujur: true
               }
            }
         }
      })
   }

   static async findAllZonasi(banjarIds: number[]) {
      return prisma.zonasi.findMany({
         where: {
            banjar_id: {
               in: banjarIds
            }
         },
         select: {
            banjar_id: true,
            sekolah: {
               select: {
                  sekolah_id: true,
                  lintang: true,
                  bujur: true,
               },
            },
         },
      });
   }

   static async findDokumenJalurByJalurId(jalurId: number) {
      return prisma.dokumenJalur.findMany({
         where: {jalur_id: jalurId},
         select: {
            dokumen_id: true
         }
      })
   }
   
   static async findDokumenSiswaBySiswaId(siswaIds: number[]) {
      return prisma.dokumenSiswa.findMany({
         where: {
            siswa_id: {
               in: siswaIds
            }
         },
         select: {
            dokumen_id: true,
            siswa_id: true,
            status: true
         }
      })
   }

   static async test(periodeJalurId: number, whereClause: any) {
      return prisma.$queryRaw`
         SELECT 
         p.pendaftaran_id,
         p.status,
         p.status_kelulusan,
         s.siswa_id,
         s.nisn,
         s.nama,
         ds.valid_count as totalDokumenValid,
         JSON_OBJECT(
            'sekolah_id', sk.sekolah_id,
            'sekolah_nama', sk.sekolah_nama
         ) AS sekolah_asal,
         JSON_OBJECT(
            'sekolah_id', skt.sekolah_id,
            'sekolah_nama', skt.sekolah_nama
         ) AS sekolah_tujuan
         FROM m_pendaftaran p
         JOIN m_siswas s ON s.siswa_id = p.siswa_id
         JOIN (
            SELECT siswa_id, COUNT(*) AS valid_count
            FROM dokumen_siswa
            WHERE status = 'VALID_SMP'
            GROUP BY siswa_id 
         ) ds ON ds.siswa_id = s.siswa_id
         LEFT JOIN m_sekolahs skt ON p.sekolah_id = skt.sekolah_id
         LEFT JOIN m_sekolahs sk ON s.sekolah_asal_id = sk.sekolah_id
         WHERE p.periode_jalur_id = ${periodeJalurId} 
         ${Prisma.raw(whereClause)}
         LIMIT 10 OFFSET 0;
      `
   }

   static async findSiswaData(siswaId: number) {
      return prisma.siswa.findUnique({
         where: { siswa_id: siswaId },
         select: {
            siswa_id: true,
            lintang: true,
            bujur: true
         }
      })
   }

   static async findALlSekolahSmpData() {
      return prisma.sekolah.findMany({
         where: {
            jenjang_sekolah_id: 1
         },
         select: {
            sekolah_id: true,
            sekolah_nama: true,
            lintang: true,
            bujur: true
         }
      })
   }

}
