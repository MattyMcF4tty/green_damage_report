/* import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";*/
import React, { useEffect, useState, useRef } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { convertFileToBase64, normalizeFilePath, normalizeFolderPath, trimArrayToLimit } from "@/utils/logic/misc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faX } from "@fortawesome/free-solid-svg-icons";
import {
  formatJournalNumber,
  formatNumberplate,
  formatSSN,
} from "@/utils/logic/formattingLogic/formatters";
import { fetcDamageReportFolderFilesUrl, requestDamageReportFileDeletion, uploadFileToDamageReport, uploadFolderToDamageReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { ValidMimeTypes } from "@/utils/schemas/types";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { getDamageReportFileDownloadUrl, getDamageReportFolderDownloadUrls } from "@/utils/logic/damageReportLogic.ts/logic";

/* import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"; */

/* -----Text inputfield------------------------------------------------------------- */
interface InputfieldProps {
  id: string;
  labelText: string;
  required: boolean;
  type:
    | "number"
    | "text"
    | "emailPattern"
    | "tel"
    | "numberplate"
    | "license"
    | "ssn"
    | "journalNumber"
    | "speed";

  value: string | null;
  onChange: (isValue: string) => void;
  pattern?: string;
  placeHolder?: string;
}

export const Inputfield = ({
  id,
  labelText,
  required,
  value,
  type,
  onChange,
  placeHolder,
}: InputfieldProps) => {
  const [currentValue, setCurrentValue] = useState<string>(value || "");
  const [isError, setIsError] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState("bg-white");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Define the pattern based on the input type
  let pattern = "";
  let patternError = "";
  switch (type) {
    case "number":
      pattern = "[0-9]+"; /* Only allow digits */
      patternError = "Please enter digits only";
      break;
    case "emailPattern":
      pattern = "^[a-åA-Å0-9._%+-]+@[a-åA-Å0-9.-]+.[a-zA-Z]{2,5}$";
      patternError = "Please enter a valid Email";
      break;
    case "tel":
      pattern =
        "[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}"; /* Phone number format (XX-XX-XX-XX) */
      patternError = "Please enter a valid phone number";
      break;
    case "numberplate":
      pattern =
        "([a-zA-ZæøåÆØÅ]{2}\\s?\\d{2}\\s?\\d{3})|([a-zA-Z]{2}\\d{2}\\d{3})"; /* Updated Numberplate format */
      patternError = "Please enter a valid numberplate";
      break;
    case "text":
      pattern = ".*"; /* Allow any character, any number of times */
      patternError = "Please enter only valid characters";
      break;
    case "license":
      pattern = "[0-9]{8}";
      patternError = "Please enter a valid drivers license number";
      break;
    case "ssn":
      pattern = "^[0-9]{6}-[0-9]{4}$";
      patternError = "Please enter a valid social security number";
      break;
    case "speed":
      pattern = "[0-9]{3}";
      break;
    case "journalNumber":
      pattern = "[0-9]{4}-[0-9]{5}-[0-9]{5}-[0-9]{2}";
      patternError = "Please enter a valid journal number";
      break;

    default:
      pattern = ""; /* No pattern for "text" type, it allows any input */
      patternError = "Please enter only valid characters";
      break;
  }

  useEffect(() => {
    if (value === "" || value === null) {
      setBgColor("bg-white");
    } else {
      setBgColor("bg-MainGreen-100");
    }
  }, [value]);

  /* Live check if value matches pattern */
  useEffect(() => {
    const isValid = new RegExp(pattern).test(currentValue);

    if (isValid) {
      setIsError(false);
      onChange(currentValue);
    }
  }, [currentValue]);

  /* Checks if value matches pattern when no longer focused */
  const handleCheck = () => {
    const isValid = new RegExp(pattern).test(currentValue);

    if (isValid && isFocused) {
      setIsError(false);
      onChange(currentValue);
    } else {
      setIsError(true);
    }
  };

  const handleLeave = () => {
    const isValid = new RegExp(pattern).test(currentValue);

    if (isValid) {
      setIsError(false);
      onChange(currentValue);
    } else {
      setIsError(true);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Check if character was added or removed
    const isCharAdded = (oldValue: string, newValue: string) =>
      newValue.length > oldValue.length;

    // SSN logic
    if (type === "ssn") {
      if (isCharAdded(currentValue, newValue)) {
        if (newValue.length === 6 && !newValue.includes("-")) {
          newValue += "-";
        }
      } else {
        if (newValue.length === 6 && newValue.charAt(5) === "-") {
          newValue = newValue.slice(0, -1);
        }
      }
    }

    // Police report format logic
    if (type === "journalNumber") {
      if (isCharAdded(currentValue, newValue)) {
        if (
          newValue.length === 4 ||
          newValue.length === 10 ||
          newValue.length === 16
        ) {
          newValue += "-";
        }
      } else {
        if (
          [5, 11, 17].includes(newValue.length) &&
          newValue.charAt(newValue.length - 1) === "-"
        ) {
          newValue = newValue.slice(0, -1);
        }
      }
    }
    // Numberplate format logic
    if (type === "numberplate") {
      if (isCharAdded(currentValue, newValue)) {
        if (newValue.length >= 3 && !newValue.includes(" ")) {
          newValue = newValue.slice(0, 2) + " " + newValue.slice(2);
        } else if (newValue.length >= 5 && !newValue.slice(4).includes(" ")) {
          newValue = newValue.slice(0, 5) + " " + newValue.slice(5);
        }
      } else {
        if (
          [3, 6].includes(newValue.length) &&
          newValue.charAt(newValue.length - 1) === " "
        ) {
          newValue = newValue.slice(0, -1);
        }
      }
    }

    setCurrentValue(newValue);
    onChange(newValue);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value;

    switch (type) {
      case "numberplate":
        value = formatNumberplate(value);
        break;
      case "journalNumber":
        value = formatJournalNumber(value);
        break;
      case "ssn":
        value = formatSSN(value);
        break;
      default:
        break;
    }

    setCurrentValue(value);
    onChange(value);
  };

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="mb-2">
        {labelText}
      </label>
      <input
        className={`${bgColor} h-10 text-lg p-1 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none`}
        id={id}
        type={type}
        required={required}
        value={currentValue}
        onChange={handleInputChange}
        pattern={pattern}
        onBlur={(e) => {
          handleLeave();
          handleInputBlur(e);
        }}
        onInvalid={() => handleCheck()}
        onFocus={() => setIsFocused(true)}
        placeholder={placeHolder ? placeHolder : ""}
      />
      {isError && <p className="text-sm text-red-500">{patternError}</p>}
    </div>
  );
};

/* -----Time and date inputfield---------------------------------------------------- */
interface TimeDateProps {
  id: string;
  labelText: string;
  required: boolean;
  timeValue: string | null;
  dateValue: string | null;
  timeChange: (Value: string) => void;
  dateChange: (Value: string) => void;
}

export const TimeDateField = ({
  id,
  labelText,
  required,
  timeChange,
  dateChange,
  timeValue,
  dateValue,
}: TimeDateProps) => {
  const [dateError, setDateError] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>(timeValue || "");
  const [currentDate, setCurrentDate] = useState<string>(dateValue || "");

  const [timeBgColor, setTimeBgColor] = useState("bg-white");
  const [dateBgColor, setDateBgColor] = useState("bg-white");

  useEffect(() => {
    timeChange(currentTime);
  }, [currentTime]);

  useEffect(() => {
    dateChange(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (timeValue === "" || timeValue === null) {
      setTimeBgColor("bg-white");
    } else {
      setTimeBgColor("bg-MainGreen-100");
    }
  }, [timeValue]);

  useEffect(() => {
    if (dateValue === "" || dateValue === null) {
      setDateBgColor("bg-white");
    } else {
      setDateBgColor("bg-MainGreen-100");
    }
  }, [dateValue]);

  return (
    <div className="flex flex-col mb-4">
      <label className="mb-2">{labelText}</label>
      <div id={id} className="flex flex-row">
        <input
          className={`${dateBgColor} h-10 rounded-none w-32 border-[1px] focus:border-[3px] border-MainGreen-200 outline-none`}
          id={"Date" + id}
          type="date"
          value={currentDate}
          required={required}
          onChange={(event) => {
            setCurrentDate(event.target.value);
            setDateError(false);
          }}
        />
        <input
          className={`${timeBgColor} h-10 ml-5 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none`}
          id={"Time" + id}
          type="time"
          value={currentTime}
          required={required}
          onChange={(event) => {
            setCurrentTime(event.target.value);
            setTimeError(false);
          }}
          onInvalid={() => setTimeError(true)}
        />
      </div>
      {dateError && timeError && (
        <p className="text-sm text-red-500">Please choose a time and a date</p>
      )}
      {dateError && !timeError && (
        <p className="text-sm text-red-500">Please choose a date</p>
      )}
      {timeError && !dateError && (
        <p className="text-sm text-red-500">Please choose a time</p>
      )}
    </div>
  );
};

/* -----Yes No checkbox---------------------------------------------------- */
interface YesNoProps {
  id: string;
  labelText: string;
  required: boolean;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export const YesNo = ({
  id,
  labelText,
  required,
  onChange,
  value,
}: YesNoProps) => {
  const [checkRequired, setCheckRequired] = useState<boolean>(required);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setCheckRequired(value === null);
  }, [value]);

  return (
    <div className="flex flex-col mb-4">
      <label>{labelText}</label>

      {/* Yes */}
      <div id={id} className="flex flex-row items-center mt-2">
        <label htmlFor={"Yes" + id} className="mr-2">
          Yes
        </label>
        <input
          className="accent-MainGreen-300 scale-125"
          id={"Yes" + id}
          type="checkbox"
          checked={value !== null && value}
          required={checkRequired}
          onChange={() => {
            onChange(true);
            setIsError(false);
          }}
          onInvalid={() => setIsError(true)}
        />

        {/* No  */}
        <label htmlFor={"No" + id} className="ml-4 mr-2">
          No
        </label>
        <input
          className="accent-MainGreen-300 scale-125"
          id={"No" + id}
          type="checkbox"
          checked={value !== null && !value}
          required={checkRequired}
          onChange={() => {
            onChange(false);
            setIsError(false);
          }}
          onInvalid={() => setIsError(true)}
        />
      </div>
      {isError && (
        <p className="text-sm text-red-500">Please check one of the boxes</p>
      )}
    </div>
  );
};

/* ----- TextField ---------------------------------------------------- */
interface TextFieldProps {
  id: string;
  maxLength: number;
  labelText: string;
  required: boolean;
  value: string | null;
  onChange: (value: string) => void;
}

export const TextField = ({
  id,
  maxLength,
  labelText,
  required,
  onChange,
  value,
}: TextFieldProps) => {
  const [text, setText] = useState<string>(value || "");
  const [currentLength, setCurrentLength] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    setCurrentLength(text.length);
    onChange(text);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [text]);

  useEffect(() => {
    if (value === "" || value === null) {
      setBgColor("bg-white");
    } else {
      setBgColor("bg-MainGreen-100");
    }
  }, [value]);

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id}>{labelText}</label>
      <textarea
        ref={textareaRef}
        id={id}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setIsError(false);
        }}
        maxLength={maxLength}
        required={required}
        className={`${bgColor} min-h-10 h-auto resize-none overflow-hidden outline-none focus:border-[3px] border-[1px] border-MainGreen-200 p-1`}
        onInvalid={() => setIsError(true)}
      />
      <p>{`${currentLength.toString()}/${maxLength.toString()}`}</p>
      {isError && (
        <p className="text-sm text-red-500">
          Please enter only valid characters
        </p>
      )}
    </div>
  );
};

