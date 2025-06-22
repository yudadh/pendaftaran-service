import express from "express";
import { authMiddleware } from "../middleware/jwtAuth";
import { roleMiddleware } from "../middleware/verifyRole";
import { validateRequest } from "../middleware/validation";
import {
   updatePendaftaranSchemaBody,
   createPendaftaranBodySchema,
   createManyPendaftaranBodySchema,
   paginationSchema,
   sekolahparamsSchema,
   pendaftaranParamsSchema,
} from "../validation/pendaftaranSchema";
import * as PendaftaranController from "../controllers/pendaftaranController";
import { verifyPeriode } from "../middleware/verifyPeriode";

const router = express.Router();

router.post(
   "/zonasi",
   authMiddleware,
   roleMiddleware(["siswa", "adminSD", "adminDisdik"]),
   verifyPeriode,
   validateRequest({ body: createPendaftaranBodySchema }),
   PendaftaranController.createPendaftaran
);

router.post(
   "/zonasi-many",
   authMiddleware,
   roleMiddleware(["adminSD", "adminDisdik"]),
   verifyPeriode,
   validateRequest({ body: createManyPendaftaranBodySchema }),
   PendaftaranController.createManyPendaftaran
);

router.get(
   "/pendaftaran-sd/:periode_jalur_id/:sekolah_id",
   authMiddleware,
   roleMiddleware(["adminSD", "adminDisdik"]),
   validateRequest({ params: sekolahparamsSchema, query: paginationSchema }),
   PendaftaranController.getAllPendaftaranSD
);

router.get(
   "/pendaftaran-smp/:periode_jalur_id/:sekolah_id",
   authMiddleware,
   roleMiddleware(["adminSMP", "adminDisdik"]),
   validateRequest({ params: sekolahparamsSchema, query: paginationSchema }),
   PendaftaranController.getAllPendaftaranSMP
);

router.get(
   "/pendaftaran-siswa/:id",
   authMiddleware,
   roleMiddleware(["siswa", "adminSMP", "adminDisdik"]),
   validateRequest({ params: pendaftaranParamsSchema }),
   PendaftaranController.getAllPendaftaranSiswa
);

router.get("/sekolah-tujuan/:id",
   authMiddleware,
   roleMiddleware(["siswa","adminSMP", "adminDisdik"]),
   validateRequest({params: pendaftaranParamsSchema}),
   PendaftaranController.getZonasiSekolahByBanjarId
)

router.get("/testing",
   // authMiddleware,
   // roleMiddleware(["siswa","adminSMP", "adminDisdik"]),
   // validateRequest({params: pendaftaranParamsSchema}),
   PendaftaranController.testing
)

router.post("/testing-jarak",
   // authMiddleware,
   // roleMiddleware(["siswa","adminSMP", "adminDisdik"]),
   // validateRequest({params: pendaftaranParamsSchema}),
   PendaftaranController.testingJarakTerdekat
)

export default router;
