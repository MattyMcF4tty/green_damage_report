import { FireStorage } from "@/firebase/firebaseConfig";
import axios from "axios";
import { ListResult, getDownloadURL, listAll, ref } from "firebase/storage";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        // Check if method is correct
        if (req.method !== "POST") {
            return res.status(405).json(new ApiResponse(
                "METHOD_NOT_ALLOWED",
                [],
                ["Method is not allowed"],
                {},
            ))
        }


        const { path, type } = req.body;
        try {
            if (!path || typeof path !== 'string') {
                throw new Error("Incorrect path")
            }
            if (!type || (type !== 'base64' && type !== 'url')) {
                throw new Error("Incorrect type")
            }
        } catch (error: any) {
            return res.status(400).json(new ApiResponse(
                "BAD_REQUEST",
                [],
                [error.message],
                {},
            ))
        }

        if (!FireStorage) {
            console.error("FireStorage is not defined")
            return res.status(500).json(new ApiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {},
            ))
        }
        const storageRef = ref(FireStorage, path)

        let imageNameList: ListResult;
        try {
            imageNameList = await listAll(storageRef);
        } catch (error: any) {
            console.error(`Could not listAll from ${storageRef}`, error.message)
            return res.status(500).json(new ApiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {},
            ))
        }

        // Get all images URLs from path.
        let images: string[] = [];
        try {
            images = await Promise.all(
                imageNameList.items.map(async (image) => {
                    const imageURL = await getDownloadURL(image);
                    return imageURL;
                })
            );
        } catch (error:any) {
            console.error(`Something went wrong fetching image urls from ${storageRef}`, error.message)
            return res.status(500).json(new ApiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {},
            ))
        }

        // Check if images should be base64, and convert images to such if true
        if (type === 'base64') {
            let base64Images: string[] = [];
            if (images.length > 0) {
                try {
                    base64Images = await Promise.all(
                        images.map(async (imageURL) => {
                            const response = await axios.get(imageURL, {
                                responseType: "arraybuffer",
                            });
    
                            // Convert image binary data to bas64
                            const imageBuffer = Buffer.from(response.data, "binary");
                            const base64Image = imageBuffer.toString("base64");
    
                            return `data:image/jpeg;base64,${base64Image}`;
                        }
                    ))
                } catch (error: any) {
                    console.error("Something went wrong converting image urls to base64", error.message)
                    return res.status(500).json(new ApiResponse(
                        "SERVER_ERROR",
                        [],
                        ["Something went wrong"],
                        {},
                    ))
                }
    
                // Update images variable to store base64Images instead.
                images = base64Images;
            }
        }

        res.status(200).json(new ApiResponse(
            "OK",
            ["Downloading images finished succesfully"],
            [],
            {images: images},
        ))
    } catch (error:any) {
        console.error("Something went wrong trying to run downloadImages", error.message)
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {},
        ))
    }
}