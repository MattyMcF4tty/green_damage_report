/* import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";*/
import React, { useEffect, useState, useRef } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { trimArrayToLimit } from "@/utils/logic/misc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faX } from "@fortawesome/free-solid-svg-icons";
import { deleteReportFile, getReportFile, getReportFolder, uploadReportFile } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";
import { deleteStorageFile } from "@/utils/logic/firebaseLogic/storage";
import { formatJournalNumber, formatNumberplate, formatSSN } from "@/utils/logic/formattingLogic/formatters";

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
    | "email"
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
    case "email":
      pattern =
        "^[a-åA-Å0-9.]{1,100}@[a-åA-Å0-9]{2,20}\\.[a-åA-Å]{1,3}$"; /* Email pattern */
      patternError = "Please enter a valid Email";
      break;
    case "tel":
      pattern =
        "[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}"; /* Phone number format (XX-XX-XX-XX) */
      patternError = "Please enter a valid phone number";
      break;
    case "numberplate":
      pattern =
        "([a-zA-Z]{2}\\s?\\d{2}\\s?\\d{3})|([a-zA-Z]{2}\\d{2}\\d{3})"; /* Updated Numberplate format */
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
  id: string;
  reportId: string;
  imageLimit: number;
  labelText: string;
  required: boolean;
  folderPath: string;
  setImages?: (images: string[]) => void;
  setIsLoading?: (isloading: boolean) => void;
}

