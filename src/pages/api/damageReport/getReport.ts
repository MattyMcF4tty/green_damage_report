import { getDamageReport } from "@/utils/logic/damageReportLogic.ts/logic";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req:NextApiRequest, res:NextApiResponse) {
    // Verify method
    if (!verifyMethod(req, 'GET')) {
        return res.status(405).json(new ApiResponse(
            'METHOD_NOT_ALLOWED',
            [],
            [`Api route only accepts GET and got ${req.method}.`],
            {}
        ))
    } 

    const { reportId } = req.query;
    try {
        if (!reportId) {
            throw new Error('Missing reportId.')
        }
        if (typeof reportId !== 'string') {
            throw new Error(`Expected reportId to be string but got ${typeof reportId}.`)
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
        const customerDamageReport = new CustomerDamageReport();
        customerDamageReport.updateFields(await getDamageReport(reportId));
        
        return res.status(200).json(new ApiResponse(
            'OK',
            [`Successfully fetched damagereport ${reportId}.`],
            [],
            customerDamageReport.crypto('decrypt')
        ))
    } catch (error:any) {
        switch(error.name) {
            case 'NOT_FOUND':
                return res.status(404).json(new ApiResponse(
                    'OK',
                    [error.message],
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