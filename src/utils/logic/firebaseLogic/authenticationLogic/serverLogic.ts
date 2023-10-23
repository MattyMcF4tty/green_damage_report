import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { getAdminAuth } from "../initFirebaseAdmin"
import { NextApiRequest } from "next";


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


export const getSession = (req:NextApiRequest) => {
    const { sessionToken } = req.cookies;
    return sessionToken;
}