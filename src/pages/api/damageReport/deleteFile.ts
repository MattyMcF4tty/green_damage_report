import { deleteDamageReportFile } from "@/utils/logic/damageReportLogic.ts/logic";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req:NextApiRequest, res:NextApiResponse) {
    // Verify method
    if (!verifyMethod(req, 'DELETE')) {
        return res.status(405).send(`Expected method DELETE but got ${req.method}`)
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
        return res.status(400).send(error.message)
    }

    try {
        await deleteDamageReportFile(reportId, filePath);

        return res.status(204).send('Successfully deleted file');
    } catch (error:any) {
        return res.status(500).send(error.message)
    }
}