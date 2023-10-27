import { getFolderFilesMetaData } from "@/utils/logic/firebaseLogic/storageLogic/logic";
import { normalizeFolderPath } from "@/utils/logic/misc";
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

    const {reportId, folderPath} = req.body;
    try {
        if (typeof reportId !== 'string') {
            throw new Error(`Expected reportId to be string but got: ${typeof reportId}`)
        }
        if (typeof folderPath !== 'string') {
            throw new Error(`Expected folderPath to be string but got: ${typeof folderPath}`)
        }
    } catch (error:any) {
        console.error(error);
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            [error.message],
            {}
        ))
    }

    try {
        const normalizedFolderPath = normalizeFolderPath(`${reportId}/${folderPath}`);
        const files = await getFolderFilesMetaData(normalizedFolderPath);

        const fileNames = files.map((file) => {
            const fileName = file.name.split('/').pop();
            return fileName;
        })

        console.log(fileNames)

        return res.status(200).json(new ApiResponse(
            'OK',
            [`Successfully found ${fileNames.length} file${fileNames.length !== 1 && 's'} in folder`],
            [],
            {fileNames: fileNames}
        ))
    } catch (error:any) {
        console.error(error)
        return res.status(500).json(new ApiResponse(
            'INTERNAL_ERROR',
            [],
            ['Something went wrong'],
            {}
        ))
    }
}