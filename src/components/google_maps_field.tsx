import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
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
  startPos: {lat: number, lng: number};
  startZoom?: number;
  showMap: boolean;

  accidentLocation: {lat: number | null, lng: number | null};
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
  const [mapPos, setMapPos] = useState(startPos);
  const mapStartZoom = startZoom || 0;
  /* Load Google maps javascript api */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
  })

  /* Load previos location or where user is now */
  useEffect(() => {
    if (accidentLocation.lat !== null && accidentLocation.lng !== null) {
      setMapPos({lat: accidentLocation.lat, lng: accidentLocation.lng});
    } else {  
      GetUserLocation()
    }
  }, [])
  const GetUserLocation = async () => {
      const userLocation = await GetUserPosition();
      if (userLocation) {
        setMapPos(userLocation);
      }
  };

  useEffect(() => {
    setAccidentLocation(mapPos)
  }, [mapPos])

  const handleDragEnd = (index:number, position: {lat: number, lng: number}, type: "AccidentLocation" | "Bike" | "Vehicle" | "Pedestrian" | "Object") => {
    switch (type) {
        case "AccidentLocation":
          setAccidentLocation(position);
          break;
        case "Bike":
          const updatedBikes = bikes;
          updatedBikes[index].location = position;
          setBikes(updatedBikes);
          break;
        case "Vehicle":
          const updatedVehicle = vehicles;
          updatedVehicle[index].location = position;
          setVehicles(updatedVehicle);
          break;
        case "Pedestrian":
          const updatedPedestrian = pedestrians;
          updatedPedestrian[index].location = position;
          setPedestrians(updatedPedestrian);
          break;
        case "Object": 
          const updatedObjects = objects;
          updatedObjects[index].location = position;
          setObjects(updatedObjects);
          break;
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
                mapContainerClassName="w-full h-[400px] border-[1px] border-MainGreen-200 rounded-lg"
                zoom={startZoom}
                center={mapPos}
                options={{
                  fullscreenControl: false,
                  streetViewControl: false,
                }} 
              >
                <MarkerF
                  position={(mapPos)}
                  draggable={true}
                  icon={{
                    url: GreenCarIcon.src,
                    scaledSize: new window.google.maps.Size(50, 60),
                  }}
                  onDragEnd={(e) => {
                    if (e.latLng?.lat() && e.latLng?.lng()) {
                      setMapPos({lat: e.latLng.lat(), lng: e.latLng.lng()})
                    }
                  }}
                />
                {/* Spawns the amount of bikes thats given by user */}
                {bikes.map((currentBike, index) => (
                  <MarkerF
                    key={index}
                    position={
                      currentBike.location.lat !== null && currentBike.location.lng !== null
                      ? {lat: currentBike.location.lat, lng: currentBike.location.lng}
                      : { lat: mapPos.lat, lng: mapPos.lng - 0.0005 }
                    } 
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
                  <MarkerF
                    key={index}
                    position={
                      currentCar.location.lat !== null && currentCar.location.lng !== null
                      ? {lat: currentCar.location.lat, lng: currentCar.location.lng}
                      : { lat: mapPos.lat, lng: mapPos.lng + 0.0005 }
                    }                     
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
                  <MarkerF
                    key={index}
                    position={
                      currentPedestrians.location.lat !== null && currentPedestrians.location.lng !== null
                      ? {lat: currentPedestrians.location.lat, lng: currentPedestrians.location.lng}
                      : { lat: mapPos.lat - 0.00025, lng: mapPos.lng}
                    } 
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
                  <MarkerF
                    key={index}
                    position={
                      currentObjects.location.lat !== null && currentObjects.location.lng !== null
                      ? {lat: currentObjects.location.lat, lng: currentObjects.location.lng}
                      : { lat: mapPos.lat + 0.00025, lng: mapPos.lng}
                    } 
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