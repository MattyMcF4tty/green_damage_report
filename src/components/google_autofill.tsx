import React, { useState, useEffect } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

const AddressField: React.FC = () => {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  const [inputValue, setInputValue] = useState<string>(""); // Manage the input value
  const [bgColor, setBgColor] = useState<string>("bg-white"); // Manage the background color

  useEffect(() => {
    if (inputValue === "" || inputValue === null) {
      setBgColor("bg-white");
    } else {
      setBgColor("bg-MainGreen-100");
    }
  }, [inputValue]);

  return (
    <>
      <input
        placeholder="Please enter the location of the accident"
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(evt.target.value); // Update the input value
          getPlacePredictions({ input: evt.target.value });
        }}
        className={`w-full h-10 text-lg p-1 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none ${bgColor}`} // Apply the bgColor class
      />
      {placePredictions.map((item) => (
        <div key={item.place_id}>{item.description}</div>
      ))}
    </>
  );
};

export default AddressField;
