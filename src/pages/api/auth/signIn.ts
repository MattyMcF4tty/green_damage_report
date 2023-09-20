import { FireAuth } from "@/firebase/firebaseConfig";
import { apiResponse } from "@/utils/types";
import { UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Check if method is correct
        if (req.method !== "POST") {
            return res.status(405).json(new apiResponse(
                "METHOD_NOT_ALLOWED",
                [],
                ["Method is not allowed"],
                {},
                []
            ))
        }

        const auth = FireAuth;
        if (!auth) {
            console.error("Firebasebase Authentication not defined")
            return res.status(500).json(new apiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {},
                []
            ))
        }
        
        const { email, password } = req.body;

        try {
            if (!email || typeof email !== 'string') {
                throw new Error("Incorrect email format")
            }
            if (!password || typeof password !== 'string') {
                throw new Error("Incorrect password format")
            }
        } catch (error:any) {
            return res.status(400).json(new apiResponse(
                "BAD_REQUEST",
                [],
                [error.message],
                {},
                []
            ))
        }

        let userCred: UserCredential;
        try {
            userCred = await signInWithEmailAndPassword(auth, email, password)
        } catch (error:any) {
            if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
                return res.status(401).json(new apiResponse(
                    "UNAUTHORIZED",
                    [],
                    ["Wrong email or password"],
                    {},
                    []
                ))
            } else {
                console.error("Something went wrong signing in user", error.code, error.message)
                return res.status(500).json(new apiResponse(
                    "SERVER_ERROR",
                    [],
                    ["Something went wrong"],
                    {},
                    []
                ))
            }
        }

        let userToken: string;
        try {
            userToken = await userCred.user?.getIdToken();
        } catch ( error:any ) {
            console.error("Something went wrong getting user id token", error.code)
            return res.status(500).json(new apiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {},
                []
            ))
        }
        

        res.status(200).json(new apiResponse(
            "OK",
            ["User succesfully signed in"],
            [],
            {userToken: userToken},
            []
        ))
    } catch (error:any) {
        console.error("Something went wrong signing in user", error.message)
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {},
            []
        ))    
    }
}