import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { getAdminStorage } from "../initFirebaseAdmin"
import { getEnvVariable, normalizeFilePath, normalizeFolderPath } from "../../misc";
import { ValidMimeTypes } from "@/utils/schemas/types";
import { fileTypeFromBuffer } from "file-type";

export const createStorageFileRef = (filePath:string) => {
    const storage = getAdminStorage().bucket();
    return storage.file(filePath)
}


export const uploadFileToStorage = async (filePath:string, fileBuffer:Buffer) => {
    const fileType = (await fileTypeFromBuffer(fileBuffer));
    if (!fileType) {
        throw new AppError('BAD_REQUEST', `Invalid file type: ${fileType}`)
    }

    const normalizedFilePath = normalizeFilePath(filePath)
    const fileRef = createStorageFileRef(normalizedFilePath);

    try {
        await fileRef.save(fileBuffer, {
            contentType: fileType.mime,
            resumable: false,
        })

        console.log(`Successfully uploaded file to ${normalizedFilePath}, type: ${fileType.mime}, size: ${fileBuffer.byteLength} bytes`);
    } catch (error:any) {
        console.error(`Error uploading file to Firebase Storage at ${normalizedFilePath}:`, error.message);
        throw new AppError(error.code, error.message);
    }
}


export const downloadFileFromStorage = async (filePath: string): Promise<{ name: string; buffer: Buffer;}> => {
    const fileRef = createStorageFileRef(filePath);

    try {
        const [exists] = await fileRef.exists();

        if (!exists) {
            throw new AppError('FILE_NOT_FOUND', `No file was found at path ${filePath}`);
        }

        const [fileMetadata] = await fileRef.getMetadata();
        const [fileBuffer] = await fileRef.download(); 

        console.log(`File retrieved from Firebase Storage at ${filePath}.`);
        //TODO: make better handling if no file is found, all the way downstream
        return {
            name: fileMetadata.name,
            buffer: fileBuffer,
        };
    } catch (error: any) {
        console.error(`Error retrieving file from Firebase Storage at ${filePath}:`, error.message);
        
        // If it's the custom error for the file not being found, re-throw it
        if (error instanceof AppError || error.code === 'FILE_NOT_FOUND') {
            throw error;
        }

        // Handle other errors
        throw new AppError(error.code || 'UNKNOWN_ERROR', error.message);
    }
}


export const downloadFolderFilesFromStorage = async (folderPath: string) => {
    const storage = getAdminStorage().bucket();
    const normalizedFolderPath = normalizeFolderPath(folderPath);

    try {
        const [files] = await storage.getFiles({ prefix: normalizedFolderPath });
        
        const fileDownloads = await Promise.all(files.map(async (file) => {
            const fileData = await downloadFileFromStorage(file.name);
            return {
                name: fileData.name,
                buffer: fileData.buffer,
            };
        }));

        console.log(`Downloaded ${fileDownloads.length} file${fileDownloads.length !== 1 && 's'} from folder ${folderPath} in Firebase Storage.`);
        return fileDownloads;
    } catch (error: any) {
        console.error(`Error downloading files from folder ${folderPath} in Firebase Storage:`, error.message);
        throw new AppError(error.code, error.message);
    }
};


export const getFileDownloadUrlFromStorage = async (
    filePath: string,
    expires: number
): Promise<{ fileName: string; downloadUrl: string }> => {
    const fileRef = createStorageFileRef(filePath);

    const config: { action: 'read'; expires: number } = {
        action: 'read',
        expires: expires,
    };

    try {
        if (!await fileRef.exists()) {
            throw new AppError('NOT_FOUND', 'No file found a specified path.')
        }

        const [signedUrl] = await fileRef.getSignedUrl(config); 
        console.log(`Generated signed URL for file at ${filePath}.`);
        
        return {
            fileName: filePath.split('/').pop() || '',
            downloadUrl: signedUrl
        };
    } catch (error:any) {
        console.error(`Error generating signed URL for file at ${filePath}:`, error.message);
        throw new AppError(error.code, error.message);
    }
}


export const getFolderFilesDownloadUrlsFromStorage = async (
    folderPath: string,
    expires: number
): Promise<Array<{ fileName: string; downloadUrl: string }>> => {
    const normalizedFolderPath = normalizeFolderPath(folderPath);

    try {
        const storage = getAdminStorage().bucket();

        const [files] = await storage.getFiles({ prefix: normalizedFolderPath});
        const config: { action: 'read'; expires: Date } = {
            action: 'read',
            expires: new Date(Date.now() + expires * 1000),
        };

        const urlPromises = files.map(async file => {
            const [signedUrl] = await file.getSignedUrl(config); 
            
            return {
                fileName: file.name.split('/').pop() || '',
                downloadUrl: signedUrl
            };
        });

        const fileUrls = await Promise.all(urlPromises);
        
        console.log(`Generated download URLs for ${fileUrls.length} file${fileUrls.length !== 1 && 's'} from folder ${folderPath} in Firebase Storage.`);
        return fileUrls;
    } catch (error:any) {
        console.error(`Error generating download URLs for files in folder ${folderPath} in Firebase Storage:`, error.message);
        throw new AppError(error.code, error.message);
    }
}



export const deleteFileFromStorage = async (filePath:string) => {
    const fileRef = createStorageFileRef(filePath);

    try {
        await fileRef.delete();
        console.log(`Deleted file from Firebase Storage at ${filePath}`);
    } catch (error:any) {
        console.error(`Error deleting file from Firebase Storage at ${filePath}:`, error);
        throw new AppError(error.code, error.message);
    }
}


export const deleteFolderFromStorage = async (folderPath: string): Promise<void> => {
    const storage = getAdminStorage().bucket();

    try {
        // Ensure folderPath ends with a '/' if it does not have one.
        const normalizedFolderPath = normalizeFolderPath(folderPath);
        console.log(normalizedFolderPath)

        const files = await getFolderFilesMetaData(normalizedFolderPath)
        
        const deletePromises = files.map(file => file.delete());

        await Promise.all(deletePromises);

        console.log(`Deleted ${files.length} file${files.length !== 1 && 's'} from folder ${folderPath} in Firebase Storage.`);
    } catch (error: any) {
        console.error(`Error deleting files from folder ${folderPath} in Firebase Storage:`, error.message);
        throw new AppError(error.code, error.message);
    }
};


export const getFolderFilesMetaData = async (folderPath:string) => {
    const storage = getAdminStorage().bucket();
    const fileFolder = getEnvVariable('DAMAGE_REPORT_STORAGE_FOLDER')
    const normalizedFolderPath = normalizeFolderPath(`${fileFolder}/${folderPath}`);

    try {
        const [files] = await storage.getFiles({ prefix: normalizedFolderPath });
        return files;
    } catch (error:any) {
        throw new AppError(error.code ? error.code : error.name, error.message)
    }
}