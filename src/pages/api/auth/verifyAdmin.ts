import admin from "@/firebase/firebaseAdminConfig";
import { apiResponse } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { userToken } = req.body;

        if (!userToken || typeof userToken !== 'string') {
            res.status(401).json(new apiResponse(
                "UNAUTHORIZED",
                [],
                ['Missing verification token'],
                {},
                []
            ))
        }
        try {
            const decodedToken = await admin.auth().verifyIdToken(userToken);
        } catch ( error:any ) {
            if (error.code === 'auth/invalid-custom-token' || error.code === 'auth/custom-token-mismatch') {
                return res.status(401).json(new apiResponse(
                    "UNAUTHORIZED",
                    [],
                    ['Invalid credentials'],
                    {},
                    []
                ))
            } else if (error.code === 'auth/user-disabled') {
                return res.status(403).json(new apiResponse(
                    "UNAUTHORIZED",
                    [],
                    ['User disabled'],
                    {},
                    []
                ))
            } else {
                console.error("Something went wrong verifying user", error.code)
                return res.status(500).json(new apiResponse(
                    "SERVER_ERROR",
                    [],
                    ['Something went wrong'],
                    {},
                    []
                ))
            }
        }

        res.status(200).json(new apiResponse(
            "OK",
            ['User verified'],
            [],
            {},
            []
        ))
    } catch (error: any) {
        console.error("Something went wrong verifying user", error.message);
        res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ['Something went wrong'],
            {},
            []
        ))
    }
}