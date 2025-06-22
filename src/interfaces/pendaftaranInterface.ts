import { Prisma } from "@prisma/client";

export interface ApiResponse<T> {
   status: "success" | "error";
   data: T | null;
   meta: any | null;
   error: {
      message: string;
      code: number;
   } | null;
}

export interface JwtPayloadToken {
   userId: number;
   role: string;
}

export interface PendaftaranDTO {
   siswa_id: number
   banjar_id: number,
   tanggal_lahir: string,
   lintang: number
   bujur: number
   keterangan?: string
}

export interface PendaftaranSDResponse {
   siswa_id: number;
   nama: string;
   nisn: string;
   pendaftaran_id: number;
   sekolah_id: number;
   sekolah_nama: string;
   sekolah_lintang: number;
   sekolah_bujur: number;
   sekolah_asal_id: number | null;
   sekolah_asal_nama: string | null;
   status: string;
   isAllDokumenValid: boolean;
   totalDokumenValid: number;
   status_kelulusan: string;
   keterangan: string | null;
   lintang: number;
   bujur: number;
}

export interface PaginationMeta {
   total: number;
   page: number;
   limit: number;
}

export interface SekolahZona {
   sekolah_id: number,
   lintang: Prisma.Decimal,
   bujur: Prisma.Decimal
}

export interface GetAllJadwalRequest {
   periode_jalur_id: number
   waktu_mulai: string,
   waktu_selesai: string,
   tahapan_nama: string,
   is_closed: number,
   jadwal_id: number
}

export interface DokumenMasterDTO {
   dokumen_id: number;
   dokumen_jenis: string;
   is_umum: boolean;
   keterangan: string | null;
}

export interface PendaftaranSiswaDTO {
   pendaftaran_id: number,
   siswa_id: number,
   nama: string,
   nisn: string,
   status: string,
   status_kelulusan: string
   periode_jalur_id: number
   jalur_id: number
   create_at: string | null
}

export interface PendaftaranSiswa {
   pendaftaran_id: number;
   status: string;
   status_kelulusan: string;
   siswa_id: number;
   nisn: string;
   nama: string;
   totalDokumenValid: number,
   keterangan: string | null,
   lintang: number;
   bujur: number;
   sekolah_asal: {
       sekolah_id: number;
       sekolah_nama: string;
   },
   sekolah_tujuan: {
       sekolah_id: number;
       sekolah_nama: string;
       lintang: number;
       bujur: number;
   }
        
}