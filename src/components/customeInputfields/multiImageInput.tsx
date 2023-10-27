import { fetcDamageReportFolderFilesUrl, uploadFolderToDamageReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { fileListToFileArray, fileToBase64, fileToBuffer, normalizeFolderPath, trimArrayToLimit } from "@/utils/logic/misc";
import { ValidMimeTypes } from "@/utils/schemas/types";
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
    }, [imageData]);
    

    // Fetch images and update components imageData.
    const getImages = async () => {
        setDisabled(true);
        setImageData(await fetcDamageReportFolderFilesUrl(reportId, folderPath));
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
                setErrorText('Limit has been reached.');
                trimmedFiles = trimArrayToLimit(imageLimit - imageData.length, files)

                // Return if no more files can be uploaded
                if (trimmedFiles.length <= 0) {
                    return;
                }
            }

            // Convert files to buffer and prepare data for upload.
            const filesBase64 = await Promise.all(trimmedFiles.map(file => fileToBase64(file)));

            const fileDataPromises = filesBase64.map(async (fileBase64, index) => {
                return {
                    name: `${folderName}${index}`,
                    fileBase64: fileBase64
                }; 
            });

            const fileData = await Promise.all(fileDataPromises);
            console.log('dfsdf')
            await uploadFolderToDamageReport(reportId, folderPath, fileData);

            // After uploading we fetch images so that other triggers trigger
            await getImages();
        } catch (error:any) {
            console.error(error);
            setErrorText('Something went wrong uploading images');
            setDisabled(false);
        }
    }
    

    return (
        <div id={componentId}
        className="flex flex-col">
            {/* Input field */}
            <label htmlFor={`${componentId}Input`}>{labelText}</label>
            <div id={`${componentId}Input`}>
                <input type="file" accept="image/png, image/jpeg" required={isRequired}
                disabled={disabled || limitReached} multiple={true} 
                onChange={(e) => uploadFiles(e)}
                className=""
                />
            </div>

            {/* Image display */}
            {imageData.length > 0 && (
                <div className="flex flex-wrap w-full">
                    {imageData.map((image) => (
                      <img className="h-14 w-14 m-1" key={image.fileName}
                      src={image.downloadUrl} alt={image.fileName} />
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


