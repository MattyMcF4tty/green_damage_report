/* import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";*/
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
  type: "number" | "text" | "email" | "tel" | "numberplate" | "license";
  onChange: (isValue: string) => void;
  pattern?: string;
}

export const Inputfield = ({
  id,
  labelText,
  required,
  type,
  onChange,
}: InputfieldProps) => {
  const [isValue, setIsValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onChange(isValue);
  }, [isValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setIsValue(value);

    // If a pattern is provided, check for pattern validity
    if (pattern) {
      const isValid = new RegExp(pattern).test(value);
      setError(isValid ? null : "Invalid input format.");
    }
  };

  // Define the pattern based on the input type
  let pattern = "";
  switch (type) {
    case "number":
      pattern = "[0-9]+"; // Only allow digits
      break;
    case "email":
      pattern = "^[a-zA-Z0-9]{0,100}@[a-zA-Z0-9]{2,10}.(es|com|org)$"; //TODO fix the email format so it works.
      break;
    case "tel":
      pattern = "[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}"; // Phone number format (XX-XX-XX-XX)
      break;
    case "numberplate":
      pattern = "[a-zA-Z]{2}\\d{2}\\d{3}"; // Numberplate format
      break;
    case "text":
      pattern = ".*"; // Allow any character, any number of times
      break;
    case "license":
      pattern = "[0-9]{8,}";
      break;
    default:
      pattern = ""; // No pattern for "text" type, it allows any input
      break;
  }

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id}>{labelText}</label>
      <input
        className="bg-MainGreen-100 h-10 text-lg p-1 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none"
        id={id}
        type={type}
        required={required}
        value={isValue}
        onChange={(event) => setIsValue(event.target.value)}
        pattern={pattern}
      />
    </div>
  );
};

/* -----Time and date inputfield---------------------------------------------------- */
interface TimeDateProps {
  id: string;
  labelText: string;
  required: boolean;
  timeChange: (Value: string) => void;
  dateChange: (Value: string) => void;
}

export const TimeDateField = ({
  id,
  labelText,
  required,
  timeChange,
  dateChange,
}: TimeDateProps) => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    timeChange(time);
    dateChange(date);
  }, [time, date]);

  return (
    <div className="flex flex-col mb-4">
      <label>{labelText}</label>
      <div id={id} className="flex flex-row">
        <input
          className="bg-MainGreen-100 h-10 mr-5 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none"
          id={"Time" + id}
          type="time"
          value={time}
          required={required}
          onChange={(event) => setTime(event.target.value)}
        />

        <input
          className="bg-MainGreen-100 h-10 rounded-none w-32 border-[1px] focus:border-[3px] border-MainGreen-200 outline-none"
          id={"Date" + id}
          type="date"
          value={date}
          required={required}
          onChange={(event) => setDate(event.target.value)}
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
  onChange: (checked: boolean) => void;
}

export const YesNo = ({ id, labelText, required, onChange }: YesNoProps) => {
  /* 0 is when the checkbox is first initialized and therefor is not filled, 1 is Yes, 2 is No */
  const [checked, setChecked] = useState<0 | 1 | 2>(0);
  const [checkRequired, setCheckRequired] = useState<boolean>();

  useEffect(() => {
    if (required) {
      setCheckRequired(true);
    } else {
      setCheckRequired(false);
    }
  }, []);

  useEffect(() => {
    if (checked === 1) {
      onChange(true);
    } else if (checked === 2) {
      onChange(false);
    }
    if (checked > 0) {
      setCheckRequired(false);
    }
  }, [checked]);

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
          checked={checked === 1}
          required={checkRequired}
          onChange={() => setChecked(1)}
        />

        {/* No  */}
        <label htmlFor={"No" + id} className="ml-4 mr-2">
          No
        </label>
        <input
          className="accent-MainGreen-300 scale-125"
          id={"No" + id}
          type="checkbox"
          checked={checked === 2}
          required={checkRequired}
          onChange={() => setChecked(2)}
        />
      </div>
    </div>
  );
};

/* ----- TextField ---------------------------------------------------- */
interface TextFieldProps {
  id: string;
  maxLength: number;
  labelText: string;
  required: boolean;
  onChange: (value: string) => void;
}

export const TextField = ({
  id,
  maxLength,
  labelText,
  required,
  onChange,
}: TextFieldProps) => {
  const [text, setText] = useState<string>("");
  const [currentLength, setCurrentLength] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    onChange(text);
    setCurrentLength(text.length);
  }, [text]);

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
        value={text}
        onChange={(event) => setText(event.target.value)}
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
  id: string;
  required: boolean;
  labelText: string;
}

/* TODO: make picture upload to server when chosen, if a new picture is chosen the old picture need to get deleted */
export const ImageField = ({ required, id, labelText }: ImageFieldProps) => {
  function handleImageUpload() {
    /*     Upload picture to server */
  }

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id}>{labelText}</label>
      <input
        className=""
        id={id}
        type="file"
        accept="image/*"
        required={required}
        capture="environment"
        onChange={handleImageUpload}
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
