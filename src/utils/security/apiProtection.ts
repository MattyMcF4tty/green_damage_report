import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "../schemas/miscSchemas/apiResponseSchema";

export function checkOrigin(req: NextApiRequest, allowedOrigins: string[]): boolean {
    const origin = req.headers.origin || req.headers.referer;

    if (!origin) return false;

    return allowedOrigins.some(o => origin.startsWith(o));
}


export const verifyMethod = (
    req: NextApiRequest,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
): boolean => {
    if (req.method !== method) {
        return false;
    }
    return true;
}


