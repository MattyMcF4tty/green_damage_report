import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import admin from "firebase-admin";

let firebaseAdmin: admin.app.App;

export const getFirebaseAdmin = () => {
  if (!firebaseAdmin) {
    try {
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
      if (!privateKey) {
        throw new AppError(
          "INTERNAL_ERROR",
          "FIREBASE_ADMIN_PRIVATE_KEY is not defined in enviroment."
        );
      }

      // For some next will not build if NEWLINE is replaced with \\
      const correctedPrivateKey = privateKey.replace(/NEWLINEn/gm, "\n");

      if (!admin.apps.length) {
        firebaseAdmin = admin.initializeApp({
          credential: admin.credential.cert({
            privateKey: correctedPrivateKey,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL as string,
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID as string,
          }),
          databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL as string,
          storageBucket: process.env
            .NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
        });
      } else {
        firebaseAdmin = admin.app(); // Use the default app if it's already initialized.
      }
    } catch (error) {
      console.error(
        "Something went wrong initializing the Firebase Admin SDK:\n",
        error
      );
      throw error; // Propagate the error so that calling code knows initialization failed.
    }
  }

  return firebaseAdmin;
};

export const getAdminStorage = () => {
  try {
    return getFirebaseAdmin().storage();
  } catch (error: any) {
    throw new AppError(
      "INTERNAL_ERROR",
      `Error getting Firebase admin storage bucket: ${error.message}`
    );
  }
};

export const getAdminFirestore = () => {
  return getFirebaseAdmin().firestore();
};

export const getAdminAuth = () => {
  return getFirebaseAdmin().auth();
};
