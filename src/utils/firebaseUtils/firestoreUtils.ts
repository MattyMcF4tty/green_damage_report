import { FireDatabase } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createError, decryptData, isJSONSerializable, reportDataType } from "../utils";
import { decryptReport, encryptReport } from "../securityUtils";

export const updateFirestoreDoc = async (path: string, data: {}) => {

  // We check if Firestore is initialized.
  const fireDB = FireDatabase;
  if (!fireDB) {
    throw createError("SERVER_ERROR", 'FireDatabase is not initialized')
  }

  // We check if data is JSON serializeable. If not the data can not be sent to Firestore.
  if (!isJSONSerializable(data)) {
    throw createError('NON_SERIALIZABLE', 'Data is not JSON serializable')
  }

  // We create a reference to the document we want to update.
  const docRef = doc(fireDB, path);

  // We try to update the doc. If it fails we catch the errors and return them.
  try {
    await updateDoc(docRef, data)
  } catch (error:any) {
    switch (error.code) {
      case 'not-found':
        throw createError('NOT_FOUND', `Document at ${path} does not exist`)
      case 'permission-denied':
        throw createError('UNAUTHORIZED', 'Permission denied to update the document')
      case 'unavailable':
        throw createError('UNAVAILABLE', `Firebase Firestore is currently unavailable`)
      case 'cancelled':
        throw createError('CANCELLED', `Request to update document at ${path} was cancelled by Firebase Firestore`)
      default:
        throw createError(error.code || "UNKNOWN_ERROR", error.message || "An unknown error occurred while fetching the document")
    }
  }
}

export const updateReportDoc = async (reportId: string, data: reportDataType) => {

  // We get our encryption collection name from the enviroment
  const damageReportCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    throw createError('SERVER_ERROR', 'DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment')
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
      throw createError('NOT_FOUND', `Document at ${path} does not exist in Firestore`)
    }

    docData = document.data();
  } catch (error:any) {
    switch (error.code) {
      case 'NOT_FOUND':
        throw error
      case 'permission-denied':
        throw createError('UNAUTHORIZED', `Permission denied to access the document at ${path}`)
      case 'unavailable':
        throw createError('UNAVAILABLE', 'Firebase Firestore is currently unavailable')
      case 'cancelled':
        throw createError('CANCELLED', 'Request to get document ${path} was cancelled by Firebase Firestore')
      default:
        throw createError(error.code || "UNKNOWN_ERROR", error.message || "An unknown error occurred while fetching the document")
    }
  }

  return docData;
}


export const getReportDoc = async (reportId: string, authorized: boolean) => {
  // We get our encryption collection name from the enviroment
  const damageReportCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    throw createError('SERVER_ERROR', 'DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment')
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
    throw createError('WRONG_FORMAT', 'The document data does not match the required format for a report')
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