import admin from "@/firebase/firebaseAdminConfig";
import AppError from "@/utils/schemas/miscSchemas/errorSchema";

export const verifyAdmin = async (authToken: string) => {
    try {
        await admin.auth().verifyIdToken(authToken);
    } catch (error:any) {
        switch (error.code) {
            case 'auth/id-token-expired' || 'auth/session-cookie-expired':
                throw new AppError('EXPIRED_TOKEN', 'Authentication token expired.');
            case 'auth/id-token-revoked' || 'auth/session-cookie-revoked':
                throw new AppError('REVOKED_TOKEN', 'Authentication token revoked.');
            case 'auth/invalid-id-token':
                throw new AppError('INVALID_TOKEN', 'Invalid authorization token.');
            case 'auth/too-many-requests':
                throw new AppError('TOO_MANY_REQUESTS', 'Too many requests.');
            case 'auth/user-not-found':
                throw new AppError('NOT_FOUND', 'User not found.');
            default:
                throw new AppError('UNEXPECTED', error.message);
        }
    }
    
}