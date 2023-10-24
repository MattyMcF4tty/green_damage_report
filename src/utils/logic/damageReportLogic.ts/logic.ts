import { AdminDamageReport, AdminDamageReportSchema } from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import { getEnvVariable, normalizeFolderPath } from "../misc"
import { createFirestoreDocument, deleteFirestoreDocument, getFirestoreCollection, getFirestoreCollectionDocIds, getFirestoreDocument, queryFirestoreCollection, updateFirestoreDocument } from "../firebaseLogic/firestoreLogic/logic";
import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { deleteFileFromStorage, deleteFolderFromStorage, downloadFileFromStorage, downloadFolderFilesFromStorage, getFileDownloadUrlFromStorage, getFolderFilesDownloadUrlsFromStorage, uploadFileToStorage, uploadFolderToStorage } from "../firebaseLogic/storageLogic/logic";
import { ValidMimeTypes } from "@/utils/schemas/types";


export const getDamageReportIds = async () => {
    const damageReportCol = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION');
    const damageReportIds = await getFirestoreCollectionDocIds(damageReportCol)

    return damageReportIds;
}


export const getSharedDamageReportData = async () => {
    try {
        const appDataCol = getEnvVariable('APP_DATA_COL');
        const reportDataDoc = getEnvVariable('DAMAGE_REPORT_APP_DATA');

        const damageReportAppDataDoc = await getFirestoreDocument(reportDataDoc, appDataCol);

        if (!damageReportAppDataDoc.exists) {
            throw new AppError('NOT_FOUND', `${reportDataDoc} in ${appDataCol} could not be found.`)
        }
        
        return damageReportAppDataDoc.data() as FirebaseFirestore.DocumentData;
    } catch (error:any) {
        console.error('Error getting shared damagereport data:', error);
        throw new AppError(error.code || error.name, error.message)
    }
}


export const updateSharedDamageReportData = async (data:object) => {
    try {
        const appDataCol = getEnvVariable('APP_DATA_COL');
        const reportDataDoc = getEnvVariable('DAMAGE_REPORT_APP_DATA');

        await updateFirestoreDocument(reportDataDoc, appDataCol, data);
        console.log('Updated shared damagereport data:', data)
    } catch (error:any) {
        console.error('Error getting shared damagereport data:', error);
        throw new AppError(error.code || error.name, error.message)
    }
}


export const assingNewDamageReportNumber = async () => {
    try {
        const damageReportAppData = await getSharedDamageReportData();
        
        const damageReportNumber = damageReportAppData.reportIdCounter + 1  as number;
        await updateSharedDamageReportData({reportIdCounter: damageReportNumber})

        return damageReportNumber;
    } catch (error:any) {
        console.error('Error getting reportIdCounter:', error)
        throw new AppError(error.name, error.message)
    }
}


export const createNewDamageReport = async (email:string) => {

    const currentDate = new Date();

    const newDamageReport = new AdminDamageReport();
    newDamageReport.updateFields({
        userEmail: email,
        openedDate: `${currentDate}`,
        lastChange: `${currentDate}`
    });

    try {
        const damageReportCol = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION');
        const damageReportId = await generateDamageReportId();
        const damageReportNumber = await assingNewDamageReportNumber();

        newDamageReport.updateFields({reportId: damageReportNumber});

        await createFirestoreDocument(damageReportId, damageReportCol, newDamageReport.toPlainObject());

        console.log(`Created damagereport ${damageReportId}`);
        return damageReportId;
    } catch (error:any) {
        console.error('Error creating damagereport:', error);
        throw new AppError(error.name, error.message);
    }
}

 
export const updateDamageReport = async (reportId:string, data:Partial<AdminDamageReportSchema>) => {
    try {
        const damageReportCol = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION'); 

        await updateFirestoreDocument(reportId, damageReportCol, data);
        console.log(`Successfully updated ${reportId} with:`, data);
    } catch (error:any) {
        console.error(`Error updating damagereport ${reportId} with ${data}:`, error);
        throw new AppError(error.name, error.message);
    }
}


