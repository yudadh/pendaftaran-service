import { z } from "zod";

const filterSchema = z.object({
   value: z.string().or(z.boolean()).nullable(),
   matchMode: z.string()
})

export const paginationSchema = z.object({
   page: z.string().regex(/^\d+$/, "ID must be a numeric string"),
   limit: z.string().regex(/^\d+$/, "ID must be a numeric string"),
   filters: z
   .string()
   .optional()
   .transform((str) => {
     try {
       const val = str ? JSON.parse(str) : {}
       console.log(val)
       return val;
     } catch (e) {
       return null; // Jika gagal parse, return null agar validasi gagal nanti
     }
   })
   .refine(
     (data) => data !== null && typeof data === "object" && !Array.isArray(data),
     {
       message: "filters harus berupa objek JSON yang valid",
     }
   )
   .pipe(z.record(filterSchema))
});

export const sekolahparamsSchema = z.object({
   sekolah_id: z.string().regex(/^\d+$/, "ID must be a numeric string"),
   periode_jalur_id: z.string().regex(/^\d+$/, "ID must be a numeric string")
});

export const createTahapanBodySchema = z.object({
   namaTahapan: z.string().regex(/^[a-zA-Z0-9]+$/, "Nama should only contains alpha numeric")
})

const createPendaftaranSchema = z.object({
   siswa_id: z.number().int().positive(),
   banjar_id: z.number().int().positive(),
   lintang: z.number().min(-90).max(90),
   bujur: z.number().min(-180).max(180),
   keterangan: z.string().optional()
})

export const createPendaftaranBodySchema = z.object({
   siswa: createPendaftaranSchema,
   periode_jalur_id: z.number().int().positive()
   // jalur_id: z.number().int().positive(),
})

export const createManyPendaftaranBodySchema = z.object({
   siswas: z.array(createPendaftaranSchema).nonempty(),
   periode_jalur_id: z.number().int().positive()
   // jalur_id: z.number().int().positive()
})

const id = z.number().int().positive()

export const updatePendaftaranSchemaBody = z.array(id).nonempty()

export const pendaftaranParamsSchema = z.object({
   id: z.string().regex(/^\d+$/, "ID must be a numeric string")
});
