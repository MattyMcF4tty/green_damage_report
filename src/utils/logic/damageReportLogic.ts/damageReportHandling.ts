import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { generateId } from "@/utils/utils";
import { createFirestoreDoc, getFirestoreCollection, getFirestoreDoc, updateFirestoreDoc } from "../firebaseLogic/firestore";
import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { collection, getDocs } from "firebase/firestore";
import { FireDatabase } from "@/firebase/firebaseConfig";
import { getEnvVariable } from "../misc";
import { decryptReport, encryptReport } from "@/utils/securityUtils";
import { deleteStorageFile, getStorageDownloadUrl, getStorageFolderDownloadUrls, uploadFileToStorage } from "../firebaseLogic/storage";

export const createDamageReport = async (email: string) => {
    const reportId = await generateId()
  
    const newReportData = new CustomerDamageReport();
    newReportData.updateFields({
      openedDate: `${new Date()}`,
      lastChange: `${new Date()}`,
      userEmail: email,
    });
  
    const damageReportCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
    if (!damageReportCol) {
      throw new AppError('INTERNAL_ERROR', 'DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment');
    }
  
    await createFirestoreDoc(
    `${damageReportCol}/${reportId}`,
    newReportData.toPlainObject()
    );
  
    return reportId;
};

export const getDamageReportIds = async () => {
  const collectionName = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION');
  const idList: string[] = [];

  const querySnapshot = await getFirestoreCollection(collectionName);

  if (!querySnapshot.empty) {
    for (const doc of querySnapshot.docs) {
      const id = doc.id;
      idList.push(id);
    }
  }

  return idList;
};

export const getDamageReport = async (reportId: string, authorized: boolean) => {
  // We get our encryption collection name from the enviroment
  const damageReportCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    let newError = new Error();
    newError.name = "SERVER_ERROR";
    newError.message =
      "DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment";
    throw newError;
  }

  // we get the data from firebase
  let documentData;
  try {
    documentData = await getFirestoreDoc(`${damageReportCol}/${reportId}`);
  } catch (error: any) {
    throw error;
  }

  // We convert it to our report format
  let reportData = new CustomerDamageReport();
  try {
    reportData.updateFields(documentData.data());
  } catch (error: any) {
    let newError = new Error();
    newError.name = "WRONG_FORMAT";
    newError.message =
      "The document data does not match the required format for a report";
    throw newError;
  }

  // We decrypt the report
  let decryptedData = new CustomerDamageReport();
  try {
    decryptedData = decryptReport(reportData, authorized);
  } catch (error) {
    throw error;
  }

  return decryptedData;
};


export const deleteReportFile = async (id:string, path:string) => {
  const reportStorageName = getEnvVariable('NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER');

  await deleteStorageFile(`${reportStorageName}/${id}/${path}`)
}


export const uploadReportFile = async (id:string, path:string, file:Blob) => {
  const reportStorageName = getEnvVariable('NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER');

  await uploadFileToStorage(`${reportStorageName}/${id}/${path}`, file)

  return true;
}


export const getReportFolder = async (id:string, folderName:string) => {
    
  const reportStorageName = getEnvVariable('NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER');

  const files = await getStorageFolderDownloadUrls(`${reportStorageName}/${id}/${folderName}`)

  return files;
}


export const updateReportDoc = async (
  reportId: string,
  data: CustomerDamageReport
) => {
  // We get our encryption collection name from the enviroment
  const damageReportCol = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION');

  // Here we encrypt the data before sending it to our database
  const encryptedData = encryptReport(data);

  // We update when the document was last changed.
  encryptedData.updateFields({ lastChange: `${new Date()}` });

  // We upload the data to the given document
  await updateFirestoreDoc(
    `${damageReportCol}/${reportId}`,
    encryptedData.toPlainObject()
  );

    return true;
};


export const getReportFile = async (id:string, filePath:string) => {
  let file: string;

  const reportStorageName = getEnvVariable('NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER');

  try {
      file = await getStorageDownloadUrl(`${reportStorageName}/${id}/${filePath}`)
  } catch (error:any) {
      throw error;
  }

  return file;
}