import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | undefined;
export const getFirebaseApp = () => {
  if (!isBrowser) {
    throw new Error("Firebase can't be initialized on the server. Use getFirebaseApp only in the client-side environment.");
  }

  if (!firebaseApp) {
    
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  return firebaseApp;
};


let firebaseAuth: Auth;
export const getFirebaseAuth = () => {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
  }
  return  firebaseAuth;
};


let firebaseDatabase: Firestore | undefined;
export const getFirebaseDatabase = () => {
  if (!firebaseDatabase) {
    firebaseDatabase = getFirestore(getFirebaseApp());
  }
  return firebaseDatabase;
};


let firebaseStorage: FirebaseStorage | undefined;
export const getFirebaseStorage = () => {
  if (!firebaseStorage) {
    firebaseStorage = getStorage(getFirebaseApp());
  }
  return firebaseStorage;
};