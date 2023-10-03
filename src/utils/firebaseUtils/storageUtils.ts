import { FireStorage } from "@/firebase/firebaseConfig"
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { replaceLastSlash } from "../utils";

export const getStorageDownloadUrl = async (path:string) => {

    console.log("FilePath", path)

    const fireStorage = FireStorage;
    if (!fireStorage) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = 'FireStorage is not initialized'
        throw newError;
    }


    const fileRef = ref(fireStorage, path);

    let fileDownloadUrl: string; 
    try {
        fileDownloadUrl = await getDownloadURL(fileRef);
    } catch (error: any) {
        let newError: Error = new Error;
        
        switch (error.code) {
          case 'storage/object-not-found':
            newError.name = 'NOT_FOUND';
            newError.message = `No file exists at ${path}`;
            throw newError;
    
          case 'storage/unauthorized':
            newError.name = 'UNAUTHORIZED';
            newError.message = 'Permission to get file download url denied';
            throw newError;
    
          default:
            newError.name = error.code || 'UNKNOWN';
            newError.message = error.message || 'An unknown error occurred while fetching the download URL.';
            throw newError;
        }
    }

    return fileDownloadUrl;
}

export const getStorageFolderDownloadUrls = async (path: string) => {

    const fireStorage = FireStorage;
    if (!fireStorage) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = 'FireStorage is not initialized'
        throw newError;
    }

    const fileRef = ref(fireStorage, path);

    const files = await listAll(fileRef);
        
    let fileData: {url:string, path:string}[] = [];

    try {
        const urls = await Promise.all(
            files.items.map(async (file) => {
                // For each file, get the download URL and return it
                return {
                    url: await getStorageDownloadUrl(`${path}/${file.name}`),
                    path: file.fullPath,
                };
            })
        );
    
        fileData = [...urls];
    } catch (error:any) {
        throw error;
    }
    

    return fileData;
}

export const getReportFile = async (id:string, filePath:string) => {
    let file: string;

    const reportStorageName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER;
    if (!reportStorageName) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = "DAMAGE_REPORT_STORAGE_FOLDER is not defined in enviroment"
        throw newError;
    }

    try {
        file = await getStorageDownloadUrl(`${reportStorageName}/${id}/${filePath}`)
    } catch (error:any) {
        throw error;
    }

    return file;
}

export const getReportFolder = async (id:string, folderName:string) => {
    let files: {url:string, path:string}[];
    
    const reportStorageName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER;
    if (!reportStorageName) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = "NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER is not defined in enviroment"
        throw newError;
    }

    try {
        files = await getStorageFolderDownloadUrls(`${reportStorageName}/${id}/${folderName}`)
    } catch (error:any) {
        throw error;
    }

    return files;
}

// Upload to storage
export const uploadFileToStorage = async (path:string, file:Blob) => {

    const storageRef = ref(FireStorage, `${path}`)
    try {
        await uploadBytes(storageRef, file)
    } catch (error:any) {
        let newError = new Error();

        switch (error.code) {
            case 'storage/object-not-found':
                newError.name = 'NOT_FOUND';
                newError.message = `No folder exists at ${path}`;
                break;

            case 'storage/unauthenticated':
                newError.name = 'UNAUTHENTICATED';
                newError.message = 'User is unauthenticated. Please authenticate and try again.';
                break;

            case 'storage/unauthorized':
                newError.name = 'UNAUTHORIZED';
                newError.message = 'Permission denied. Check your Firebase Storage rules.';
                break;

            case 'storage/retry-limit-exceeded':
                newError.name = 'RETRY_LIMIT_EXCEEDED';
                newError.message = 'Maximum retry time exceeded. Please try the operation again.';
                break;

            case 'storage/invalid-checksum':
                newError.name = 'INVALID_CHECKSUM';
                newError.message = 'Checksum mismatch. Please try uploading the file again.';
                break;

            case 'storage/quota-exceeded':
                newError.name = 'QUOTA_EXCEEDED';
                newError.message = 'Storage quota exceeded. Consider upgrading your plan or reducing storage usage.';
                break;

            case 'storage/canceled':
                newError.name = 'CANCELED';
                newError.message = 'The operation was canceled by the user.';
                break;

            case 'storage/unknown':
            default:
                newError.name = error.code || 'UNKNOWN';
                newError.message = error.message || 'An unknown error occurred while uploading the file.';
                break;
        }

        throw newError;
    }

    return true;
}

export const uploadReportFile = async (id:string, path:string, file:Blob) => {

    const reportStorageName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER;

    if (!reportStorageName) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = "DAMAGE_REPORT_STORAGE_FOLDER is not defined in enviroment"
        throw newError;
    }

    try {
        await uploadFileToStorage(`${reportStorageName}/${id}/${path}`, file)
    } catch (error:any) {
        throw error
    }

    return true;
}

export const deleteStorageFile = async (path:string) => {

    const fireStorage = FireStorage;
    if (!fireStorage) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = 'FireStorage is not initialized'
        throw newError;
    }

    const fileRef = ref(fireStorage, path);

    try {
        await deleteObject(fileRef);
    } catch (error:any) {
        // Log the error for debugging purposes
        console.error("Error deleting file:", error);

        let newError = new Error();
        newError.name = "STORAGE_ERROR";

        // Customize error message based on error code
        switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                newError.message = 'You do not have permission to delete this file.';
                break;
            case 'storage/canceled':
                // User canceled the upload
                newError.message = 'File deletion was canceled.';
                break;
            case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                newError.message = 'An unknown error occurred while trying to delete the file.';
                break;
            default:
                newError.message = 'File deletion failed.';
        }

        // Optionally: Send error to an error reporting service

        throw newError;
    }
}

export const deleteReportFile = async (id:string, path:string) => {
    const reportStorageName = process.env.NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER;
    if (!reportStorageName) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = "NEXT_PUBLIC_DAMAGE_REPORT_STORAGE_FOLDER is not defined in enviroment"
        throw newError;
    }

    await deleteStorageFile(`${reportStorageName}/${id}/${path}`)
}