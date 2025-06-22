import { Request, Response, NextFunction } from "express";
import { PendaftaranService } from "../services/pendaftaranService";
import { logger } from "../utils/logger";
import { AppError } from "../utils/appError";
import { successResponse } from "../utils/successResponse";
import {
   GetAllJadwalRequest,
   PaginationMeta,
   PendaftaranDTO,
} from "../interfaces/pendaftaranInterface";

export async function createManyPendaftaran(
   req: Request,
   res: Response,
   next: NextFunction
) {
   try {
      const {
         siswas,
         periode_jalur_id,
         jadwal_pendaftaran
         // jalur_id,
      }: {
         siswas: PendaftaranDTO[];
         periode_jalur_id: number;
         jadwal_pendaftaran: GetAllJadwalRequest
         // jalur_id: number;
      } = req.body;
      const response = await PendaftaranService.createManyPendaftaran(
         siswas,
         periode_jalur_id,
         jadwal_pendaftaran
         // jalur_id
      );
      successResponse(res, 200, response, null);
   } catch (error) {
      // Logging berdasarkan jenis error
      if (error instanceof AppError) {
         logger.warn(`[AppError in createManyPendaftaran]: ${error.message}`);
      } else if (error instanceof Error) {
         logger.error(
            `[Unexpected Error in createManyPendaftaran]: ${error.message}`,
            {
               stack: error.stack,
            }
         );
      } else {
         logger.error(
            `[Unknown Error in createManyPendaftaran]: ${JSON.stringify(error)}`
         );
      }
      next(error);
   }
}

export async function createPendaftaran(
   req: Request,
   res: Response,
   next: NextFunction
) {
   try {
      const {
         siswa,
         periode_jalur_id,
         jadwal_pendaftaran
      }: {
         siswa: PendaftaranDTO;
         periode_jalur_id: number;
         jadwal_pendaftaran: GetAllJadwalRequest
      } = req.body;
      const response = await PendaftaranService.createPendaftaran(
         siswa,
         periode_jalur_id,
         jadwal_pendaftaran
      );
      successResponse(res, 200, response, null);
   } catch (error) {
      // Logging berdasarkan jenis error
      if (error instanceof AppError) {
         logger.warn(`[AppError in createPendaftaran]: ${error.message}`);
      } else if (error instanceof Error) {
         logger.error(
            `[Unexpected Error in createPendaftaran]: ${error.message}`,
            {
               stack: error.stack,
            }
         );
      } else {
         logger.error(
            `[Unknown Error in createPendaftaran]: ${JSON.stringify(error)}`
         );
      }
      next(error);
   }
}

export async function getAllPendaftaranSD(
   req: Request,
   res: Response,
   next: NextFunction
) {
   try {
      const { sekolah_id, periode_jalur_id } = req.params;
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {}
      const { page = 1, limit = 10 } = req.query;
      const response = await PendaftaranService.getAllPendaftaran(
         "SD",
         Number(sekolah_id as string),
         Number(periode_jalur_id as string),
         Number(page as string),
         Number(limit as string),
         filters
      );
      const meta: PaginationMeta = {
         page: Number(page as string),
         limit: Number(limit as string),
         total: response.total,
      };
      successResponse(res, 200, response.response, meta);
   } catch (error) {
      // Logging berdasarkan jenis error
      if (error instanceof AppError) {
         logger.warn(`[AppError in getAllPendaftaranSD]: ${error.message}`);
      } else if (error instanceof Error) {
         logger.error(
            `[Unexpected Error in getAllPendaftaranSD]: ${error.message}`,
            {
               stack: error.stack,
            }
         );
      } else {
         logger.error(
            `[Unknown Error in getAllPendaftaranSD]: ${JSON.stringify(error)}`
         );
      }
      next(error);
   }
}

