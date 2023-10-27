import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FileInputProps {
    componentId: string;
    disabled: boolean;
    required: boolean;
    acceptFileTypes: string;

    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}


const FileInput = ({componentId, disabled, required, acceptFileTypes, onChange}: FileInputProps) => {

    return (
        <div id={`${componentId}Input`} className={`relative w-36 rounded-md duration-150 ${disabled ? 'bg-MainGreen-200': 'bg-MainGreen-300'}`}>
            <p className="text-white absolute left-0 top-1/2 transform -translate-y-1/2 p-2">
                Select File  <FontAwesomeIcon icon={faFileArrowUp} />
            </p>
            <input 
                type="file" 
                accept={acceptFileTypes} 
                required={required}
                disabled={disabled} 
                multiple={true} 
                onChange={(e) => onChange(e)}
                className="w-full h-full hover:cursor-pointer"
            />
        </div>
    )
}

export default FileInput;