// ----------------------- MULTIPLE IMAGES FIELD --------------------------------------------------
interface multipleImageFieldProps {
  componentId: string;
  reportId: string;
  imageLimit: number;
  labelText: string;
  required: boolean;
  folderPath: string;
  setImages?: (imageData: {fileName: string;downloadUrl: string;}[]) => void;
  setIsLoading?: (isloading: boolean) => void;
}

export const MultipleImageField = ({
  componentId,
  reportId,
  imageLimit,
  labelText,
  required,
  folderPath,
  setImages,
  setIsLoading,
}: multipleImageFieldProps) => {
  const [isRequired, setIsRequired] = useState(required);
  const [imageData, setImageData] = useState<{fileName: string;downloadUrl: string;}[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [isError, setIsError] = useState<string | null>();
  const normalizedFolderPath = normalizeFolderPath(folderPath);
  const folderName = normalizedFolderPath.split('/').slice(-2)[0];

  const getImages = async () => {
    setDisabled(true);
    const fileData = await getDamageReportFolderDownloadUrls(reportId, normalizedFolderPath)
    setImageData(fileData)
    setDisabled(false);
  }

  useEffect(() => {
    getImages()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(null);
    setDisabled(true);
    const files = e.target.files;
    if (!files || files.length === 0) {
      setDisabled(false);
      return;
    }
  
    // Calculate how many new images can be uploaded
    const availableSlots = imageLimit - imageData.length;
    const imagesToProcess = Math.min(files.length, availableSlots);
  
    if (imagesToProcess < files.length) {
      setIsError(`You have exceeded the limit.`);
    }
  
    const fileData: {name:string, mimeType:ValidMimeTypes, fileBase64:string}[] = [];
    for (let index = 0; index < imagesToProcess; index++) {
      const file = files.item(index);
      if (!file) {
        continue;
      }
  
      const base64 = await convertFileToBase64(file);
      const thisFileData = {
        name: `${folderName}${index}`,
        mimeType: file.type as ValidMimeTypes,
        fileBase64: base64
      }
      fileData.push(thisFileData);
    }
  
    await uploadFolderToDamageReport(reportId, normalizedFolderPath, fileData)
  
    await getImages()
  };  

  const deleteImage = async (fileName:string) => {
    setDisabled(true);
    await requestDamageReportFileDeletion(reportId, `${normalizedFolderPath}${fileName}`);
    await getImages();
  }  

  useEffect(() => {
    if (setImages) {
      setImages(imageData)
    }
  }, [imageData])

  return (
    <div className="w-full h-full flex flex-col">
      <label htmlFor={componentId}>
        {labelText}
      </label>

      <div id={componentId} className="flex flex-col">
        <div className="flex flex-row items-center">
          {/* Custom designed input */}
          <div
            className={`w-36 relative flex items-center 
          ${
            imageData.length >= 3
              ? "rounded-t-md"
              : imageData.length > 0
              ? "rounded-t-md rounded-r-md"
              : "rounded-md"
          }
          ${disabled ? "bg-MainGreen-200" : "bg-MainGreen-300"}`}
          >
            <input
              className="opacity-0 z-20"
              type="file"
              accept="image/png, image/jpeg"
              required={isRequired}
              disabled={imageData.length >= imageLimit || disabled}
              onChange={(e) => handleUpload(e)}
              multiple={true}
            />
            <div className="absolute z-10 text-white ml-2 flex flex-row items-center">
              <FontAwesomeIcon icon={faCamera} className="mr-2" />
              <p>Select images</p>
            </div>
          </div>
          {/* Display how many files can be uploaded */}
          <p className="ml-2 italic">
            {`${imageLimit - imageData.length}`} left
          </p>
        </div>

        {/* Map over the images and display them */}
        <div className="flex flex-col">
          {/* Make a new line every five images */}
          {Array.from({ length: Math.ceil(imageData.length / 5) }).map(
            (_, rowIndex) => (
              <div key={rowIndex} className="flex flex-row">
                {imageData
                  .slice(rowIndex * 5, rowIndex * 5 + 5)
                  .map((imageData, index) => (
                    <div key={index} className="relative w-14 h-14">
                      {/* X icon, for deletion */}
                      <FontAwesomeIcon
                        className="z-10 h-4 w-4 absolute top-0 right-0 text-red-500"
                        icon={faX}
                        onClick={() =>
                          deleteImage(imageData.fileName)
                        }
                      />

                      {/* The image */}
                      <img
                        className="h-full w-full z-0"
                        src={imageData.downloadUrl}
                        alt={`DamageImage${index}`}
                      />
                    </div>
                  ))}
              </div>
            )
          )}
        </div>

        {isError && <p className="text-sm text-red-500">{isError}</p>}
      </div>
    </div>
  );
};

// -------------------------------- SINGLE IMAGE FIELD ----------------------------------
interface singleImagefield {
  componentId: string;
  reportId: string;
  labelText: string;
  required: boolean;
  filePath: string;
  setImage?: (image: {fileName: string;downloadUrl: string;} | null) => void;
  setIsLoading?: (isLoading: boolean) => void;
}

export const SingleImagefield = ({
  componentId,
  reportId,
  labelText,
  required,
  filePath,
  setImage,
  setIsLoading,
}: singleImagefield) => {
  const [disabled, setDisabled] = useState(false);
const [imageData, setImageData] = useState<{fileName: string;downloadUrl: string;} | null>(null);
  const [isError, setIsError] = useState<null | string>(null);
  const normalizedFilePath = normalizeFilePath(filePath);

  const getImage = async () => {
    setDisabled(true);
    const image = await getDamageReportFileDownloadUrl(reportId, normalizedFilePath);
    setImageData(image);
    setDisabled(false);
  }

  useEffect(() => {
    setDisabled(true);
    getImage()
  }, [])

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(null);
    setDisabled(true);
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) {
      setDisabled(false);
      return
    }
    if (imageData || fileList.length > 1) {
      setIsError('Limit exceeded.')
      setDisabled(false);
      return
    }

    const file = fileList.item(0);
    if (!file) {
      setDisabled(false);
      return;
    }

    const base64 = await convertFileToBase64(file);
    await uploadFileToDamageReport(reportId, normalizedFilePath, base64, file.type as ValidMimeTypes)

    await getImage()
  }

  const deleteImage = async (imagePath:string) => {
    setDisabled(true);
    await requestDamageReportFileDeletion(reportId, imagePath)
    await getImage();
  }

  useEffect(() =>{
    if (setImage) {
      setImage(imageData)
    }
  }, [imageData])

  return (
    <div>
      <label htmlFor={componentId}>
        {labelText}
      </label>
      <div id={componentId} className="flex flex-row items-center">
        
        {/* Custom designed input */}
        <div
          className={`w-36 relative flex items-center 
        ${imageData ? "rounded-t-md rounded-r-md" : "rounded-md"}
        ${disabled ? "bg-MainGreen-200" : "bg-MainGreen-300"}`}
        >
          <input
            className="opacity-0 z-20"
            type="file"
            accept="image/png, image/jpeg"
            required={required}
            disabled={imageData && true || disabled}
            onChange={(e) => uploadImage(e)}
            multiple={false}
          />
          <div className="absolute z-10 text-white ml-2 flex flex-row items-center">
            <FontAwesomeIcon icon={faCamera} className="mr-2" />
            <p>Select image</p>
          </div>
        </div>
      </div>
      {imageData && (
        <div className="relative w-20 h-20">
          {/* X icon, for deletion */}
          <FontAwesomeIcon
            className="z-10 h-4 w-4 absolute top-0 right-0 text-red-500"
            icon={faX}
            onClick={() => deleteImage(filePath)}
          />

          {/* The image */}
          <img
            className="h-full w-full z-0"
            src={imageData.downloadUrl}
            alt={`DamageImage`}
          />
        </div>
      )}
      {isError && <p className="text-sm text-red-500">{isError}</p>}
    </div>
  );
};

