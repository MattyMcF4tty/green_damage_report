/* import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";*/
import { uploadImage } from "@/firebase/clientApp";
import { Address } from "cluster";
import React, { useEffect, useState, useRef, use } from "react";
/* import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"; */

/* -----Text inputfield------------------------------------------------------------- */
interface InputfieldProps {
  id: string;
  labelText: string;
  required: boolean;
  type: "number" | "text" | "email" | "tel" | "numberplate" | "license" | "ssn";
  value: string;
  onChange: (isValue: string) => void;
  pattern?: string;
}

export const Inputfield = ({
  id,
  labelText,
  required,
  value,
  type,
  onChange,
}: InputfieldProps) => {
  const [currentValue, setCurrentValue] = useState<string>(value);
  const [isError, setIsError] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Define the pattern based on the input type
  let pattern = "";
  let patternError = ""
  switch (type) {
    case "number":
      pattern = "[0-9]+"; /* Only allow digits */
      patternError = "Please enter digits only";
      break;
    case "email":
      pattern = "^[a-zA-Z0-9.]{0,100}@[a-zA-Z0-9]{2,10}.(es|com|org)$"; /* Email pattern */
      patternError = "Please enter a valid Email";
      break;
    case "tel":
      pattern = "[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}"; /* Phone number format (XX-XX-XX-XX) */
      patternError = "Please enter a valid phone number";
      break;
    case "numberplate":
      pattern = "[a-zA-Z]{2}\\d{2}\\d{3}"; /* Numberplate format */
      patternError = "Please enter a valid numberplate";
      break;
    case "text":
      pattern = ".*"; /* Allow any character, any number of times */
      patternError = "Please enter only valid characters";
      break;
    case "license":
      pattern = "[0-9]{8,}";
      patternError = "Please enter a valid drivers license number";
      break;
    case "ssn":
      pattern = "^[0-9]{6}-[0-9]{4}$";
      patternError = "Please enter a valid social security number";
      break;
    default:
      pattern = ""; /* No pattern for "text" type, it allows any input */
      patternError = "Please enter only valid characters";
      break;
  }

  /* Live check if value matches pattern */
  useEffect(() => {
    const isValid = new RegExp(pattern).test(currentValue)

    if (isValid) {
      setIsError(false)
      onChange(currentValue)
    }
  }, [currentValue]);

  /* Checks if value matches pattern when no longer focused */
  const handleCheck = () => {
    const isValid = new RegExp(pattern).test(currentValue)

    if (isValid && isFocused) {
      setIsError(false)
      onChange(currentValue)
    }
    else {
      setIsError(true)
    }
  }

  const handleLeave = () => {
    const isValid = new RegExp(pattern).test(currentValue)

    if (isValid) {
      setIsError(false)
      onChange(currentValue)
    }
    else {
      setIsError(true)
    }
  }

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id}>{labelText}</label>
      <input
        className="bg-MainGreen-100 h-10 text-lg p-1 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none"
        id={id}
        type={type}
        required={required}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        pattern={pattern}
        onBlur={() => handleLeave()}
        onInvalid={() => handleCheck()}
        onFocus={() => setIsFocused(true)}
      />
      {isError && (
        <p className="text-sm text-red-500">{patternError}</p>
      )}
    </div>
  );
};

