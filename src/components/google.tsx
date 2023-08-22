/* import React, { useState, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";

const Google: React.FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [marker1, setMarker1] = useState<google.maps.Marker | null>(null);
  const [marker2, setMarker2] = useState<google.maps.Marker | null>(null);

  // Load Google Maps API and initialize Autocomplete and Map
  useEffect(() => {
    (window as any).initMap = () => {}; // Define a dummy initMap function

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.onload = () => {
      const autocompleteInput = document.getElementById(
        "autocomplete-input"
      ) as HTMLInputElement;
      const mapDiv = document.getElementById("map") as HTMLDivElement;

      const autocompleteInstance = new google.maps.places.Autocomplete(
        autocompleteInput
      );
      const mapOptions: google.maps.MapOptions = {
        center: { lat: 55.676098, lng: 12.568337 },
        zoom: 17,
      };
      const mapInstance = new google.maps.Map(mapDiv, mapOptions);

      setAutocomplete(autocompleteInstance);
      setMap(mapInstance);
    };
    document.body.appendChild(script);

    // Note: No need for the cleanup here
  }, []);

  useEffect(() => {
    if (autocomplete && map) {
      // Sync Autocomplete selection with the map
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          map.setCenter(place.geometry.location);

          // Clear existing markers if a different place is selected
          if (selectedPlace && place.place_id !== selectedPlace.place_id) {
            if (marker1) marker1.setMap(null);
            if (marker2) marker2.setMap(null);
          }

          // Update marker positions if they already exist
          if (
            marker1 &&
            marker2 &&
            selectedPlace &&
            place.place_id === selectedPlace.place_id
          ) {
            marker1.setPosition(place.geometry.location);
            marker2.setPosition(place.geometry.location);
          } else {
            // Clear existing markers
            if (marker1) marker1.setMap(null);
            if (marker2) marker2.setMap(null);

            // Create draggable markers
            const newMarker1 = new google.maps.Marker({
              position: place.geometry.location,
              map: map,
              draggable: true,
            });

            const newMarker2 = new google.maps.Marker({
              position: place.geometry.location,
              map: map,
              draggable: true,
            });

            setMarker1(newMarker1);
            setMarker2(newMarker2);
          }

          setSelectedPlace(place);
        }
      });
    }
  }, [autocomplete, map, marker1, marker2, selectedPlace]);

  return (
    <div>

      <label htmlFor="">
        Please enter the location of where the accident occurred
      </label>
      <input
        id="autocomplete-input"
        type="text"
        placeholder="Search for a location"
        className={`w-full h-10 mt-2 text-lg p-1 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none ${
          selectedPlace ? "bg-MainGreen-100" : "bg-white"
        }`}
      />

      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

const GoogleWrapper: React.FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  return (
    <LoadScript googleMapsApiKey={apiKey || ""} libraries={["places"]}>
      <Google />
    </LoadScript>
  );
};

export default GoogleWrapper;
 */
