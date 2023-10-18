import { getAllDamageReports } from "@/utils/logic/damageReportLogic.ts/logic";
import { getSession, verifySessionToken } from "@/utils/logic/firebaseLogic/authenticationLogic/logic";
import { AdminUser } from "@/utils/schemas/adminUserSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req:NextApiRequest, res:NextApiResponse) {
    // Verify method
    if (!verifyMethod(req, 'DELETE')) {
        return res.status(405).json(new ApiResponse(
            'METHOD_NOT_ALLOWED',
            [],
            [`Api route only accepts DELETE and got ${req.method}.`],
            {}
        ))
    }

    //Verify user
    const sessionToken = getSession(req);
    if (!sessionToken) {
        return res.status(401).json(new ApiResponse(
            'UNAUTHORIZED',
            [],
            ['Missing authorization.'],
            {}
        ))
    }
    if (typeof sessionToken !== 'string') {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            ['Invalid authorization format.'],
            {}
        ));    
    }

    let user: AdminUser;
    try {
        const decodedToken = await verifySessionToken(sessionToken)
        user = {email: decodedToken.email || 'Unkown', uid: decodedToken.uid}
    } catch (error:any) {
        return res.status(403).json(new ApiResponse(
            'FORBIDDEN',
            [],
            ['You do not have permission to access this resource.'],
            {}
        ));    
    }


    try {
        const reports = await getAllDamageReports();

        console.log(`${user.uid} fetched all damagereports.`)
        return res.status(200).json(new ApiResponse(
            'OK',
            [],
            ['Successfully fetched all damagereports'],
            {damageReports: reports}
        ))
    } catch (error:any) {
        return res.status(500).json(new ApiResponse(
            'INTERNAL_ERROR',
            [],
            ['Something went wrong.'],
            {}
        ))
    }
}