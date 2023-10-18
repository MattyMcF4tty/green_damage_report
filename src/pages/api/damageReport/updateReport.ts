import { updateDamageReport } from "@/utils/logic/damageReportLogic.ts/logic";
import { AdminDamageReportSchema } from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req:NextApiRequest, res:NextApiResponse) {
    // Verify method
    if (!verifyMethod(req, 'PATCH')) {
        return res.status(405).json(new ApiResponse(
            'METHOD_NOT_ALLOWED',
            [],
            [`Api route only accepts PATCH and got ${req.method}.`],
            {}
        ))
    }


    const { data } = req.body;
    const { reportId } = req.query;
    
    try {
        if (!reportId) {
            throw new Error('Missing reportId.');
        }
        if (typeof reportId !== 'string') {
            throw new Error(`Expected reportId to be string but got ${typeof reportId}.`);
        }
        if (!data) {
            throw new Error('Missing data.');
        }
        if (typeof data !== 'object') {
            throw new Error(`Expected data to be object but got ${typeof data}.`);
        }
    } catch (error:any) {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            [error.message],
            {}
        ))
    }

    try {
        await updateDamageReport(reportId, data)

        return res.status(200).json(new ApiResponse(
            'OK',
            [`Successfully updated damagereport ${reportId}.`],
            [],
            {}
        ))
    } catch (error:any) {
        switch (error.name) {
            case 'NOT_FOUND':
                return res.status(404).json(new ApiResponse(
                    'OK',
                    [`Document ${reportId} does not exist.`],
                    [],
                    {}
                ))
            default:
                return res.status(500).json(new ApiResponse(
                    'INTERNAL_ERROR',
                    [],
                    ['Something went wrong.'],
                    {}
                ))
        }
    }
}