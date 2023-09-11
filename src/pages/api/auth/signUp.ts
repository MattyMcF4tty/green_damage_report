import admin from '@/firebase/firebaseAdminConfig';
import app from '@/firebase/firebaseConfig';
import { NextApiRequest, NextApiResponse } from 'next';
import { Auth, getAuth, signInWithCustomToken } from 'firebase/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: 'Please provide an email and password' });
    }

    const userRecord = await admin.auth().createUser({ email, password });
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    // Sign in with the custom token using client SDK
    const auth = getAuth(app)
    const userCredential = await signInWithCustomToken(auth as Auth, customToken);
    
    // Get the ID token
    const idToken = await userCredential.user?.getIdToken();

    if (!idToken) {
      return res.status(401).json({ message: 'Failed to obtain ID token' });
    }

    res.status(200).json({ userToken: idToken });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong '})
  }
};
