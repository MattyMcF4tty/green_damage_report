import { queryFirestoreCollection } from "@/utils/logic/firebaseLogic/firestore";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { NextApiRequest, NextApiResponse } from "next";


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

    const {collection, key, value} = req.body;

    try {
        if (!collection) {
            throw new Error('Missing collection')
        } 
        if (!key) {
            throw new Error('key collection')
        } 
        if (!value) {
            throw new Error('value collection')
        } 
    } catch (error:any) {
        return res.status(400).json(new ApiResponse(
            "BAD_REQUEST",
            [],
            [error.message],
            {},
        ))
    }

    const result = await queryFirestoreCollection(collection as string, key, value);

    return res.status(200).json(new ApiResponse(
        'OK',
        [],
        [],
        {
            id: result.map((doc) => {
                return doc.id;
            }),
            data: result.map((doc) => {
                return doc.data()
            })
        }
    ))
}