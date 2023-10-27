import { fetchDamageReportFileUrl, requestDamageReportFileDeletion, uploadFileToDamageReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { fileListToFileArray, fileToBase64, normalizeFilePath } from "@/utils/logic/misc";
import { faCamera, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";


interface SingleImageFieldProps {
    componentId: string;
    reportId: string;
    labelText: string;
    filePath: string;
    required?: boolean;
    setIsLoading?: (isloading: boolean) => void;
    setRequired?: (required:boolean) => void;
}

const SingleImageField = ({componentId, reportId, labelText, required, filePath, setIsLoading}:SingleImageFieldProps) => {
    const [isRequired, setIsRequired] = useState(required ? required : false);
    const [imageData, setImageData] = useState<{fileName: string; downloadUrl: string;}>();
    const [errorText, setErrorText] = useState<string | null>();

    const [disabled, setDisabled] = useState(false);

    const normalizedFilePath = normalizeFilePath(filePath);
    const fileName = normalizedFilePath.split('/').slice(-2)[0];

    // Get images after component has been build.
    useEffect(() => {
        getImage()
    }, [])

    // Fetch image and update components imageData.
    const getImage = async () => {
        setDisabled(true);
        setImageData(await fetchDamageReportFileUrl(reportId, normalizedFilePath))
        setDisabled(false);
    }

    // Upload images from input field.
    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setDisabled(true);
            
            // Check if there already is a image choosen
            if (imageData) {
                setErrorText('Limit has been reached.');
                return;
            }

            // Convert FileList to FileArray and choose first point. 
            // (This is just for safety, should not be possible to upload more than one file)
            const fileArray = fileListToFileArray(e.target.files);
            if (fileArray.length <= 0) {
                return
            }
            const file = fileArray[0];

            // Convert image to buffer and prepare image for upload.
            const fileBase64 = await fileToBase64(file);

            await uploadFileToDamageReport(reportId, normalizedFilePath, fileBase64)

            // Reset the inputfield after upload of the image
            e.target.value = '';

            // After uploading we fetch image so that other triggers trigger
            await getImage();
        } catch (error:any) {
            console.error(error);
            setErrorText('Something went wrong uploading image');
            setDisabled(false);
        }
    }

    const deleteImage = async () => {
        setDisabled(true);
        await requestDamageReportFileDeletion(reportId, normalizedFilePath);

        setImageData(undefined);    
        setDisabled(false);
    }

    return (
        <div id={componentId}
        className="flex flex-col">
            {/* Input field */}
            <label htmlFor={`${componentId}Input`}>{labelText}</label>
            <div id={`${componentId}Input`} className={`relative w-36 rounded-md duration-150 ${disabled ? 'bg-MainGreen-200': 'bg-MainGreen-300'}`}>
                <p className="text-white absolute left-0 top-1/2 transform -translate-y-1/2 p-2">
                    Select image  <FontAwesomeIcon icon={faCamera}/>
                </p>
                <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    required={isRequired}
                    disabled={disabled || imageData ? true : false} 
                    multiple={false} 
                    onChange={(e) => uploadFile(e)}
                    className="w-full h-full opacity-0 hover:cursor-pointer"
                />
            </div>

            {imageData && (
                <div className="relative" key={imageData.fileName}>
                    {!disabled && (
                        <FontAwesomeIcon onClick={() => deleteImage()} icon={faX} 
                        className="text-red-500 absolute top-0 right-0 hover:cursor-pointer"/>
                    )}
                    <img className="h-20 w-20 m-1"
                    src={imageData.downloadUrl} alt={imageData.fileName} />
                </div>
            )}
        </div>
    )
}

export default SingleImageField;