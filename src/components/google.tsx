import React, { useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  Marker,
  LoadScript,
} from "@react-google-maps/api";

const Center = { lat: 55.676098, lng: 12.568337 };
const Zoom = 17;

interface GoogleMapsFieldProps {
  show: boolean;
  showAutocomplete: boolean;
}

const Google = ({ show, showAutocomplete }: GoogleMapsFieldProps) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  const [autocompleteValue, setAutocompleteValue] = useState<string>("");
  const [autocompleteBgColor, setAutocompleteBgColor] =
    useState<string>("bg-white");

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

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setGeocoder(new google.maps.Geocoder());

    const initialMarker = new google.maps.Marker({
      position: Center,
      map: mapInstance,
      draggable: true,
    });

    google.maps.event.addListener(initialMarker, "dragend", function () {
      const newPosition = initialMarker.getPosition();
      mapInstance.panTo(newPosition!);

      // Reverse geocode the new position to get the address
      if (geocoder) {
        geocoder.geocode({ location: newPosition }, function (results, status) {
          if (status === "OK" && results && results.length > 0) {
            setAutocompleteValue(results[0].formatted_address);
          } else if (results && results.length === 0) {
            console.error("No results found");
          } else {
            console.error("Geocoder failed due to: " + status);
          }
        });
      }
    });

    setMarker(initialMarker);
  };

  const handleCurrentLocation = () => {
    // Check if geolocation is supported by the browser
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
          }
          if (marker) {
            marker.setPosition(pos);
          }

          // Use the geocoder to update the address input
          if (geocoder) {
            geocoder.geocode(
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
        },
        (error) => {
          console.warn(`ERROR(${error.code}): ${error.message}`);
        },
        {
          enableHighAccuracy: true, // Get the best possible results
          timeout: 5000, // Maximum time to wait for a position, in ms
          maximumAge: 0, // Accept the last-known cached position up to a specified age in ms.
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <div>
        <button type="button" onClick={handleCurrentLocation}>
          Use My Current Location
        </button>
        {showAutocomplete && (
          <div className="mb-2">
            {/* Container with spacing */}
            <Autocomplete onLoad={setAutocomplete}>
              <input
                type="text"
                placeholder="Enter the location of the incident"
                className={`w-full h-10 text-lg p-1 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none ${autocompleteBgColor}`} // Apply the dynamic background color
                value={autocompleteValue}
                onChange={(e) => setAutocompleteValue(e.target.value)}
              />
            </Autocomplete>
          </div>
        )}

        {show && (
          <div>
            <div className="mb-4">
              <GoogleMap
                onLoad={handleMapLoad}
                center={Center}
                zoom={Zoom}
                mapContainerClassName="w-full h-[400px] border-[1px] border-MainGreen-200 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default Google;
