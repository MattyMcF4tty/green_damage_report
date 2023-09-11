import admin from "@/firebase/firebaseAdminConfig";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { userToken } = req.body;

        if (!userToken) {
            res.status(401).json({ message: 'Missing verification token' });
        }

        const decodedToken = await admin.auth().verifyIdToken(userToken);

        res.status(200).json({ message: 'User verified'})
    } catch (error: any) {
        res.status(500).json({ message: `something went wrong verifying user:\n${error.message}`});
    }
}