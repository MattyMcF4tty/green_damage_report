import { getDamageReportFileDownloadUrl } from "@/utils/logic/damageReportLogic.ts/logic";
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

    const { reportId } = req.query;
    const { filePath } = req.body;
    try {
        if (!reportId) {
            throw new Error('Missing reportId.')
        }
        if (!filePath) {
            throw new Error('Missing filePath.')
        }

        if (typeof reportId !== 'string') {
            throw new Error(`Expected reportId to be string, but got ${typeof reportId}`)
        }
        if (typeof filePath !=='string') {
            throw new Error(`Expected filePath to be string, but got ${typeof filePath}`)
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
        const fileData = await getDamageReportFileDownloadUrl(reportId, filePath)

        return res.status(200).json(new ApiResponse(
            'OK',
            ['Successfully fected download url from file.'],
            [],
            fileData
        ))
    } catch (error:any) {
        if (error.name === 'NOT_FOUND') {
            return res.status(404).json(new ApiResponse(
                'OK',
                [],
                [error.message],
                {}
            ))
        } else {
            return res.status(500).json(new ApiResponse(
                'INTERNAL_ERROR',
                [],
                ['Something went wrong.'],
                {}
            ))
        }
    }
}