export const MultipleImageField = ({id, reportId, imageLimit, labelText, required, folderPath, setImages, setIsLoading}: multipleImageFieldProps) => {
  const [isRequired, setIsRequired] = useState(required);
  const [imageURLs, setImageURLs] = useState<{url:string, path:string}[]>([])
  const [disabled, setDisabled] = useState(false);
  const [isError, setIsError] = useState<string | null>();

  useEffect(() => {
    if (setIsLoading) {
      setIsLoading(disabled)
    };
  }, [disabled])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(null)
    // Disable inputfield while handling the new images
    setDisabled(true);

    // Check if files is empty
    if (!e.target.files) {
      setDisabled(false);
      return;
    }

    // Make filelist to an array
    let newImages = Array.from(e.target.files);


    if (imageURLs.length + newImages.length > imageLimit) {
      // Calculate the remaining space and remove exceeding images
      const remainingSpace = imageLimit - imageURLs.length;
      newImages = trimArrayToLimit(remainingSpace, newImages);

      // Set error so user understands why not all their images where uploaded.
      setIsError("Image limit exceeded")
    }

    if (newImages.length > 0) {
      await Promise.all(newImages.map(image => {
        let imageBlob = new Blob([image], { type:image.type });
        return uploadReportFile(reportId, folderPath + image.name + `${imageURLs.length}`, imageBlob);
      }));      
    }

    let imagesInStorage:{url: string, path:string}[];
    try {
      imagesInStorage = await getReportFolder(reportId, folderPath)
    } catch (error:any) {
      setIsError(error.message)
      setDisabled(false);
      return;
    }

    setImageURLs(imagesInStorage)

    setDisabled(false);
  }


  // Disable button if imagelimit is reached or exceeded
  useEffect(() => {
    if (imageURLs.length >= imageLimit) {
      setIsError('Image limit reached')
      setDisabled(true);
    } else if (setImages) {
      setImages(imageURLs.map((image) => {
        return image.url
      }))
    }
  }, [imageURLs])

  async function getImg() {
    setDisabled(true);
    let imagesInStorage:{url: string, path:string}[];
    try {
      imagesInStorage = await getReportFolder(reportId, folderPath)
    } catch (error:any) {
      setIsError(error.message)
      setDisabled(false);
      return;
    }

    setImageURLs(imagesInStorage)
    setDisabled(false);
  }

  useEffect(() => {
    getImg()
  }, [])

  const handleDeleteImage = async (path:string, index:number) => {
    setDisabled(true);

    await deleteStorageFile(path);
    getImg()
    setIsError(null)

    setDisabled(false);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <label htmlFor={id}>{labelText}</label>
      <div id={id} className="flex flex-col">
      <div className="flex flex-row items-center">
          {/* Custom designed input */}
          <div 
          className={`w-36 relative flex items-center 
          ${imageURLs.length >= 3 ? 'rounded-t-md' : imageURLs.length > 0 ? 'rounded-t-md rounded-r-md' : 'rounded-md'}
          ${disabled ? 'bg-MainGreen-200' : 'bg-MainGreen-300'}`}>
            <input
              className="opacity-0 z-20"
              type="file" 
              accept="image/png, image/jpeg"
              required={isRequired}
              disabled={imageURLs.length >= imageLimit || disabled}
              onChange={(e) => handleChange(e)}
              multiple={true}
            />
            <div className="absolute z-10 text-white ml-2 flex flex-row items-center">
              <FontAwesomeIcon icon={faCamera} className="mr-2"/>
              <p>
                Select images 
              </p>
            </div>

          </div>
          {/* Display how many files can be uploaded */}
          <p className="ml-2 italic">{`${imageLimit-imageURLs.length}`} left</p>
      </div>

        {/* Map over the images and display them */}
        <div className="flex flex-col">

          {/* Make a new line every five images */}
          {Array.from({ length: Math.ceil(imageURLs.length / 5) }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex flex-row">
              {imageURLs.slice(rowIndex * 5, rowIndex * 5 + 5).map((imageURL, index) => (
                <div key={index} className="relative w-14 h-14">
                  
                  {/* X icon, for deletion */}
                  <FontAwesomeIcon 
                    className="z-10 h-4 w-4 absolute top-0 right-0 text-red-500" 
                    icon={faX} 
                    onClick={() => handleDeleteImage(imageURL.path, index + rowIndex * 5)}
                  />
                  
                  {/* The image */}
                  <img 
                    className="h-full w-full z-0"
                    src={imageURL.url} 
                    alt={`DamageImage${index}`} 
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {isError && (
          <p className="text-sm text-red-500">{isError}</p>
        )}
      </div>
    </div>
  )
}

// -------------------------------- SINGLE IMAGE FIELD ----------------------------------
interface singleImagefield {
  id: string;
  reportId: string;
  labelText: string;
  required: boolean;
  filePath: string;
  setImage?: (image: string) => void;
  setIsLoading?: (isLoading: boolean) => void;
}

export const SingleImagefield = ({id, reportId, labelText, required, filePath, setImage, setIsLoading}: singleImagefield) => {
  const [disabled, setDisabled] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isError, setIsError] = useState<null | string>(null);

  useEffect(() => {
    if (setIsLoading) {
      setIsLoading(disabled)
    };
  }, [disabled])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(null)
    // Disable inputfield while handling the new images
    setDisabled(true);

    // Check if files is empty
    if (!e.target.files) {
      setDisabled(false);
      return;
    }

    // Make filelist to an array
    let newImages = Array.from(e.target.files);


    if (imageUrl.length + newImages.length > 1) {
      // Calculate the remaining space and remove exceeding images
      const remainingSpace = 1 - imageUrl.length;
      newImages = trimArrayToLimit(remainingSpace, newImages);

      // Set error so user understands why not all their images where uploaded.
      setIsError("Image limit exceeded")
    }

    if (newImages.length > 0) {
      await Promise.all(newImages.map(image => {
        let imageBlob = new Blob([image], { type:image.type });
        return uploadReportFile(reportId, filePath, imageBlob);
      }));      
    }

    let imageInStorage:string;
    try {
      imageInStorage = await getReportFile(reportId, filePath)
    } catch (error:any) {
      setIsError(error.message)
      setDisabled(false);
      return;
    }

    setImageUrl(imageInStorage)

    setDisabled(false);
  }

  useEffect(() => {
    console.log(imageUrl)
    if (setImage) {
      setImage(imageUrl)
    }
  }, [imageUrl])

  async function getImg() {
    setDisabled(true);
    let imageInStorage:string;
    try {
      imageInStorage = await getReportFile(reportId, filePath)
    } catch (error:any) {
      setDisabled(false);
      return;
    }

    setImageUrl(imageInStorage)
    setDisabled(false);
  }

  useEffect(() => {
    try {
      getImg()
    } catch (error) {
      return
    }
  }, [])

  const handleDeleteImage = async (path:string) => {
    setDisabled(true);

    await deleteReportFile(reportId, path);
    setImageUrl('')
    setIsError(null)

    setDisabled(false);
  }

  return (
    <div>

      <label htmlFor={id}></label>
      <div id={id} className="flex flex-row items-center">
        {/* Custom designed input */}
        <div 
        className={`w-36 relative flex items-center 
        ${imageUrl.length > 0 ? 'rounded-t-md rounded-r-md' : 'rounded-md'}
        ${disabled ? 'bg-MainGreen-200' : 'bg-MainGreen-300'}`}>
          <input
            className="opacity-0 z-20"
            type="file" 
            accept="image/png, image/jpeg"
            required={required}
            disabled={imageUrl !== '' || disabled}
            onChange={(e) => handleChange(e)}
            multiple={false}
          />
          <div className="absolute z-10 text-white ml-2 flex flex-row items-center">
            <FontAwesomeIcon icon={faCamera} className="mr-2"/>
            <p>
              Select image
            </p>
          </div>
        </div>
      </div>
      {imageUrl.length > 0 && (
          <div className="relative w-20 h-20">
  
            {/* X icon, for deletion */}
            <FontAwesomeIcon 
              className="z-10 h-4 w-4 absolute top-0 right-0 text-red-500" 
              icon={faX} 
              onClick={() => handleDeleteImage(filePath)}
            />
            
            {/* The image */}
            <img 
              className="h-full w-full z-0"
              src={imageUrl} 
              alt={`DamageImage`} 
            />
          </div>
        )}
        {isError && (
          <p className="text-sm text-red-500">{isError}</p>
        )}
    </div>
  )
}

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
