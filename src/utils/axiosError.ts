import { AxiosError } from "axios";
import { AppError } from "./appError";

export function handleAxiosError(error: unknown): never {
    if (error instanceof AxiosError && error.response) {
        if (error.status === 500) {
            throw new Error("Terjadi masalah pada server")
        }

        if (error.response.data?.errors) {
            throw new AppError(error.response.data.message, error.response.status)
        }

        throw new AppError(error.response.data?.error?.message, error.response.status);
    }
    throw error;
}