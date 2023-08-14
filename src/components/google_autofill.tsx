import React, { useState, useEffect } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

interface AddressFieldProps {
  labelText: string; // Add labelText prop
}

declare global {
  interface Window {
    google: any;
  }
}

const AddressField: React.FC<AddressFieldProps> = ({ labelText }) => {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>("bg-white");

  useEffect(() => {
    if (inputValue === "" || inputValue === null) {
      setBgColor("bg-white");
    } else {
      setBgColor("bg-MainGreen-100");
    }
  }, [inputValue]);

  const handlePlaceSelect = (place: any) => {
    setInputValue(place.description);
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
        // Access other details from the result object
      } else {
        console.error("Error fetching place details:", status);
      }
    });
  };

  return (
    <>
      <div className="mb-4">
        <label className="mb-2 block">{labelText}</label>
        <input
          value={inputValue}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(evt.target.value);
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
    </>
  );
};

export default AddressField;
