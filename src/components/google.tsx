import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  Marker,
  LoadScript,
} from "@react-google-maps/api";

interface GoogleMapsFieldProps {
  id: string;
  show: boolean;
  showAutocomplete: boolean;
  accidentAddress: string;
  setAccidentAddress: (address: string) => void;
  setAccidentLocation: (location: {
    lat: number | null;
    lng: number | null;
  }) => void;
  accidentLocation: { lat: number | null; lng: number | null };
}

const libraries: "places"[] = ["places"];

const Google = ({
  id,
  show,
  showAutocomplete,
  accidentAddress,
  setAccidentAddress,
  accidentLocation,
  setAccidentLocation,
}: GoogleMapsFieldProps) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 55.676098,
    lng: 12.568337,
  });
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [autocompleteValue, setAutocompleteValue] =
    useState<string>(accidentAddress);
  const [autocompleteBgColor, setAutocompleteBgColor] =
    useState<string>("bg-white");

  const Center = {
    lat: accidentLocation.lat ? accidentLocation.lat : 55.676098,
    lng: accidentLocation.lng ? accidentLocation.lng : 12.568337,
  };
  const Zoom = 17;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    setAccidentAddress(autocompleteValue);
  }, [autocompleteValue]);

  /* Controls autocomplete field background */
  useEffect(() => {
    if (map && autocomplete) {
      autocomplete.bindTo("bounds", map);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.error("No geometry available for selected place.");
          return;
        }

        // Update the map's center to the selected place's geometry
        const location = place.geometry.location;
        if (location && map.panTo) {
          map.panTo(location);
          setMapCenter({
            lat: location.lat(),
            lng: location.lng(),
          });

          // Update the marker's position instead of creating a new one
          if (marker) {
            marker.setPosition(location);
            marker.setTitle(place.name);

            // Since you already have the place's address, you can set it directly
            setAutocompleteValue(place.formatted_address || "");
          }
        }
      });
    }
  }, [map, autocomplete, marker]);
  const handleMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      geocoderRef.current = new google.maps.Geocoder();

      // Only create a new marker if one doesn't already exist
      if (!markerRef.current) {
        markerRef.current = new google.maps.Marker({
          position: Center,
          map: mapInstance,
          draggable: true,
        });

        // Add listeners here...
        google.maps.event.addListener(
          markerRef.current,
          "dragend",
          function () {
            const newPosition = markerRef.current?.getPosition();
            if (newPosition) {
              mapInstance.panTo(newPosition);

              const verifiedPos = {
                lat: newPosition.lat(),
                lng: newPosition.lng(),
              };
              setAccidentLocation(verifiedPos);

              // Reverse geocode the new position to get the address
              if (geocoderRef.current) {
                geocoderRef.current.geocode(
                  { location: newPosition },
                  function (results, status) {
                    if (
                      status === google.maps.GeocoderStatus.OK &&
                      results &&
                      results.length > 0
                    ) {
                      setAutocompleteValue(results[0].formatted_address);
                    } else {
                      console.error(
                        "No results found or Geocoder failed due to:",
                        status
                      );
                    }
                  }
                );
              }
            }
          }
        );
      } else {
        // Re-use the existing marker
        markerRef.current.setMap(mapInstance);
        markerRef.current.setPosition(Center);
      }
    },
    [Center, setAccidentLocation, setAutocompleteValue]
  );
  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Update map center and marker with user's location
          if (map) {
            map.panTo(pos);
            setMapCenter(pos);
          }

          if (markerRef.current) {
            markerRef.current.setPosition(pos);
          }

          setTimeout(() => {
            if (geocoderRef.current) {
              geocoderRef.current.geocode(
                { location: pos },
                (
                  results: google.maps.GeocoderResult[] | null,
                  status: google.maps.GeocoderStatus
                ) => {
                  if (
                    status === google.maps.GeocoderStatus.OK &&
                    results &&
                    results.length > 0
                  ) {
                    setAutocompleteValue(results[0].formatted_address);
                  } else {
                    console.error("Geocoder failed due to: " + status);
                  }
                }
              );
            }
          }, 200);
        },
        (error) => {
          console.warn(`ERROR(${error.code}): ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  };

  if (loadError) {
    return <div>Error loading maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCurrentLocation}
        className=" mb-2 rounded-md p-2 bg-MainGreen-300 text-white"
      >
        Use My Current Location
      </button>
      {showAutocomplete && (
        <div className="mb-2 md:w-[800px]">
          {/* Container with spacing */}
          <Autocomplete onLoad={setAutocomplete}>
            <input
              required={true}
              type="text"
              placeholder="Enter the location of the incident"
              className={`w-full h-10 text-lg p-1 rounded-none border-[1px]  focus:border-[3px] border-MainGreen-200 outline-none ${autocompleteBgColor}`} // Apply the dynamic background color
              value={autocompleteValue}
              onChange={(e) => setAutocompleteValue(e.target.value)}
            />
          </Autocomplete>
        </div>
      )}

      {show && (
        <div>
          <div className="mb-4 ">
            <GoogleMap
              id={"MyGoogleMap"}
              onLoad={handleMapLoad}
              center={mapCenter}
              zoom={Zoom}
              mapContainerClassName="md:w-[800px] w-full h-[400px] border-[1px] border-MainGreen-200 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Google;
