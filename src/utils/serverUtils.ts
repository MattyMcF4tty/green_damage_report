import { NextApiRequest } from "next";

// TODO: Improve to be more secure, right now you can add a / to url and it will pass.
export function checkOrigin(req: NextApiRequest, allowedOrigins: string[]): boolean {
    const origin = req.headers.origin || req.headers.referer;

    if (!origin) return false;

    return allowedOrigins.some(o => origin.startsWith(o));
}


export const wunderToUTC = (wunderTime:string) => {
return wunderTime.replace(" ", "T") + "Z";
}

export const wunderToDate = (wunderTime: string) => {
return new Date(wunderToUTC(wunderTime));
}
  
// TODO: Create spam protection function