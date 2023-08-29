import React from "react";
import { useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import ImageUrlRed from "../rødbil.png";
import ImageUrlGreen from "../grønbil.png";
import { start } from "repl";

const Center = { lat: 55.676098, lng: 12.568337 };
const Zoom = 17;

interface GoogleMapsFieldProps {
  show: boolean;
  showAutocomplete: boolean;
}

const Google =({show, showAutocomplete}: GoogleMapsFieldProps) => {
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
  });

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [lines, setLines] = useState<google.maps.Polyline[]>([]);

  const [autocompleteValue, setAutocompleteValue] = useState<string>("");
  const [autocompleteBgColor, setAutocompleteBgColor] = useState<string>("bg-white");

  /* Controls autocomplete field background */
  useEffect(() => {
    if (autocompleteValue === "") {
      setAutocompleteBgColor("bg-white");
    } else {
      setAutocompleteBgColor("bg-MainGreen-100");
    }
  }, [autocompleteValue]);

  /*  */
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

          // Clear existing markers
          markers.forEach((marker) => marker.setMap(null));

          const startLocation = new google.maps.LatLng(
            location.lat() + 0.0001, // Slightly adjust latitude for the second start marker
            location.lng()
          );

          const redIcon = {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Use the red marker icon URL
            scaledSize: new google.maps.Size(32, 32),
          };

          const greenIcon = {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Use the green marker icon URL
            scaledSize: new google.maps.Size(32, 32),
          };

          const redMarker = new google.maps.Marker({
            position: startLocation,
            map: map,
            title: place.name,
            draggable: true,
            icon: redIcon,
          });

          const greenMarker = new google.maps.Marker({
            position: location,
            map: map,
            title: place.name,
            draggable: true,
            icon: greenIcon,
          });

          setMarkers([redMarker, greenMarker]);
        }
      });
    }
  }, [map, autocomplete]);

  const calculateMiddlePosition = (
    start: google.maps.LatLng,
    end: google.maps.LatLng
  ): google.maps.LatLng => {
    return new google.maps.LatLng(
      (start.lat() + end.lat()) / 2,
      (start.lng() + end.lng()) / 2
    );
  };

  const addDraggableLine = () => {
    if (map) {
      const center = map.getCenter();
      if (!center) {
        return;
      }

      const position = new google.maps.LatLng(center.lat(), center.lng());

      const startPosition = new google.maps.LatLng(
        position.lat() + 0.00005, // Slightly adjust latitude for the second start marker
        position.lng()
      );

      const startMarker = new google.maps.Marker({
        position: position,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "green",
          fillOpacity: 1,
          strokeWeight: 0,
        },
        draggable: true,
      });

      const endMarker = new google.maps.Marker({
        position: startPosition,
        map: map,

        draggable: true,
      });

      const middleMarkerPosition = calculateMiddlePosition(
        startMarker.getPosition()!,
        endMarker.getPosition()!
      );

      const middleMarker = new google.maps.Marker({
        position: middleMarkerPosition,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "yellow",
          fillOpacity: 1,
          strokeWeight: 0,
        },
        draggable: true,
        zIndex: 2,
      });

      const line = new google.maps.Polyline({
        path: [
          startMarker.getPosition()!,
          middleMarker.getPosition()!,
          endMarker.getPosition()!,
        ],
        map: map,
      });

      startMarker.addListener("drag", () => {
        const startMarkerPosition = startMarker.getPosition();
        const endMarkerPosition = endMarker.getPosition();
        if (startMarkerPosition && endMarkerPosition) {
          line.setPath([
            startMarkerPosition,
            middleMarker.getPosition()!,
            endMarkerPosition,
          ]);
          const newMiddleMarkerPosition = calculateMiddlePosition(
            startMarkerPosition,
            endMarkerPosition
          );
          middleMarker.setPosition(newMiddleMarkerPosition);
        }
      });

      endMarker.addListener("drag", () => {
        const startMarkerPosition = startMarker.getPosition();
        const endMarkerPosition = endMarker.getPosition();
        if (startMarkerPosition && endMarkerPosition) {
          line.setPath([
            startMarkerPosition,
            middleMarker.getPosition()!,
            endMarkerPosition,
          ]);
          const newMiddleMarkerPosition = calculateMiddlePosition(
            startMarkerPosition,
            endMarkerPosition
          );
          middleMarker.setPosition(newMiddleMarkerPosition);
        }
      });

      middleMarker.addListener("drag", () => {
        const startMarkerPosition = startMarker.getPosition();
        const endMarkerPosition = endMarker.getPosition();
        if (startMarkerPosition && endMarkerPosition) {
          const middlePosition =
            middleMarker.getPosition() as google.maps.LatLng;
          line.setPath([
            startMarkerPosition,
            middlePosition,
            endMarkerPosition,
          ]);
        }
      });

      setMarkers((prevMarkers) => [
        ...prevMarkers,
        startMarker,
        middleMarker,
        endMarker,
      ]);
      setLines((prevLines) => [...prevLines, line]);
    }
  };

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div>
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
          <button
            className="add-line-button border-[1px] border-MainGreen-200 rounded-md mb-2 bg-MainGreen-100 w-1/2"
            onClick={addDraggableLine}
            type="button"
          >
            Add Draggable Line
          </button>

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
  );
}

export default Google;
