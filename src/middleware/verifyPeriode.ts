import axios from "axios"
import { NextFunction, Request, Response } from "express"
import { generateAccessToken } from "../utils/jwt"
import { GetAllJadwalRequest } from "../interfaces/pendaftaranInterface"
import { logger } from "../utils/logger"
import { AppError } from "../utils/appError"
import { env } from "../config/envConfig"

export const verifyPeriode = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {periode_jalur_id}: {periode_jalur_id: number} = req.body
        const url = `${env.PERIODE_SERVICE_URL}/jadwal/${periode_jalur_id}`
        const token = generateAccessToken({userId: 0, role: "adminDisdik"})
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const jadwals: GetAllJadwalRequest[] = response.data.data
        logger.info(jadwals)
        const jadwalPendaftaran = jadwals.filter((jadwal) => jadwal.tahapan_nama.toLowerCase() === "pendaftaran" && jadwal.is_closed !== 1)
        const now = new Date().getTime()
        const waktu_mulai = new Date(jadwalPendaftaran[0].waktu_mulai).getTime()
        const waktu_selesai = new Date(jadwalPendaftaran[0].waktu_selesai).getTime()
        if(waktu_mulai > now || waktu_selesai < now) {
            return next(new AppError("Tidak ada jadwal pendaftaran yang sedang berlangsung", 404))
        }

        req.body.jadwal_pendaftaran = jadwalPendaftaran[0]
        next()
    } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
            logger.error(error.status)
            logger.error(error.response.data)
            return next(new AppError(error.response.data, error.response.status))
        }
        else {
            logger.error(`something wrong in verifyPeriode middleware`)
            logger.error(error)
        }
        return next(new Error("Internal server error"))
    }
}