import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { getAdminStorage } from "../initFirebaseAdmin"
import { normalizeFilePath, normalizeFolderPath } from "../../misc";
import { ValidMimeTypes } from "@/utils/schemas/types";
import { fileTypeFromBuffer } from "file-type";

export const createStorageFileRef = (filePath:string) => {
    const storage = getAdminStorage().bucket();
    return storage.file(filePath)
}


export const uploadFileToStorage = async (filePath:string, fileBuffer:Buffer) => {
    const fileRef = createStorageFileRef(filePath);
    const mimeType = (await fileTypeFromBuffer(fileBuffer))?.mime;


    try {
        await fileRef.save(fileBuffer, {
            contentType: mimeType,
            resumable: false,
        })

        console.log(`Successfully uploaded file to ${filePath}, type: ${mimeType}, size: ${fileBuffer.byteLength} bytes`);
    } catch (error:any) {
        console.error(`Error uploading file to Firebase Storage at ${filePath}:`, error.message);
        throw new AppError(error.code, error.message);
    }
}


export const downloadFileFromStorage = async (filePath: string): Promise<{ name: string; buffer: Buffer; mimeType: string | null }> => {
    const fileRef = createStorageFileRef(filePath);

    try {
        if (!await fileRef.exists()) {
            throw new AppError('NOT_FOUND', `No file were found at path ${filePath}`)
        }

        const [fileMetadata] = await fileRef.getMetadata();
        const [fileBuffer] = await fileRef.download(); 

        console.log(`File retrieved from Firebase Storage at ${filePath}.`);
        
        return {
            name: fileMetadata.name,
            buffer: fileBuffer,
            mimeType: fileMetadata.contentType || null
        };
    } catch (error: any) {
        console.error(`Error retrieving file from Firebase Storage at ${filePath}:`, error.message);
        throw new AppError(error.code, error.message);
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
                mimeType: fileData.mimeType!,
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
                fileName: file.name,
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
        const normalizedFolderPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;

        const [files] = await storage.getFiles({ prefix: normalizedFolderPath });
        
        const deletePromises = files.map(file => file.delete());

        await Promise.all(deletePromises);

        console.log(`Deleted ${files.length} file${files.length !== 1 && 's'} from folder ${folderPath} in Firebase Storage.`);
    } catch (error: any) {
        console.error(`Error deleting files from folder ${folderPath} in Firebase Storage:`, error.message);
        throw new AppError(error.code, error.message);
    }
};


export const uploadFolderToStorage = async (
    folderPath: string, 
    fileData: {name: string, buffer: Buffer}[]
) => {
    const normalizedFolderPath = normalizeFolderPath(folderPath);
    const uploadSize: number = fileData.reduce((acc, file) => acc + file.buffer.byteLength, 0);   

    try {
        // Create an array of upload promises and wait for all of them to complete
        const uploadPromises = fileData.map((file) => {
            const normalizedFilePath = normalizeFilePath(`${normalizedFolderPath}${file.name}`)
            uploadFileToStorage(`${normalizedFilePath}`, file.buffer)
        });
        
        // Ensure all uploads are complete
        await Promise.all(uploadPromises);

        console.log(`Successfully uploaded ${fileData.length} file${fileData.length !== 1 ? 's' : ''} to ${normalizedFolderPath}. Full size of upload: ${uploadSize} bytes.`);
    } catch (error: any) {
        console.error(`Error uploading ${fileData.length} file${fileData.length !== 1 ? 's' : ''} to ${normalizedFolderPath}:`, error);
        throw new AppError(error.name, error.message);
    }
}