/* ----- Checkbox ---------------------------------------------------- */
interface CheckboxProps {
  id: string;
  labelText: string;
  value: boolean;
  requried: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({
  id,
  labelText,
  value,
  onChange,
  requried,
}: CheckboxProps) => {
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center">
      <label htmlFor={"Checkbox" + id}>{labelText}</label>
      <input
        className="accent-MainGreen-300 items-center mr-1 scale-125"
        id={"Checkbox" + id}
        type="checkbox"
        checked={value}
        required={requried}
        onChange={(event) => {
          onChange(event.target.checked);
          setIsError(false);
        }}
        onInvalid={() => setIsError(true)}
      />
      {isError && <p className="text-sm text-red-500">Please check this box</p>}
    </div>
  );
};

interface AddressFieldProps {
  value: string | null; // Change this type as needed
  onChange: (value: any) => void; // Change this type as needed
  labelText: string;
}

export const AddressField = ({
  value,
  onChange,
  labelText,
}: AddressFieldProps) => {
  const [currentAddress, setCurrentAddress] = useState(value || "");

  useEffect(() => {
    onChange(currentAddress);
  }, [currentAddress]);

  const { placePredictions, getPlacePredictions } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [bgColor, setBgColor] = useState<string>("bg-white");

  useEffect(() => {
    if (currentAddress === "" || currentAddress === null) {
      setBgColor("bg-white");
    } else {
      setBgColor("bg-MainGreen-100");
    }
  }, [currentAddress]);

  const handlePlaceSelect = (place: any) => {
    setCurrentAddress(place.description);
    getPlacePredictions({ input: "" });

    const request = {
      placeId: place.place_id,
      fields: ["formatted_address", "geometry.location"],
    };
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails(request, (result: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("Selected Address:", result.formatted_address);
      } else {
        console.error("Error fetching place details:", status);
      }
    });
  };

  return (
    <div className="mb-4">
      <label className="mb-2 block">{labelText}</label>
      <input
        value={currentAddress}
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          setCurrentAddress(evt.target.value);
          getPlacePredictions({ input: evt.target.value });
        }}
        className={`w-full h-10 text-lg p-1 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none ${bgColor}`}
      />
      {placePredictions.map((item) => (
        <div
          key={item.place_id}
          onClick={() => handlePlaceSelect(item)}
          className="cursor-pointer"
        >
          {item.description}
        </div>
      ))}
    </div>
  );
};
