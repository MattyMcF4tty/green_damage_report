/* import React, { Component } from "react";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface GoogleMapWithAutocompleteProps {}

interface PlaceGeometry {
  location: {
    lat: () => number;
    lng: () => number;
  };
}

interface PlaceResult {
  name: string;
  formatted_address: string;
  geometry: PlaceGeometry;
}

interface GoogleMapWithAutocompleteState {
  selectedPlace: PlaceResult | null;
}

class GoogleMapWithAutocomplete extends Component<
  GoogleMapWithAutocompleteProps,
  GoogleMapWithAutocompleteState
> {
  constructor(props: GoogleMapWithAutocompleteProps) {
    super(props);
    this.state = {
      selectedPlace: null,
    };
  }

  handlePlaceSelect = (place: PlaceResult) => {
    this.setState({ selectedPlace: place });
  };

  render() {
    const { selectedPlace } = this.state;

    return (
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 0, lng: 0 }}
          zoom={8}
        >
          <Autocomplete
            onLoad={(autocomplete) => {
              autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace() as PlaceResult;
                this.handlePlaceSelect(place);
              });
            }}
          >
            <input
              type="text"
              placeholder="Enter a location"
              className="w-full h-4"
            />
          </Autocomplete>

          {selectedPlace && (
            <div>
              <h3>Selected Place:</h3>
              <p>Name: {selectedPlace.name}</p>
              <p>Address: {selectedPlace.formatted_address}</p>
              <p>
                Location: {selectedPlace.geometry.location.lat()},
                {selectedPlace.geometry.location.lng()}
              </p>
            </div>
          )}
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default GoogleMapWithAutocomplete;
 */
