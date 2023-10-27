import { downloadDamageReportFile, getDamageReportFileDownloadUrl } from "@/utils/logic/damageReportLogic.ts/logic";
import { getSession, verifySessionToken } from "@/utils/logic/firebaseLogic/authenticationLogic/serverLogic";
import { AdminUser } from "@/utils/schemas/adminUserSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { fileTypeFromBuffer } from "file-type";
import { NextApiRequest, NextApiResponse } from "next";

//TODO: This apiRoute has not response messages on almost none if the responses. Fix it and the same for the handler

export default async function (req:NextApiRequest, res:NextApiResponse) {
    // Verify method
    if (!verifyMethod(req, 'GET')) {
        return res.status(405)
    } 

    //Verify user
    const sessionToken = getSession(req);
    if (!sessionToken) {
        return res.status(401)
    }
    if (typeof sessionToken !== 'string') {
        return res.status(400) 
    }

    let user: AdminUser;
    try {
        const decodedToken = await verifySessionToken(sessionToken)
        user = {email: decodedToken.email || 'Unkown', uid: decodedToken.uid}
    } catch (error:any) {
        console.error(error)
        return res.status(403)
    }

    const {reportId, filePath} = req.query;
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
        console.error(error)
        return res.status(400)
    }

    try {
        const fileData = await downloadDamageReportFile(reportId, filePath)

    // Assuming you know the MIME type or can extract it from the filePath
    const mimeType = await fileTypeFromBuffer(fileData.buffer); 
    if (!mimeType) {
        throw new Error(`File is missing mimeType: ${mimeType}`)
    }


    const fileName = fileData.name; // Extract the filename or define it

    res.setHeader('Content-Type', mimeType.mime);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    return res.status(200).send(fileData.buffer);
    } catch (error:any) {
        console.error(error)
        if (error.name === 'NOT_FOUND') {
            return res.status(404)
        } else {
            return res.status(500)
        }
    }
}