/* -----Time and date inputfield---------------------------------------------------- */
interface TimeDateProps {
  id: string;
  labelText: string;
  required: boolean;
  timeValue: string;
  dateValue: string;
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
  return (
    <div className="flex flex-col mb-4">
      <label>{labelText}</label>
      <div id={id} className="flex flex-row">
        <input
          className="bg-MainGreen-100 h-10 mr-5 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none"
          id={"Time" + id}
          type="time"
          value={timeValue}
          required={required}
          onChange={(event) => timeChange(event.target.value)}
        />

        <input
          className="bg-MainGreen-100 h-10 rounded-none w-32 border-[1px] focus:border-[3px] border-MainGreen-200 outline-none"
          id={"Date" + id}
          type="date"
          value={dateValue}
          required={required}
          onChange={(event) => dateChange(event.target.value)}
        />
      </div>
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
      <div id={id} className="flex flex-row items-center">
        <label htmlFor={"Yes" + id} className="mr-2">
          Yes
        </label>
        <input
          className="accent-MainGreen-300 scale-125"
          id={"Yes" + id}
          type="checkbox"
          checked={value !== null && value}
          required={checkRequired}
          onChange={() => {onChange(true); setIsError(false)}}
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
          onChange={() => {onChange(false); setIsError(false)}}
          onInvalid={() => setIsError(true)}
        />
      </div>
      {isError && (
        <p className="text-sm text-red-500">Please check one of the boxes.</p>
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
  value: string;
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
  const [text, setText] = useState<string>(value);
  const [currentLength, setCurrentLength] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentLength(value.length);
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [text]);

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id}>{labelText}</label>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        required={required}
        className="min-h-10 h-auto resize-none overflow-hidden outline-none focus:border-[3px] border-[1px] border-MainGreen-200 p-1 bg-MainGreen-100"
      />
      <p>{`${currentLength.toString()}/${maxLength.toString()}`}</p>
    </div>
  );
};

/* ----- ImageField ---------------------------------------------------- */
interface ImageFieldProps {
  reportID: string;
  id: string;
  required: boolean;
  labelText: string;
  image: string | null;
  perspective: "FRONT" | "RIGHT" | "BACK" | "LEFT";
}

export const ImageField = ({
  reportID,
  image,
  required,
  id,
  labelText,
  perspective,
}: ImageFieldProps) => {
  const [isRequired, setIsRequired] = useState<boolean>(required);

  useEffect(() => {
    setIsRequired(image === null);
  }, [image]);

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id}>{labelText}</label>
      <input
        className=""
        id={id}
        type="file"
        accept="image/png, image/jpeg"
        required={isRequired}
        onChange={(e) => uploadImage(reportID, e.target.files, perspective)}
      />
      {image && <img src={image} alt={id} className="w-20" />}
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
  return (
    <div className="flex flex-row-reverse items-center mr-4">
      <label htmlFor={"Checkbox" + id}>{labelText}</label>
      <input
        className="accent-MainGreen-300 items-center mr-1 scale-125"
        id={"Checkbox" + id}
        type="checkbox"
        checked={value}
        required={requried}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
};

/* ----- Location field ---------------------------------------------------- */
/* interface LocationFieldProps {}

export const LocationField = ({}: LocationFieldProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (loadError)
    return (
      <div>
        <p>error loading maps</p>
      </div>
    );
  else if (isLoaded)
    return (
      <GoogleMap
        zoom={5}
        center={{ lat: 0, lng: 0 }}
        mapContainerStyle={{ height: "100%", width: "100%" }}
      >
        <Marker position={{ lat: 0, lng: 0 }} draggable={true} />
      </GoogleMap>
    );
  else
    return (
      <div>
        <p>loding maps</p>
      </div>
    );
}; */

/* interface AddressFieldProps {
  id: string;
  labelText: string;
  required: boolean;
  onChange: (address: string) => void;
}

export const AddressField= ({ id, labelText, required, onChange }: AddressFieldProps) => {
  const { isLoaded, loadError } = loadGoogleMaps();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
    } 
    catch (error) {
      console.log("Error: ", error);
    }

    onChange(description);
  };


  if ( isLoaded ) {
    return (
      <div>
        <p>Loading Google Maps...</p>
      </div>
    )
  }
  else if ( loadError ) {
    <div>
      <p>Google maps failed to load</p>
    </div>
  }
  else if ( !isLoaded ) {
    <div>
      <p>Loading google maps...</p>
    </div>
  }

};

TODO: Fix the google maps integration, so the fields load probably, all google maps inputfields 
should be inside this GoogleMapsField. Maybe make new file called google_maps_fields */
