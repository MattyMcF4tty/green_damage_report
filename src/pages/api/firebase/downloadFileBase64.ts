import { getStorageDownloadUrl } from "@/utils/firebaseUtils/storageUtils";
import { apiResponse } from "@/utils/types";
import { urlToBase64 } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req: NextApiRequest, res: NextApiResponse) {

    // Check method
    if (req.method !== "POST") {
        return res.status(405).json(new apiResponse(
            "METHOD_NOT_ALLOWED",
            [],
            ["Method is not allowed"],
            {},
        ))
    }

    const {storagePath, fileUrl} = req.body;

    try {
        if (!storagePath && !fileUrl) {
            throw new Error("Missing storagePage or url")
        }
        if (storagePath && fileUrl) {
            throw new Error("Can only fetch base64 file from either url or storagePath not both")
        }
    } catch (error:any) {
        return res.status(400).json(new apiResponse(
            'BAD_REQUEST',
            [],
            [error.message],
            {}
        ))
    }

    let base64File: string;
    if (storagePath) {
        let newFileUrl: string;
        try {
            newFileUrl = await getStorageDownloadUrl(storagePath)
        } catch (error:any) {
            if (error.name === 'NOT_FOUND') {
                return res.status(404).json(new apiResponse(
                    error.message,
                    [],
                    [error.message],
                    {}
                ))
            }

            return res.status(500).json(new apiResponse(
                error.name,
                [],
                [error.message],
                {}
            ))
        }

        //Now we convert the downloadUrl to base64
        try {
            base64File = await urlToBase64(newFileUrl)
        } catch (error:any) {
            return res.status(500).json(new apiResponse(
                'SERVER_ERROR',
                [],
                [error.message],
                {}
            ))
        }

    } else if (fileUrl) {
        //Now we convert the downloadUrl to base64
        try {
            base64File = await urlToBase64(fileUrl)
        } catch (error:any) {
            return res.status(500).json(new apiResponse(
                'SERVER_ERROR',
                [],
                [error.message],
                {}
            ))
        }
    } else {
        console.error("Something went wrong checking for fileUrl and storagePath, none is initialized.")
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    return res.status(200).json(new apiResponse(
        'OK',
        [`Fetching of base64 of ${storagePath ? storagePath : fileUrl} finished succesfully`],
        [],
        {base64File: base64File}
    ))
}