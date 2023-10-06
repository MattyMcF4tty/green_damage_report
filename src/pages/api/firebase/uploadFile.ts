import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { uploadReportFile } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";
import { arrayBufferToBlob, base64ToBuffer } from "@/utils/logic/misc";


export default async function (req:NextApiRequest, res:NextApiResponse) {

    // Check method
    if (req.method !== "POST") {
        return res.status(405).json(new ApiResponse(
            "METHOD_NOT_ALLOWED",
            [],
            ["Method is not allowed"],
            {},
        ))
    }

    const { fileBase64, fileType, id, path } = req.body;

    // Check if variables exists
    try {
        if (!fileBase64) {
            throw new Error("File is NULL")
        }
        if (!fileType) {
            throw new Error("FileType is NULL")
        }
        if (!id) {
            throw new Error("id is NULL")
        }
        if (!path) {
            throw new Error("path is NULL")
        }
    } catch (error:any) {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            [error.message],
            {}
        ))
    }

    let fileBuffer: Buffer;
    try {
        fileBuffer = base64ToBuffer(fileBase64)
    } catch (error: any) {
        console.error(`Error converting base64File to arrayBuffer, ${error}`)
        return res.status(500).json(new ApiResponse(
            'SERVER_ERROR',
            [],
            ['Something went wrong'],
            {}
        ))
    }

    let fileBlob: Blob;
    try {
        fileBlob = arrayBufferToBlob(fileBuffer, fileType);
    } catch (error:any) {
        console.error(`Error converting file arrayBuffer to Blob, ${error}`)
        return res.status(500).json(new ApiResponse(
            'SERVER_ERROR',
            [],
            ['Something went wrong'],
            {}
        ))
    }

    try {
        await uploadReportFile(id, path, fileBlob)
    } catch (error:any) {
        console.error(`Error uploading file to firebase storage, ${error}`)
        return res.status(500).json(new ApiResponse(
            'SERVER_ERROR',
            [],
            ['Something went wrong'],
            {}
        ))
    }

    return res.status(200).json(new ApiResponse(
        'OK',
        [],
        ['File uploaded successfully'],
        {}
    ))

} // TODO: FIX