import admin from '@/firebase/firebaseAdminConfig';
import app, { FireAuth } from '@/firebase/firebaseConfig';
import { NextApiRequest, NextApiResponse } from 'next';
import { Auth, UserCredential, getAuth, signInWithCustomToken } from 'firebase/auth';
import { ApiResponse } from '@/utils/schemas/miscSchemas/apiResponseSchema';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Check if method is correct
    if (req.method !== "POST") {
      return res.status(405).json(new ApiResponse(
          "METHOD_NOT_ALLOWED",
          [],
          ["Method is not allowed"],
          {},
      ))
    }

    const { email, password } = req.body;

    try {
      if (!email || typeof email !== 'string') {
        throw new Error("Please provide a valid Email")
      }
      if (!password || typeof password !== 'string') {
        throw new Error("Please provide a valid password")
      }
    } catch ( error: any ) {
      return res.status(400).json(new ApiResponse(
        "BAD_REQUEST",
        [],
        [error.message],
        {},
      ))
    }

    let userRecord: UserRecord;
    try {
      userRecord = await admin.auth().createUser({ email, password });
    } catch ( error:any ) {
      console.error("Something went wrong creating user")
      return res.status(500).json(new ApiResponse(
        "SERVER_ERROR",
        [],
        ["Something went wrong"],
        {},
      ))
    }

    let customToken:string;
    try {
      customToken = await admin.auth().createCustomToken(userRecord.uid);
    } catch ( error:any ) {
      console.error("Something went wrong creating custom token for user")
      return res.status(500).json(new ApiResponse(
        "SERVER_ERROR",
        [],
        ["Something went wrong"],
        {},
      ))
    }

    // Sign in with the custom token using client SDK
    const auth = FireAuth;
    if (!auth) {
        console.error("Firebasebase Authentication not defined")
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {},
        ))
    }

    let userCredential: UserCredential
    try {
      userCredential = await signInWithCustomToken(auth as Auth, customToken);
    } catch ( error:any ) {
      console.error("Error signing in new user with custom token", error.code);
      return res.status(500).json(new ApiResponse(
        "SERVER_ERROR",
        [],
        ['Something went wrong'],
        {},
      ))
    }
    
    // Get the ID token

    let userToken: string;
    try {
        userToken = await userCredential.user?.getIdToken();
    } catch ( error:any ) {
        console.error("Something went wrong getting user id token", error.code)
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {},
        ))
    }

    res.status(200).json(new ApiResponse(
      "OK",
      ["User created succesfully"],
      [],
      {},
    ));
  } catch (error:any) {
    console.error("Something went wrong creating new user", error.message)
    res.status(500).json(new ApiResponse(
      "SERVER_ERROR",
      [],
      ["Something went wrong"],
      {},
    ))
  }
};
