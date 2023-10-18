import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { getAdminAuth } from "../initFirebaseAdmin"
import { NextApiRequest } from "next";
import { getFirebaseAuth } from "../initFirebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";


export const createNewUser = async (email:string, password:string) => {
    const auth = getAdminAuth();

    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password
        })

        console.log('Successfully created new user:', userRecord.uid);
        return userRecord;
    } catch (error:any) {
        console.error('Error creating new user:', error);
        throw new AppError(error.code, error.message);
    }
}


export const verifySessionToken = async (idToken:string) => {
    const auth = getAdminAuth();

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        console.log('Token is valid', decodedToken);

        return decodedToken;
    } catch (error:any) {
        console.error('Error verifying token:', error);
        switch (error.code) {
            case 'auth/id-token-expired':
                throw new AppError('TOKEN_EXPIRED', error.message);
            case 'auth/id-token-revoked':
                throw new AppError('TOKEN_REVOKED', error.message);
            default:
                throw new AppError(error.code, error.message)
        }
    }
};


export const signOutUser = async () => {
    revokeSessionToken();
}

export const signInUser = async (email: string, password: string) => {
    const firebaseClientAuth = getFirebaseAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseClientAuth, email, password);

        const token = await userCredential.user.getIdToken();

        setSessionToken(token)

        // The signed-in user info can be accessed via userCredential.user
        return userCredential.user;
    } catch (error:any) {
        console.error("Error signing in:", error.message);
        throw error;
    }
};

export const getSession = (req:NextApiRequest) => {
    const { sessionToken } = req.cookies;
    return sessionToken;
}

export const setSessionToken = async (sessionToken: string) => {
    Cookies.set('sessionToken', sessionToken, { expires: 365 });  // token expires in 1 day
}

export const revokeSessionToken = async () => {
    Cookies.remove('sessionToken');
}