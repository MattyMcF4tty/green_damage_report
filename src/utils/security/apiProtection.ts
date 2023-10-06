import { NextApiRequest } from "next";

export function checkOrigin(req: NextApiRequest, allowedOrigins: string[]): boolean {
    const origin = req.headers.origin || req.headers.referer;

    if (!origin) return false;

    return allowedOrigins.some(o => origin.startsWith(o));
}