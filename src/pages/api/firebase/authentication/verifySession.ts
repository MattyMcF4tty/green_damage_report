import { getSession, verifySessionToken } from "@/utils/logic/firebaseLogic/authenticationLogic/logic";
import { AdminUserSchema } from "@/utils/schemas/adminUserSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req:NextApiRequest, res:NextApiResponse) {

    if (!verifyMethod(req, 'GET')) {
        return res.status(405).json(new ApiResponse(
            'METHOD_NOT_ALLOWED',
            [],
            [`Api route only accepts GET and got ${req.method}.`],
            {}
        ))
    }

    const sessionToken = getSession(req);

    if (!sessionToken) {
        return res.status(401).json(new ApiResponse(
            'UNAUTHORIZED',
            [],
            ['Missing sessionToken.'],
            {}
        ))
    }

    try {
        const decodedToken = await verifySessionToken(sessionToken);

        const user:AdminUserSchema = {uid: decodedToken.uid, email: decodedToken.email || 'Unknown'}

        return res.status(200).json(new ApiResponse(
            'OK',
            ['Session verified.'],
            [],
            {user: user}
        ))
    } catch (error:any) {
        switch (error.name) {
            case 'TOKEN_EXPIRED':
                return res.status(401).json(new ApiResponse(
                    'UNAUTHORIZED',
                    [],
                    ['SessionToken expired.'],
                    {}
                ))
            case 'TOKEN_REVOKED':
                return res.status(401).json(new ApiResponse(
                    'UNAUTHORIZED',
                    [],
                    ['SessionToken has been revoked.'],
                    {}
                ))
            default:
                return res.status(401).json(new ApiResponse(
                    'INTERNAL_ERROR',
                    [],
                    ['Something went wrong.'],
                    {}
                ))
        }
    }
}