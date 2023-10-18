import { queryDamageReports } from "@/utils/logic/damageReportLogic.ts/logic";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req:NextApiRequest, res:NextApiResponse) {
    // Verify method
    if (!verifyMethod(req, 'POST')) {
        return res.status(405).json(new ApiResponse(
            'METHOD_NOT_ALLOWED',
            [],
            [`Api route only accepts POST and got ${req.method}.`],
            {}
        ))
    }

    const {qVar, qOperation, qValue} = req.body;
    try {
        if (typeof qVar !== 'string') {
            throw new Error(`Expected qVar to be string but got ${typeof qVar}`)
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
        const qResult = await queryDamageReports(qVar, qOperation, qValue)

        const docIds = qResult.docs.map((doc) => {
            return doc.id;
        })

        return res.status(200).json(new ApiResponse(
            'OK',
            [`Found ${docIds.length} report${docIds.length !== 1 && 's'} matching criteria.`],
            [],
            {docIds: docIds}
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