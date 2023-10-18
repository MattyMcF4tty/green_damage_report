import { downloadDamageReportFolder, getDamageReportFolderDownloadUrls, uploadDamageReportFolder } from "@/utils/logic/damageReportLogic.ts/logic";
import { getSession, verifySessionToken } from "@/utils/logic/firebaseLogic/authenticationLogic/logic";
import { base64ToBuffer, bufferToBase64, isValidFileData } from "@/utils/logic/misc";
import { AdminUser } from "@/utils/schemas/adminUserSchema";
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
    const { folderPath } = req.body

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
    } catch (error:any) {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            [error.message],
            {}
        ))
    }

    try {
        const fileData = await getDamageReportFolderDownloadUrls(reportId, folderPath);

        return res.status(200).json(new ApiResponse(
            'OK',
            [],
            [`Successfully fetched ${fileData.length} download url${fileData.length !== 1 && 's'}.`],
            fileData
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