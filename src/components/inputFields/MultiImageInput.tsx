import { fetchDamageReportFolderFilesUrl, requestDamageReportFileDeletion, uploadFolderToDamageReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { fileListToFileArray, fileToBase64, normalizeFilePath, normalizeFolderPath, trimArrayToLimit } from "@/utils/logic/misc";
import { faCamera, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

interface MultiImageInputProps {
    componentId: string;
    reportId: string;
    imageLimit: number;
    labelText: string;
    folderPath: string;
    required?: boolean;
    setIsLoading?: (isloading: boolean) => void;
    setRequired?: (required:boolean) => void;
}
  
// TODO: Required does not work
const MultiImageInput = ({componentId, reportId, imageLimit, labelText, required, folderPath, setIsLoading}:MultiImageInputProps) => {
    const [isRequired, setIsRequired] = useState(required ? required : false);
    const [imageData, setImageData] = useState<{fileName: string; downloadUrl: string;}[]>([]);
    const [errorText, setErrorText] = useState<string | null>();

    const [disabled, setDisabled] = useState(false);
    const [limitReached, setLimitReached] = useState(imageLimit - imageData.length === 0);

    const normalizedFolderPath = normalizeFolderPath(folderPath);
    const folderName = normalizedFolderPath.split('/').slice(-2)[0];

    // Get images after component has been build.
    useEffect(() => {
        getImages()
    }, [])

    // Check if limit is reached
    useEffect(() => {
        setLimitReached(imageLimit - imageData.length === 0);
        if (limitReached) {
            setErrorText('Limit has been reached.');
        }
    }, [imageData]);
    

    // Fetch images and update components imageData.
    const getImages = async () => {
        console.log('fetching images')
        setDisabled(true);
        setImageData(await fetchDamageReportFolderFilesUrl(reportId, normalizedFolderPath));
        setDisabled(false);
    }

    // Upload images from input field.
    const uploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setDisabled(true);
            const files = fileListToFileArray(e.target.files);
            
            // Trim array to so that limit is not exceeded
            let trimmedFiles = files;
            if (files.length + imageData.length > imageLimit) {
                trimmedFiles = trimArrayToLimit(imageLimit - imageData.length, files)

                // Return if no more files can be uploaded
                if (trimmedFiles.length <= 0) {
                    return;
                }
            }

            // Convert files to buffer and prepare data for upload.
            const filesBase64 = await Promise.all(trimmedFiles.map(file => fileToBase64(file)));

            const fileData = filesBase64.map((fileBase64, index) => {
                return {
                    name: `${folderName}${imageData.length + index}`,
                    fileBase64: fileBase64
                }; 
            });

            await uploadFolderToDamageReport(reportId, normalizedFolderPath, fileData)

            // Reset the inputfield after upload of images
            e.target.value = '';

            // After uploading we fetch images so that other triggers trigger
            await getImages();
        } catch (error:any) {
            console.error(error);
            setErrorText('Something went wrong uploading images');
            setDisabled(false);
        }
    }
    
    const deleteImage = async (imageName:string, fileDataIndex:number) => {
        setDisabled(true);
        const normalizedFilePath = normalizeFilePath(normalizedFolderPath+imageName)
        await requestDamageReportFileDeletion(reportId, normalizedFilePath);

        const updatedImageData = [...imageData];
        updatedImageData.splice(fileDataIndex, 1);
        setImageData(updatedImageData);    
        setDisabled(false);
    }

    return (
        <div id={componentId}
        className="flex flex-col">
            {/* Input field */}
            <label htmlFor={`${componentId}Input`}>{labelText}</label>
            <div className="flex flex-row items-center">
                <div id={`${componentId}Input`} className={`relative w-36 rounded-md duration-150 ${disabled || limitReached ? 'bg-MainGreen-200': 'bg-MainGreen-300'}`}>
                    <p className="text-white absolute left-0 top-1/2 transform -translate-y-1/2 p-2">
                        Select images  <FontAwesomeIcon icon={faCamera}/>
                    </p>
                    <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        required={isRequired}
                        disabled={disabled || limitReached} 
                        multiple={true} 
                        onChange={(e) => uploadFiles(e)}
                        className="w-full h-full opacity-0 hover:cursor-pointer"
                    />
                </div>
                <p className="ml-1 italic">{imageLimit - imageData.length} left</p>
            </div>


            {/* Image display */}
            {imageData.length > 0 && (
                <div className="flex flex-wrap w-full">
                    {imageData.map((image, index) => (
                        <div className="relative" key={image.fileName}>
                            {!disabled && (
                                <FontAwesomeIcon onClick={() => deleteImage(image.fileName, index)} icon={faX} 
                                className="text-red-500 absolute top-0 right-0 hover:cursor-pointer"/>
                            )}
                            <img className="h-14 w-14 m-1"
                            src={image.downloadUrl} alt={image.fileName} />
                        </div>
                    ))}
                </div>
            )}

            {/* Error text */}
            {errorText && (
                <div>
                    <p className="text-red-500 text-sm">{errorText}</p>
                </div>
            )}

        </div>
    )
}

export default MultiImageInput


