import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { createFirestoreDoc, getFirestoreCollection, getFirestoreDoc, queryFirestoreCollection, updateFirestoreDoc } from "../firebaseLogic/firestore";
import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { generateId } from "../misc";
import { deleteStorageFile, getStorageDownloadUrl, getStorageFolderDownloadUrls, uploadFileToStorage } from "../firebaseLogic/storage";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";

export const createDamageReport = async (email: string) => {
    const reportReferenceId = await generateId();

    // We have two Id's, the id for the url such that the user cant se the number of reports.
    // We also have an id to see what number of reports we are on.
    const reportId = await getNewReportId();

    const newReportData = new AdminDamageReport();

    newReportData.updateFields({
      openedDate: `${new Date()}`,
      lastChange: `${new Date()}`,
      userEmail: email,
      reportId: reportId,
    });

  
    const damageReportCol = process.env.NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION;
    if (!damageReportCol) {
      throw new AppError('INTERNAL_ERROR', 'NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment');
    }
  
    await createFirestoreDoc(
    `${damageReportCol}/${reportReferenceId}`,
    newReportData.crypto('encrypt')
    );
  
    return reportReferenceId;
};

export const getDamageReportIds = async () => {
  const collectionName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!collectionName) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in environment.`);
  }
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


export const deleteReportFile = async (id:string, path:string) => {
  const reportStorageName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER;
  if (!reportStorageName) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER is not defined in environment.`);
  }

  await deleteStorageFile(`${reportStorageName}/${id}/${path}`)
}


export const uploadReportFile = async (id:string, path:string, file:Blob) => {
  const reportStorageName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER;
  if (!reportStorageName) {
    throw new AppError('INTERNAL_ERROR', `NEjjjXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER is not defined in environment.`);
  }

  await uploadFileToStorage(`${reportStorageName}/${id}/${path}`, file)

  return true;
}


export const getReportFolder = async (id:string, folderName:string) => {
  const reportStorageName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER;
  if (!reportStorageName) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER is not defined in environment.`);
  }
  
  const files = await getStorageFolderDownloadUrls(`${reportStorageName}/${id}/${folderName}`)

  return files;
}


export const updateDamageReport = async (
  reportId: string,
  damageReport: CustomerDamageReport
) => {
  // We get our encryption collection name from the enviroment
  const damageReportCol = process.env.NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in environment.`);
  }

  // Here we encrypt the data before sending it to our database;
  const encryptedData = damageReport.crypto('encrypt');

  // We upload the data to the given document
  await updateFirestoreDoc(
    `${damageReportCol}/${reportId}`,
    encryptedData
  );

    return true;
};

export const updatePartialDamageReport = async (
  reportId: string,
  damageReportData: Partial<AdminDamageReport>
) => {  
  // We get our encryption collection name from the enviroment
  const damageReportCol = process.env.NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in environment.`);
  }

  const reportData: Partial<AdminDamageReport> = {...damageReportData, lastChange: `${new Date()}`}

  // We upload the data to the given document
  await updateFirestoreDoc(
    `${damageReportCol}/${reportId}`,
    reportData
  );

    return true;
};


export const getReportFile = async (id:string, filePath:string) => {
  let file: string;

  const reportStorageName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER;
  if (!reportStorageName) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER is not defined in environment.`);
  }
  
  try {
      file = await getStorageDownloadUrl(`${reportStorageName}/${id}/${filePath}`)
  } catch (error:any) {
      throw error;
  }

  return file;
}


export const queryDamageReports = async (key: keyof CustomerDamageReport, value: string) => {

  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_URL is not defined in environment.`);
  }
  const collectionName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!collectionName) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in environment.`);
  }

  const result = await queryFirestoreCollection(collectionName, key, value);
  const damageReports: Record<string, CustomerDamageReport> = result.reduce((acc: Record<string, CustomerDamageReport>, doc) => {
    const damageReport = new CustomerDamageReport();
    damageReport.updateFields(doc.data());

    // Using doc.id as the key and the damageReport instance as the value
    acc[doc.id] = damageReport;

    return acc;
  }, {});

  return damageReports;
}

export const getCustomerDamageReport = async (reportId:string) => {
  const reportData = await getDamageReport(reportId);

  const damageReport = new CustomerDamageReport();
  damageReport.updateFields(reportData);

  // We decrypt the damage report.
  const decryptedDamageReport = new CustomerDamageReport();
  decryptedDamageReport.updateFields(damageReport.crypto('decrypt'))

  return decryptedDamageReport;
}


export const getAdminDamageReport = async (reportId:string) => {
  const reportData = await getDamageReport(reportId);

  const damageReport = new AdminDamageReport();
  damageReport.updateFields(reportData);

  // We decrypt the damage report.
  const decryptedDamageReport = new AdminDamageReport();
  damageReport.updateFields(damageReport.crypto('decrypt'))

  return decryptedDamageReport;
}


export const getDamageReport = async (reportId: string) => {
  // We get our encryption collection name from the enviroment
  const damageReportCol = process.env.NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!damageReportCol) {
    throw new AppError('INTERNAL_ERROR', `NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in environment.`);
  }

  // we get the data from firebase
  const documentData = await getFirestoreDoc(`${damageReportCol}/${reportId}`);
  console.log(`Fetched report: ${reportId}'s data from server:`, documentData.data(), '\n')

  // We convert it to our report format
  let reportData = documentData.data();


  return reportData;
};


export const getNewReportId = async () => {
  const appDataCol = process.env.NEXT_PUBLIC_APP_DATA_COL;
  console.log(appDataCol)
  if (!appDataCol) {
    throw new AppError('INTERNAL_ERROR', 'NEXT_PUBLIC_APP_DATA_COL is not defined in enviroment.')
  }

  const sharedReportData = (await getFirestoreDoc(`${appDataCol}/ReportData`)).data();
  const reportId = sharedReportData.reportIdCounter + 1 as number;

  await updateFirestoreDoc(`${appDataCol}/ReportData`, {reportIdCounter: reportId});

  return reportId;
}