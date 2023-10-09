import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "../schemas/miscSchemas/apiResponseSchema";

export function checkOrigin(req: NextApiRequest, allowedOrigins: string[]): boolean {
    const origin = req.headers.origin || req.headers.referer;

    if (!origin) return false;

    return allowedOrigins.some(o => origin.startsWith(o));
}


export const checkMethod = (
    req: NextApiRequest,
    res: NextApiResponse,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
): boolean => {
    if (req.method !== method) {
        res.status(405).json(new ApiResponse(
            "METHOD_NOT_ALLOWED",
            [],
            ["Method is not allowed"],
            {},
        ));
        return false;
    }
    return true;
}