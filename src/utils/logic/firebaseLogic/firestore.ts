import { FireDatabase } from "@/firebase/firebaseConfig";
import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { DocumentData, QuerySnapshot, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { isJSONSerializable } from "../misc";

export const updateFirestoreDoc = async (path: string, data: {}) => {

  // We check if data is JSON serializeable. If not the data can not be sent to Firestore.
  if (!isJSONSerializable(data)) {
    throw new AppError('INVALID_FORMAT', 'Object is not json serializable.');
  }

  // We create a reference to the document we want to update.
  const docRef = doc(FireDatabase, path);

  // We try to update the doc. If it fails we catch the errors and return them.
  try {
    await updateDoc(docRef, data);
    return true;
  } catch (error: any) {
    //TODO: Fix error handling
    let newError: {name: string, message: string} = {name: error.code, message: error.message}
    switch (error.code) {
      case "not-found":
        newError.name = "NOT_FOUND";
        newError.message = `Document at ${path} does not exist`;
        break;
      case "permission-denied":
        newError.name = "UNAUTHORIZED";
        newError.message = `Permission denied to update the document`;
        break;
      case "unavailable":
        newError.name = "UNAVAILABLE";
        newError.message = `Firebase Firestore is currently unavailable`;
        break;
      case "cancelled":
        newError.name = "CANCELLED";
        newError.message = `Request to update document at ${path} was cancelled by Firebase Firestore`;
        break;
      default:
        newError.name = error.code || "UNKNOWN_ERROR";
        newError.message =
          error.message ||
          "An unknown error occurred while fetching the document";
        break;
    }

    throw new AppError(newError.name, newError.message);
  }
};

export const getFirestoreDoc = async (path: string) => {
  // We create a reference to the document we want to download.
  const docRef = doc(FireDatabase, path);

  try {
    const document = await getDoc(docRef);

    if (!document.exists()) {
      throw new AppError('NOT_FOUND', `Document ${path} not found`);
    }

    return document;
  } catch (error: any) {
    //TODO: Fix error handling
    let newError: {name: string, message: string} = {name: error.code, message: error.message}
    switch (error.code) {
      case 'NOT_FOUND':
        newError.name = error.name;
        newError.message = error.message;
        break;
      case "permission-denied":
        newError.name = "UNAUTHORIZED";
        newError.message = `Permission denied to access the document at ${path}`;
        break;
      case "unavailable":
        newError.name = "UNAVAILABLE";
        newError.message = `Firebase Firestore is currently unavailable`;
        break;
      case "cancelled":
        newError.name = "CANCELLED";
        newError.message = `Request to get document ${path} was cancelled by Firebase Firestore`;
        break;
      default:
        newError.name = error.code || "UNKNOWN_ERROR";
        newError.message =
          error.message ||
          "An unknown error occurred while fetching the document";
        break;
    }

    throw new AppError(newError.name, newError.message);
  }
};

export const createFirestoreDoc = async (path: string, data: {}) => {

  console.log(data)
  // Verify data is Json serializable.
  if (!isJSONSerializable(data)) {
    throw new AppError('INVALID_FORMAT', 'Object is not JSON serializable.');
  }

  const docRef = doc(FireDatabase, path);
  try {
    await setDoc(docRef, data);
    return true;
  } catch (error: any) {
    //TODO: FIX error handling.
    let newError: {name: string, message:string} = {name: error.code, message: error.message};

    switch (error.code) {
      case "unavailable":
        newError.name = "SERVICE_UNAVAILABLE";
        newError.message =
          "The Firestore service is currently unavailable. Please retry after some time.";
        break;

      case "deadline-exceeded":
        newError.name = "DEADLINE_EXCEEDED";
        newError.message =
          "The operation took too long to complete. Please try again.";
        break;

      case "internal":
        newError.name = "INTERNAL_ERROR";
        newError.message =
          "An internal error occurred in Firestore. Please try again.";
        break;

      case "permission-denied":
        newError.name = "PERMISSION_DENIED";
        newError.message =
          "You do not have the required permissions to perform this operation.";
        break;

      case "unauthenticated":
        newError.name = "UNAUTHENTICATED";
        newError.message =
          "You are not authenticated. Please sign in and try again.";
        break;

      default:
        newError.name = error.code || "UNKNOWN_ERROR";
        newError.message =
          error.message || "An unknown error occurred. Please try again.";
        break;
    }

    throw new AppError(newError.name, newError.message);
  }
};


export const getFirestoreCollection = async (collectionPath: string): Promise<QuerySnapshot<DocumentData>> => {
  const colRef = collection(FireDatabase, collectionPath);

  //TODO: Think of good way to handle firestore errors
  const docList = await getDocs(colRef);
  return docList;
};


export const handleFirestoreErrors = (error: any): Error => {
  const newError = new AppError(error.code, error.message);
  
  // Remove handleFirestoreErrors from the stack trace (it's usually the first line)
  const stackLines = newError.stack?.split('\n');
  if (stackLines) {
    newError.stack = [stackLines[0], ...stackLines.slice(2)].join('\n');
  }

  return newError;
};


export const queryFirestoreCollection = async (collectionName: string, key: string, value: string) => {
  try {    
    // Create a query against the specified collection where the key matches the value
    const q = query(collection(FireDatabase, collectionName), where(key, "==", value));

    const querySnapshot = await getDocs(q); // Execute the query
    

    return querySnapshot.docs; // Return results as an array of objects
  } catch (error) {
    console.error("Error querying Firestore: ", error); // Log error
    throw error; // Rethrow to be handled by calling function
  }
};