export const getDamageReport = async (reportId:string) => {
    try {
        const damageReportCol = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION');

        const damageReportDoc = await getFirestoreDocument(reportId, damageReportCol);
        const damageReportData = damageReportDoc.data() as FirebaseFirestore.DocumentData;

        console.log(`Successfully fetched damagereport ${reportId}.`)
        return damageReportData as AdminDamageReportSchema;
    } catch (error:any) {
        console.error(`Error getting damagereport ${reportId}:`, error);
        throw new AppError(error.name, error.message)
    }
}


export const deleteDamageReport = async (reportId:string) => {
    try {
        const damageReportCol = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION');

        await deleteFirestoreDocument(reportId, damageReportCol);
        await deleteDamageReportFolder(reportId, '');
        console.log(`Damagereport ${reportId} successfully deleted.`);
    } catch (error:any) {
        console.error(`Error deleting ${reportId}:`, error);
        throw new AppError(error.name, error.message);
    }
}


export const getAllDamageReports = async () => {
    try {
        const damageReportCol = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION');

        const damageReportsDocs = await getFirestoreCollection(damageReportCol)
        const damageReports = damageReportsDocs.docs.map((doc) => {
            return {
                id: doc.id,
                data: doc.data() as AdminDamageReportSchema,
            }
        })

        console.log(`Fetched ${damageReports.length} damagereport${damageReports.length !== 1 && 's'}.`)
        return damageReports;
    } catch (error:any) {
        console.error(`Error getting all damagereports:`, error);
        throw new AppError(error.name, error.message)
    }
}


export const getDamageReportFileDownloadUrl = async (reportId:string, filePath:string) => {
    const damageReportFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER');
    const fullFilePath = `${damageReportFolder}/${reportId}/${filePath}`

    try {
        const expireTimeInSeconds = 3600;

        const fileDownloadUrl = await getFileDownloadUrlFromStorage(`${fullFilePath}`, expireTimeInSeconds) 
        
        console.log(`Successfully got downloadUrl from file at ${fullFilePath}, expires in ${expireTimeInSeconds} seconds`)
        return fileDownloadUrl;
    } catch (error:any) {
        console.error(`Error getting downloadurl from file at ${fullFilePath}:`, error);
        throw new AppError(error.name, error.message);
    }
}


export const downloadDamageReportFile = async (reportId:string, filePath:string) => {
    const damageReportFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER');
    const fullFilePath = `${damageReportFolder}/${reportId}/${filePath}`

    try {
        const fileBuffer= await downloadFileFromStorage(`${fullFilePath}`) 
        
        console.log(`Successfully downloaded file from ${fullFilePath}.`)
        return fileBuffer;
    } catch (error:any) {
        console.error(`Error downloading file from ${fullFilePath}:`, error);
        throw new AppError(error.name, error.message);
    }
}


export const uploadDamageReportFile = async (reportId:string, filePath:string, fileBuffer:Buffer, mimeType:ValidMimeTypes) => {
    const damageReportFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER');
    const fullFilePath = `${damageReportFolder}/${reportId}/${filePath}`

    try {
        await uploadFileToStorage(`${fullFilePath}`, mimeType, fileBuffer);
        console.log(`Successfully uploaded file to ${fullFilePath}, type: ${mimeType}, size: ${fileBuffer.byteLength} bytes`);
    } catch (error:any) {
        console.error(`Error uploading file to ${fullFilePath}, type: ${mimeType}, size:${fileBuffer.byteLength} bytes, error:`, error);
        throw new AppError(error.name, error.message)
    }
}


export const deleteDamageReportFile = async (reportId:string, filePath:string) => {
    const damageReportFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER');
    const fullFilePath = `${damageReportFolder}/${reportId}/${filePath}`

    try {
        await deleteFileFromStorage(fullFilePath);
        console.log(`Successfully deleted file at ${fullFilePath} from storage.`);
    } catch (error:any) {
        console.error(`Error deleting file at ${fullFilePath} from storage.`);
        throw new AppError(error.name, error.message)
    }
}


