import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import { GetUserPosition, reportDataType } from "@/utils/utils";
import { bikeInformation } from "./opposite_information/bike_information_form";
import { carInformation } from "./opposite_information/car_information_form";
import BikeIcon from '../../public/MapIcons/BikeIcon.png';
import CarIcon from '../../public/MapIcons/CarIcon.png';
import PersonIcon from '../../public/MapIcons/PersonIcon.png';
import ObjectIcon from '../../public/MapIcons/ObjectIcon.png';
import GreenCarIcon from '../../public/MapIcons/GreenCarIcon.png';
import { PedestrianInformation } from "./opposite_information/person_information_form";
import { OtherInformation } from "./opposite_information/other_information_form";


/* Design settings */
const markerSize = {x: 30, z: 50} 


interface GoogleMapsFieldProps {
startPos?: {lat: number | null, lng: number | null};
  startZoom?: number;
  showMap: boolean;

    accidentLocation: {lat: number, lng: number};
    setAccidentLocation: (newAccidentLocation: {lat: number, lng: number}) => void;

  bikes: bikeInformation[];
  setBikes: (newBikes: bikeInformation[]) => void;

  vehicles: carInformation[];
  setVehicles: (newBikes: carInformation[]) => void;

  pedestrians: PedestrianInformation[];
  setPedestrians: (newPedestrians: PedestrianInformation[]) => void;

  objects: OtherInformation[];
  setObjects: (newObjects: OtherInformation[]) => void;
}

const GoogleMapsField = ({showMap, startZoom, startPos, bikes, setBikes, vehicles, setVehicles, pedestrians, setPedestrians, objects, setObjects, accidentLocation, setAccidentLocation}: GoogleMapsFieldProps) => {
  const [mapPos, setMapPos] = useState(startPos || {lat: 0, lng: 0});
  const mapStartZoom = startZoom || 0;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
  })

  useEffect(() => {
    setAccidentLocation(mapPos)
  }, [mapPos])

  const GetUserLocation = async () => {
    const userLocation = await GetUserPosition();
    if (userLocation) {
      setMapPos(userLocation);
    }
  };

  const handleDragEnd = (index:number, position: {lat: number, lng: number}, type: "AccidentLocation" | "Bike" | "Vehicle" | "Pedestrian" | "Object") => {
    switch (type) {
        case "AccidentLocation":
            setAccidentLocation(position);
        case "Bike":
            const updatedBikes = bikes;
            updatedBikes[index].location = position;
            setBikes(updatedBikes);
        case "Vehicle":
            const updatedVehicle = vehicles;
            updatedVehicle[index].location = position;
            setVehicles(updatedVehicle);
        case "Pedestrian":
            const updatedPedestrian = pedestrians;
            updatedPedestrian[index].location = position;
            setPedestrians(updatedPedestrian);
        case "Object": 
            const updatedObjects = objects;
            updatedObjects[index].location = position;
            setObjects(updatedObjects);
    }
  }

  return (
    <div className="w-full h-full">
      {showMap && (
        <div className="w-full h-full">
          {(loadError) ? (
            <p>
              Error loading Google Maps: {`${loadError}`}
            </p>
          ) : (isLoaded) ? (
            <div>
              <GoogleMap
                onLoad={() => GetUserLocation()}
                mapContainerClassName="w-full h-[400px] border-[1px] border-MainGreen-200 rounded-lg"
                zoom={mapStartZoom}
                center={mapPos}
              >
                <Marker
                  position={mapPos} // Replace with the desired lat/lng coordinates
                  draggable={true}
                  icon={{
                    url: GreenCarIcon.src,
                    scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
                  }}
                  onDragEnd={(e) => {
                    if (e.latLng?.lat() && e.latLng?.lng()) {
                        setAccidentLocation({lat: e.latLng.lat(), lng: e.latLng.lng()})
                    }
                }}
                />

                {/* Spawns the amount of bikes thats given by user */}
                {bikes.map((currentBike, index) => (
                  <Marker
                    key={index}
                    position={currentBike.location} 
                    draggable={true}

                    icon={{
                        url: BikeIcon.src,
                        scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
                    }}
                    onDragEnd={(e) => {
                        if (e.latLng?.lat() && e.latLng?.lng()) {
                            handleDragEnd(index, {lat: e.latLng.lat(), lng: e.latLng.lng()}, "Bike")
                        }
                    }}
                  />
                ))}

                {/* Spawns the amount of cars thats given by user */}
                {vehicles.map((currentCar, index) => (
                  <Marker
                    key={index}
                    position={{lat: mapPos.lat+0.0005, lng: mapPos.lng+0.0005}} 
                    draggable={true}
                    icon={{
                        url: CarIcon.src,
                        scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
                    }}
                    onDragEnd={(e) => {
                        if (e.latLng?.lat() && e.latLng?.lng()) {
                            handleDragEnd(index, {lat: e.latLng.lat(), lng: e.latLng.lng()}, "Vehicle")
                        }
                    }}
                  />
                ))}

                {/* Spawns the amount of pedestrians thats given by user */}
                {pedestrians.map((currentPedestrians, index) => (
                  <Marker
                    key={index}
                    position={{lat: mapPos.lat-0.0005, lng: mapPos.lng-0.0005}} 
                    draggable={true}
                    icon={{
                        url: PersonIcon.src,
                        scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
                    }}
                    onDragEnd={(e) => {
                        if (e.latLng?.lat() && e.latLng?.lng()) {
                            handleDragEnd(index, {lat: e.latLng.lat(), lng: e.latLng.lng()}, "Pedestrian")
                        }
                    }}
                  />
                ))}

                {/* Spawns the amount of objects thats given by user */}
                {objects.map((currentObjects, index) => (
                  <Marker
                    key={index}
                    position={{lat: mapPos.lat-0.0005, lng: mapPos.lng-0.0005}} 
                    draggable={true}
                    icon={{
                        url: ObjectIcon.src,
                        scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
                    }}
                    onDragEnd={(e) => {
                        if (e.latLng?.lat() && e.latLng?.lng()) {
                            handleDragEnd(index, {lat: e.latLng.lat(), lng: e.latLng.lng()}, "Object")
                        }
                    }}
                  />
                ))}
              </GoogleMap>
            </div>
          ) : (
            <div>
              <Loading/>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GoogleMapsField;