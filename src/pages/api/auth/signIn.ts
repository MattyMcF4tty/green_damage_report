import app from "@/firebase/firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const auth = getAuth(app); // Assuming you've already initialized your Firebase app
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Please enter an email and password'})
        }

        const userCred = await signInWithEmailAndPassword(auth, email, password)

        const userToken = await userCred.user?.getIdToken();

        res.status(200).json({ message: 'User succesfully signed in', userToken: userToken})
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong signing in user' })
    }
}