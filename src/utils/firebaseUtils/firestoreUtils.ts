import { FireDatabase } from "@/firebase/firebaseConfig";
import { DocumentData, QuerySnapshot, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { decryptData, generateId, isJSONSerializable, reportDataType } from "../utils";
import { decryptReport, encryptReport } from "../securityUtils";
import { listAll } from "firebase/storage";

export const updateFirestoreDoc = async (path: string, data: {}) => {

  // We check if Firestore is initialized.
  const fireDB = FireDatabase;
  if (!fireDB) {
    let newError = new Error;
    newError.name = "SERVER_ERROR";
    newError.message = 'FireDatabase is not initialized'
    throw newError;
  }

  // We check if data is JSON serializeable. If not the data can not be sent to Firestore.
  if (!isJSONSerializable(data)) {
    let newError = new Error;
    newError.name = 'NON_SERIALIZABLE';
    newError.message = 'Data is not JSON serializable'
    throw newError;
  }

  // We create a reference to the document we want to update.
  const docRef = doc(fireDB, path);

  // We try to update the doc. If it fails we catch the errors and return them.
  try {
    await updateDoc(docRef, data)
  } catch (error:any) {
    let newError = new Error;
    switch (error.code) {
      case 'not-found':
        newError.name = 'NOT_FOUND';
        newError.message = `Document at ${path} does not exist`
        break;
      case 'permission-denied':
        newError.name = 'UNAUTHORIZED';
        newError.message = `Permission denied to update the document`
        break;
      case 'unavailable':
        newError.name = 'UNAVAILABLE';
        newError.message = `Firebase Firestore is currently unavailable`
        break;
      case 'cancelled':
        newError.name = 'CANCELLED';
        newError.message = `Request to update document at ${path} was cancelled by Firebase Firestore`
        break;
      default:
        newError.name = error.code || "UNKNOWN_ERROR";
        newError.message = error.message || "An unknown error occurred while fetching the document"
        break;
    }

    throw newError;
  }
}

export const updateReportDoc = async (reportId: string, data: reportDataType) => {

  // We get our encryption collection name from the enviroment
  const damageReportCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    let newError = new Error;
    newError.name = 'SERVER_ERROR';
    newError.message = 'DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment'
    throw newError;
  }

  // Here we encrypt the data before sending it to our database
  let encryptedData: reportDataType;
  try {
    encryptedData = encryptReport(data)
  } catch (error) {
    throw error;
  }

  // We update when the document was last changed.
  encryptedData.updateFields({lastChange: `${new Date}`})

  // We upload the data to the given document
  try {
    await updateFirestoreDoc(`${damageReportCol}/${reportId}`, encryptedData.toPlainObject())
  } catch ( error:any ) {
    throw error;
  }
}


export const getFirestoreDoc = async (path: string) => {

  // We check if Firestore is initialized.
  const fireDB = FireDatabase;
  if (!fireDB) {
    throw new Error("FireDatabase is not initialized");
  };

  // We create a reference to the document we want to download.
  const docRef = doc(fireDB, path);

  let docData;
  try {
    const document = await getDoc(docRef);

    if (!document.exists()) {
      let newError = new Error;
      newError.name = 'NOT_FOUND';
      newError.message = `Document at ${path} does not exist in Firestore`
      throw newError;
    }

    docData = document.data();
  } catch (error:any) {
    let newError = new Error;
    switch (error.code) {
      case 'NOT_FOUND':
        newError = error
        break;
      case 'permission-denied':
        newError.name = 'UNAUTHORIZED'
        newError.message = `Permission denied to access the document at ${path}`
        break;
      case 'unavailable':
        newError.name = 'UNAVAILABLE'
        newError.message = `Firebase Firestore is currently unavailable`
        break;
      case 'cancelled':
        newError.name = 'CANCELLED'
        newError.message = `Request to get document ${path} was cancelled by Firebase Firestore`
        break;
      default:
        newError.name = error.code || "UNKNOWN_ERROR"
        newError.message = error.message || "An unknown error occurred while fetching the document"
        break;
    }

    throw newError;
  }

  return docData;
}


export const getReportDoc = async (reportId: string, authorized: boolean) => {
  // We get our encryption collection name from the enviroment
  const damageReportCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    let newError = new Error;
    newError.name = "SERVER_ERROR";
    newError.message = 'DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment'
    throw newError;
  }

  // we get the data from firebase
  let documentData;
  try {
    documentData = await getFirestoreDoc(`${damageReportCol}/${reportId}`)
  } catch (error:any) {
    throw error;
  }

  // We convert it to our report format
  let reportData = new reportDataType();
  try {
    reportData.updateFields(documentData);
  } catch (error:any) {
    let newError = new Error;
    newError.name = "WRONG_FORMAT";
    newError.message = 'The document data does not match the required format for a report'
    throw newError;
  }

  // We decrypt the report
  let decryptedData = new reportDataType();
  try {
    decryptedData = decryptReport(reportData, authorized)
  } catch (error) {
    throw error
  }

  return decryptedData;
}

