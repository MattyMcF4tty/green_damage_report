import { FireStorage } from "@/firebase/firebaseConfig";
import axios from "axios";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { path, type } = req.body;

        if (!path) {
            res.status(400).json({ message: 'Missing path to image', data: [] })
        }
        if (!type) {
            res.status(400).json({ message: 'Image type not specified', data: [] })
        }

        const storageRef = ref(FireStorage, path)

        const imageNameList = await listAll(storageRef);

        // Get all images URLs from path.
        let images: string[] 
        try {
            images = await Promise.all(
                imageNameList.items.map(async (image) => {
                    const imageURL = await getDownloadURL(image);
                    return imageURL;
                })
            );
        } catch (error:any) {
            throw new Error('Error fetching image URLs from firebase storage:\n', error.message)
        }

        // Check if images should be base64, and convert images to such if true
        if (type === 'base64') {
            if (images.length > 0) {
                const base64Images = await Promise.all(
                    images.map(async (imageURL) => {
                        try {
                            const response = await axios.get(imageURL, {
                                responseType: "arraybuffer",
                            });
    
                            // Convert image binary data to bas64
                            const imageBuffer = Buffer.from(response.data, "binary");
                            const base64Image = imageBuffer.toString("base64");
    
                            return `data:image/jpeg;base64,${base64Image}`;
                        } catch (error:any) {
                            // Throw error if getting to base64 fails
                            throw new Error('Error getting base64 from url:\n', error.message)
                        }
                    })
                )
    
                // Update images variable to store base64Images instead.
                images = base64Images;
            }
        }

        res.status(200).json({ message: 'Fetching images completed succesfully', data: images })
    } catch (error:any) {
        res.status(500).json({ message: `Something went wrong:\n${error.message}`, data: [] })
    }
}