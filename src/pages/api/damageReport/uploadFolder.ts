import { uploadDamageReportFolder } from "@/utils/logic/damageReportLogic.ts/logic";
import { base64ToBuffer, isValidFileData } from "@/utils/logic/misc";
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
    const { folderPath, fileData } = req.body

    try {
        if (!reportId) {
            throw new Error('Missing reportId.')
        }
        if (typeof reportId !== 'string') {
            throw new Error(`Expected reportId to be type string, but got ${typeof reportId}`)
        }

        if (!folderPath) {
            throw new Error('Missing folderPath.')
        }
        if (typeof folderPath !== 'string') {
            throw new Error(`Expected folderPath to be type string, but got ${typeof folderPath}`)
        }

        if (!fileData) {
            throw new Error('Missing fileData.')
        }
        if (!isValidFileData(fileData)) {
            throw new Error(`fileData is wrong format.`)
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
        const convertedFileData = fileData.map((file) => {
            return {
                name: file.name,
                mimeType: file.mimeType,
                buffer: base64ToBuffer(file.fileBase64)
            }
        })

        await uploadDamageReportFolder(reportId, folderPath, convertedFileData)

        return res.status(200).json(new ApiResponse(
            'OK',
            [],
            [`Successfully uploaded ${convertedFileData.length} file${convertedFileData.length !== 1 && 's'}`],
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