export const createFirestoreDoc = async (path: string, data: {}) => {
  const fireDB = FireDatabase;
  if (!fireDB) {
    throw new Error("FireDatabase is not initialized");
  };

  const docRef = doc(fireDB, path)
  if (!isJSONSerializable(data)) {
    let newError = new Error();
    newError.name = 'INVALID_FORMAT'
    newError.message = 'Data is not JSON serializable'
    throw newError;
  }

  try {
    await setDoc(docRef, data);
} catch (error: any) {
    let newError = new Error();

    switch (error.code) {
      case 'unavailable':
        newError.name = 'SERVICE_UNAVAILABLE';
        newError.message = 'The Firestore service is currently unavailable. Please retry after some time.';
        break;
        
      case 'deadline-exceeded':
        newError.name = 'DEADLINE_EXCEEDED';
        newError.message = 'The operation took too long to complete. Please try again.';
        break;
        
      case 'internal':
        newError.name = 'INTERNAL_ERROR';
        newError.message = 'An internal error occurred in Firestore. Please try again.';
        break;

      case 'permission-denied':
        newError.name = 'PERMISSION_DENIED';
        newError.message = 'You do not have the required permissions to perform this operation.';
        break;

      case 'unauthenticated':
        newError.name = 'UNAUTHENTICATED';
        newError.message = 'You are not authenticated. Please sign in and try again.';
        break;

      default:
        newError.name = error.code || 'UNKNOWN_ERROR';
        newError.message = error.message || 'An unknown error occurred. Please try again.';
        break;
    }

    throw newError;
  }
}

export const createReportDoc = async (email: string) => {
  let reportId: string;
  try {
    reportId = await generateId();
  } catch (error:any) {
    throw error
  }

  const newReportData = new reportDataType();
  newReportData.updateFields({
    openedDate: `${new Date()}`,
    lastChange: `${new Date}`,
    userEmail: email
  })

  const damageReportCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    let newError = new Error;
    newError.name = 'SERVER_ERROR';
    newError.message = 'DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment'
    throw newError;
  }

  try {
    await createFirestoreDoc(`${damageReportCol}/${reportId}`, newReportData.toPlainObject())
  } catch(error:any) {
    throw error;
  }

  return reportId;
}

export const getFirestoreDocuments = async (path: string) => {

  const fireDB = FireDatabase;
  if (!fireDB) {
    throw new Error("FireDatabase is not initialized");
  };

  const colRef = collection(fireDB, path);

  let colDocs: QuerySnapshot<DocumentData, DocumentData>;
  try {
    colDocs = await getDocs(colRef)

    // Check if query is empty
    if (colDocs.empty) {
      let newError = new Error();
      newError.name = 'NOT_FOUND'
      newError.message = `No documents in path ${path}`
      throw newError
    }

  } catch (error:any) {
    let newError = new Error();
    
    switch (error.code) {
      case 'NOT_FOUND':
        newError = error
        break;

      case 'unavailable':
          newError.name = 'SERVICE_UNAVAILABLE';
          newError.message = 'The Firestore service is currently unavailable. Please retry after some time.';
          break;
          
      case 'deadline-exceeded':
          newError.name = 'DEADLINE_EXCEEDED';
          newError.message = 'Fetching documents took too long to complete. Please try again.';
          break;
          
      case 'internal':
          newError.name = 'INTERNAL_ERROR';
          newError.message = 'An internal error occurred in Firestore while fetching documents. Please try again.';
          break;

      case 'permission-denied':
          newError.name = 'PERMISSION_DENIED';
          newError.message = 'You do not have the required permissions to fetch these documents.';
          break;

      case 'unauthenticated':
          newError.name = 'UNAUTHENTICATED';
          newError.message = 'You are not authenticated. Please sign in and try again.';
          break;

      default:
        newError.name = error.code || 'UNKNOWN_ERROR';
        newError.message = error.message || 'An unknown error occurred while fetching documents. Please try again.';
        break;
  }

    throw newError;
  }

  return colDocs;
}

export const getFirestoreCollection = async (collectionPath: string) => {
  
  const fireDB = FireDatabase;
  if (!fireDB) {
    let newError = new Error;
    newError.name = 'SERVER_ERROR'
    newError.message = 'FireDatabase is not initialized'
    throw newError;
  }

  const colRef = collection(fireDB, collectionPath)

  const docList = await getDocs(colRef)

  return docList;
}