export const downloadDamageReportFolder = async(reportId:string, folderPath:string) => {
    const damageReportFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER');
    const normalizedFolderPath = normalizeFolderPath(folderPath);
    const fullFilePath = `${damageReportFolder}/${reportId}/${normalizedFolderPath}`;

    try {
        const fileData = await downloadFolderFilesFromStorage(fullFilePath);

        console.log(`Successfully downloaded ${fileData.length} file${fileData.length !== 1 && 's'} from ${fullFilePath} in storage.`);
        return fileData;
    } catch (error:any) {
        console.error(`Error downloading files from ${fullFilePath} in storage.`);
        throw new AppError(error.name, error.message)
    }
}

export const generateDamageReportId = async () => {
    const dataList = await getDamageReportIds();
  
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    /* Generates random id from chars and checks if this id is not already taken */
    let id: string | null = null;
    while (!id) {
      const newId = Array.from(crypto.getRandomValues(new Uint16Array(16)))
        .map((randomValue) => chars[randomValue % chars.length])
        .join("");
  
      const existingId = dataList.find((docId: string) => docId === newId);
  
      if (!existingId) {
        id = newId;
      }
    }
  
    return id;
  };

export const getDamageReportFolderDownloadUrls = async (reportId:string, folderPath:string) => {
    const damageReportFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER');
    const normalizedFolderPath = normalizeFolderPath(folderPath);
    const fullFilePath = `${damageReportFolder}/${reportId}/${normalizedFolderPath}`;

    try {
        const expireTimeInSeconds = 3600;

        const fileDownloadUrls = await getFolderFilesDownloadUrlsFromStorage(fullFilePath, expireTimeInSeconds);

        console.log(`Successfully fetched ${fileDownloadUrls.length} download url${fileDownloadUrls.length !== 1 && 's'} from ${fullFilePath} in storage.`);
        return fileDownloadUrls;
    } catch (error:any) {
        console.warn(`Error fetching download urls from ${fullFilePath} in storage.`);
        return []
    }
}


export const deleteDamageReportFolder = async (reportId:string, folderPath:string) => {
    const damageReportFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER');
    const normalizedFolderPath = normalizeFolderPath(folderPath);
    const fullFilePath = `${damageReportFolder}/${reportId}/${normalizedFolderPath}`;

    try {
        await deleteFolderFromStorage(fullFilePath);

        console.log(`Successfully deleted folder at ${fullFilePath}`);
    } catch (error:any) {
        console.error(`Error deleting folder at ${fullFilePath}`);
        throw new AppError(error.name, error.message);
    }
}


export const uploadDamageReportFolder = async(reportId:string, folderPath:string, fileData: {
    name: string;
    mimeType: ValidMimeTypes;
    buffer: Buffer;
}[]) => {
    const damageReportFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER');
    const normalizedFolderPath = normalizeFolderPath(folderPath);
    const fullFilePath = `${damageReportFolder}/${reportId}/${normalizedFolderPath}`;

    try {
        await uploadFolderToStorage(fullFilePath, fileData)

        console.log(`Successfully uploaded ${fileData.length} file${fileData.length !== 1 && 's'} to damage report ${reportId}.`)
    } catch (error:any) {
        console.log(`Error uploading ${fileData.length} file${fileData.length !== 1 && 's'} to damage report ${reportId}:`, error)

        throw new AppError(error.name, error.message);
    }
}


export const queryDamageReports = async (variable:string, operation:FirebaseFirestore.WhereFilterOp, value:string) => {
    const damageReportCollection = getEnvVariable('DAMAGE_REPORT_FIRESTORE_COLLECTION');

    try {
        const qResult = await queryFirestoreCollection(damageReportCollection, variable, operation, value)
    
        return qResult;
    } catch (error:any) {
        console.error(error.name, error.message)
        throw new AppError(error.name, error.message)
    }
}