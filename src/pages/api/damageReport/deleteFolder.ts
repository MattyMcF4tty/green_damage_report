import { deleteDamageReportFolder } from "@/utils/logic/damageReportLogic.ts/logic";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req:NextApiRequest, res:NextApiResponse) {
    // Verify method
    if (!verifyMethod(req, 'DELETE')) {
        return res.status(405).send(`Api route only accepts DELETE and got ${req.method}.`)
    }

    const { reportId, folderPath } = req.query;

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
        return res.status(400).send(error.message)
    }

    try {
        await deleteDamageReportFolder(reportId, folderPath);

        return res.status(204).send(`Successfully deleted folder.`)
    } catch (error:any) {
        return res.status(500).send('Something went wrong.')
    }
}