import { checkMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyAdmin } from "@/utils/logic/firebaseLogic/authentication";
import { getAdminDamageReport } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";

export default async function (req:NextApiRequest, res:NextApiResponse) {

    if (!checkMethod(req, res, 'GET')) {
        return;
    }

    const { Authorization } = req.headers;
    if (!Authorization) {
        return res.status(401).json(new ApiResponse(
            'UNAUTHORIZED',
            [],
            ['Missing authorization token.'],
            {}
        ))
    } else if (typeof Authorization !== 'string') {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            ['Authorization token is not valid type.'],
            {}
        ))
    }

    const { reportId } = req.body;
    if (!reportId || typeof reportId !== 'string') {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            ['Report is null or not a string.'],
            {}
        ))
    }

    try {
        await verifyAdmin(Authorization)
    } catch (error:any) {
        if (error.name === 'UNEXPECTED') {
            return res.status(500).json(new ApiResponse(
                'INTERNAL_ERROR',
                [],
                ['Something went wrong.'],
                {}
            ))
        } else if (error.name === 'TOO_MANY_REQUESTS') {
            return res.status(429).json(new ApiResponse(
                error.name,
                [],
                [error.message],
                {}
            ))
        }

        return res.status(401).json(new ApiResponse(
            error.name,
            [],
            [error.message],
            {}
        ))
    }

    // Get report
    let damageReport;
    try {
        damageReport = await getAdminDamageReport(reportId)
    } catch (error:any)  {
        if (error.name === 'NOT_FOUND') {
            return res.status(204).json(new ApiResponse(
                'OK',
                [`Report: ${reportId} not found`],
                [],
                {}
            ))
        }

        console.error(`Error getting report with id: ${reportId}, ${error.code}`)
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    return res.status(200).json(new ApiResponse(
        'OK',
        [`Damage report ${reportId} fetched succesfully.`],
        [],
        damageReport.toPlainObject()
    ))

}