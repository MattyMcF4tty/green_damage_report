import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "../initFirebaseClient";
import Cookies from "js-cookie";

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

export const revokeSessionToken = async () => {
    Cookies.remove('sessionToken');
}

export const setSessionToken = async (sessionToken: string) => {
    Cookies.set('sessionToken', sessionToken, { expires: 365 });  // token expires in 1 day
}

export const signOutUser = async () => {
    const firebaseClientAuth = getFirebaseAuth();

    await signOut(firebaseClientAuth);
    revokeSessionToken();
}