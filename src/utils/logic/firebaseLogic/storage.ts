import { FireStorage } from "@/firebase/firebaseConfig"
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { replaceLastSlash } from "../../utils";
import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { getEnvVariable } from "../misc";

export const getStorageDownloadUrl = async (path:string) => {
    const fileRef = ref(FireStorage, path);

    try {
        const fileDownloadUrl = await getDownloadURL(fileRef);
        
        return fileDownloadUrl;
    } catch (error: any) {
        //TODO: FIX error handling
        let newError: {name: string, message:string} = {name: error.code, message:error.message};
        
        switch (error.code) {
          case 'storage/object-not-found':
            newError.name = 'NOT_FOUND';
            newError.message = `No file exists at ${path}`;
    
          case 'storage/unauthorized':
            newError.name = 'UNAUTHORIZED';
            newError.message = 'Permission to get file download url denied';
    
          default:
            newError.name = error.code || 'UNKNOWN';
            newError.message = error.message || 'An unknown error occurred while fetching the download URL.';
        }

        throw new AppError(newError.name, newError.message)
    }
}

export const getStorageFolderDownloadUrls = async (path: string) => {

    const fileRef = ref(FireStorage, path);

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
        //TODO: FIX error handling
        throw error;
    }
    

    return fileData;
}


// Upload to storage
export const uploadFileToStorage = async (path:string, file:Blob) => {

    const storageRef = ref(FireStorage, `${path}`)
    try {
        await uploadBytes(storageRef, file)
        return true;
    } catch (error:any) {
        let newError: {name: string, message:string} = {name: error.code, message:error.message};

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

        throw new AppError(newError.name, newError.message);
    }
}


export const deleteStorageFile = async (path:string) => {
    const fileRef = ref(FireStorage, path);

    try {
        await deleteObject(fileRef);
        return true;
    } catch (error:any) {
        //TODO: FIX error handling;
        let newError: {name: string, message:string} = {name: error.code, message:error.message}
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

        throw new AppError(newError.name, newError.message);
    }
}


export const handleStorageErrors = (error: any) => {

    switch (error.code) {
        case 'storage/unknown':
            throw new AppError('storage/unknown', 'An unknown error occurred.');
        case 'storage/object-not-found':
            throw new AppError('storage/object-not-found', 'No object exists at the desired reference.');
        case 'storage/bucket-not-found':
            throw new AppError('storage/bucket-not-found', 'No bucket is configured for Cloud Storage.');
        case 'storage/project-not-found':
            throw new AppError('storage/project-not-found', 'No project is configured for Cloud Storage.');
        case 'storage/quota-exceeded':
            throw new AppError('storage/quota-exceeded', 'Quota on your Cloud Storage bucket has been exceeded. If you\'re on the no-cost tier, upgrade to a paid plan. If you\'re on a paid plan, reach out to Firebase support.');
        case 'storage/unauthenticated':
            throw new AppError('storage/unauthenticated', 'User is unauthenticated, please authenticate and try again.');
        case 'storage/unauthorized':
            throw new AppError('storage/unauthorized', 'User is not authorized to perform the desired action, check your security rules to ensure they are correct.');
        case 'storage/retry-limit-exceeded':
            throw new AppError('storage/retry-limit-exceeded', 'The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again.');
        case 'storage/invalid-checksum':
            throw new AppError('storage/invalid-checksum', 'File on the client does not match the checksum of the file received by the server. Try uploading again.');
        case 'storage/canceled':
            throw new AppError('storage/canceled', 'User canceled the operation.');
        case 'storage/invalid-event-name':
            throw new AppError('storage/invalid-event-name', 'Invalid event name provided. Must be one of [`running`, `progress`, `pause`]');
        case 'storage/invalid-url':
            throw new AppError('storage/invalid-url', 'Invalid URL provided to refFromURL(). Must be of the form: gs://bucket/object or https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token=<TOKEN>');
        case 'storage/invalid-argument':
            throw new AppError('storage/invalid-argument', 'The argument passed to put() must be `File`, `Blob`, or `UInt8` Array. The argument passed to putString() must be a raw, `Base64`, or `Base64URL` string.');
        case 'storage/no-default-bucket':
            throw new AppError('storage/no-default-bucket', 'No bucket has been set in your config\'s storageBucket property.');
        case 'storage/cannot-slice-blob':
            throw new AppError('storage/cannot-slice-blob', 'Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn\'t changed.');
        case 'storage/server-file-wrong-size':
            throw new AppError('storage/server-file-wrong-size', 'File on the client does not match the size of the file recieved by the server. Try uploading again.');
        default:
            throw new AppError(error.code, error.message);
    }
}