export async function getAllPendaftaranSMP(
   req: Request,
   res: Response,
   next: NextFunction
) {
   try {
      const { sekolah_id, periode_jalur_id } = req.params;
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {}
      const { page = 1, limit = 10 } = req.query;
      const response = await PendaftaranService.getAllPendaftaran(
         "SMP",
         Number(sekolah_id as string),
         Number(periode_jalur_id as string),
         Number(page as string),
         Number(limit as string),
         filters
      );
      // console.log(response.response)
      const meta: PaginationMeta = {
         page: Number(page as string),
         limit: Number(limit as string),
         total: response.total,
      };
      successResponse(res, 200, response.response, meta);
   } catch (error) {
      // Logging berdasarkan jenis error
      if (error instanceof AppError) {
         logger.warn(`[AppError in getAllPendaftaranSMP]: ${error.message}`);
      } else if (error instanceof Error) {
         logger.error(
            `[Unexpected Error in getAllPendaftaranSMP]: ${error.message}`,
            {
               stack: error.stack,
            }
         );
      } else {
         logger.error(
            `[Unknown Error in getAllPendaftaranSMP]: ${JSON.stringify(error)}`
         );
      }
      next(error);
   }
}

export async function getAllPendaftaranSiswa(
   req: Request,
   res: Response,
   next: NextFunction
) {
   try {
      const { id } = req.params;
      const response = await PendaftaranService.getAllPendaftaranBySiswaId(Number(id as string))
      successResponse(res, 200, response, null);
   } catch (error) {
      // Logging berdasarkan jenis error
      if (error instanceof AppError) {
         logger.warn(`[AppError in getAllPendaftaranBySiswaId]: ${error.message}`);
      } else if (error instanceof Error) {
         logger.error(
            `[Unexpected Error in getAllPendaftaranBySiswaId]: ${error.message}`,
            {
               stack: error.stack,
            }
         );
      } else {
         logger.error(
            `[Unknown Error in getAllPendaftaranBySiswaId]: ${JSON.stringify(error)}`
         );
      }
      next(error);
   }
}

export async function getZonasiSekolahByBanjarId(
   req: Request,
   res: Response,
   next: NextFunction
) {
   try {
      const { id } = req.params;
      const response = await PendaftaranService.getZonasiSekolahByBanjarId(Number(id))
      successResponse(res, 200, response, null);
   } catch (error) {
      // Logging berdasarkan jenis error
      if (error instanceof AppError) {
         logger.warn(`[AppError in getSekolahByBanjarId]: ${error.message}`);
      } else if (error instanceof Error) {
         logger.error(
            `[Unexpected Error in getSekolahByBanjarId]: ${error.message}`,
            {
               stack: error.stack,
            }
         );
      } else {
         logger.error(
            `[Unknown Error in getSekolahByBanjarId]: ${JSON.stringify(error)}`
         );
      }
      next(error);
   }
}

export async function testing(
   req: Request,
   res: Response,
   next: NextFunction
) {
   try {
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {}
      const response = await PendaftaranService.testing(filters)
      const meta: PaginationMeta = {
         limit: 10,
         page: 1,
         total: response.count
      } 
      successResponse(res, 200, response.result, meta);
   } catch (error) {
      // Logging berdasarkan jenis error
      if (error instanceof AppError) {
         logger.warn(`[AppError in getSekolahByBanjarId]: ${error.message}`);
      } else if (error instanceof Error) {
         logger.error(
            `[Unexpected Error in getSekolahByBanjarId]: ${error.message}`,
            {
               stack: error.stack,
            }
         );
      } else {
         logger.error(
            `[Unknown Error in getSekolahByBanjarId]: ${JSON.stringify(error)}`
         );
      }
      next(error);
   }
}

export async function testingJarakTerdekat(
   req: Request,
   res: Response,
   next: NextFunction
) {
   try {
     const { siswa_id }: { siswa_id: number} = req.body
     const response = await PendaftaranService.testJarakTerdekat(siswa_id)
     successResponse(res, 200, response, null)
   } catch (error) {
      // Logging berdasarkan jenis error
      if (error instanceof AppError) {
         logger.warn(`[AppError in testingJarakTerdekat]: ${error.message}`);
      } else if (error instanceof Error) {
         logger.error(
            `[Unexpected Error in testingJarakTerdekat]: ${error.message}`,
            {
               stack: error.stack,
            }
         );
      } else {
         logger.error(
            `[Unknown Error in testingJarakTerdekat]: ${JSON.stringify(error)}`
         );
      }
      next(error);
   }
}


