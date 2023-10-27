import { uploadDamageReportFile } from "@/utils/logic/damageReportLogic.ts/logic";
import { base64ToBuffer, verifyBase64String } from "@/utils/logic/misc";
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
    const { filePath, fileBase64} = req.body;
    try {
        if (!reportId) {
            throw new Error('Missing reportId.')
        }
        if (!filePath) {
            throw new Error('Missing filePath.')
        }
        if (!fileBase64) {
            throw new Error('Missing fileBase64.')
        }

        if (typeof reportId !== 'string') {
            throw new Error(`Expected reportId to be type string, got ${typeof reportId}.`)
        }
        if (typeof filePath !== 'string') {
            throw new Error(`Expected filePath to be type string, got ${typeof filePath}.`)
        }
        if (typeof fileBase64 !== 'string') {
            throw new Error(`Expected fileBase64 to be type string, got ${typeof fileBase64}.`)
        }
/*         if (!verifyBase64String(fileBase64)) {
            throw new Error('fileBase64 is not a valid base64 string.')
        } */
    } catch (error:any) {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            [error.message],
            {}
        ))
    }


    try {
        const fileBuffer = base64ToBuffer(fileBase64);

        await uploadDamageReportFile(reportId, filePath, fileBuffer);

        return res.status(200).json(new ApiResponse(
            'OK',
            ['File uploaded successfully.'],
            [],
            {}
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