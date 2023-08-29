import { GoogleMap, InfoWindow, MarkerF, Polyline, useJsApiLoader } from "@react-google-maps/api";
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
  const arraysLenght = bikes.length;
  const [markers, setMarkers] = useState<Record<string, google.maps.Marker[]>>({
    Bike: [],
    Vehicle: [],
    Pedestrian: [],
    Object: [],
  });  
  const [map, setMap] = useState<google.maps.Map | null>(null);

  /* Load Google maps javascript api */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
  })

  /* Load previos location or where user is now */
  useEffect(() => {
    if (accidentLocation.lat !== null && accidentLocation.lng !== null) {
      console.log("Accident", accidentLocation)
      console.log("Startpos", startPos)
      setMapPos({lat: accidentLocation.lat, lng: accidentLocation.lng});
    }  else {  
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


  const SpawnBike = (index: number, nameWindow: google.maps.InfoWindow) => {

    const newBikes = bikes

    const bike = bikes[index]
    const bikeMarker = new google.maps.Marker({
      position: {
        lat: bike.location.lat !== null ? bike.location.lat : mapPos.lat,
        lng: bike.location.lng !== null ? bike.location.lng : mapPos.lng - 0.0005,
      },
      map: map,
      icon: {
        url: BikeIcon.src,
        scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
      },
      draggable: true,
    });

    bikeMarker.addListener("dragend", () => {
      const markerPos = bikeMarker.getPosition();
      const bikePos = {
        lat: markerPos ? markerPos.lat() : bikes[index].location.lat,
        lng: markerPos ? markerPos.lng() : bikes[index].location.lng,
      };
      newBikes[index].location = bikePos;
      setBikes(newBikes)
      nameWindow.close();
    });

    bikeMarker.addListener("drag", () => {
      nameWindow.setContent(`${bike.name}`)
      nameWindow.open(map, bikeMarker)
    })

    return(bikeMarker)
  }


  const SpawnVehicle = (index: number, nameWindow: google.maps.InfoWindow) => {

    const newVehicles = vehicles

    const vehicle = vehicles[index]
    const vehicleMarker = new google.maps.Marker({
      position: {
        lat: vehicle.location.lat !== null ? vehicle.location.lat : mapPos.lat,
        lng: vehicle.location.lng !== null ? vehicle.location.lng : mapPos.lng + 0.0005,
      },
      map: map,
      icon: {
        url: CarIcon.src,
        scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
      },
      draggable: true,
    });

    vehicleMarker.addListener("dragend", () => {
      const markerPos = vehicleMarker.getPosition();
      const vehiclePos = {
        lat: markerPos ? markerPos.lat() : vehicles[index].location.lat,
        lng: markerPos ? markerPos.lng() : vehicles[index].location.lng,
      };
      newVehicles[index].location = vehiclePos;
      setVehicles(newVehicles)
      nameWindow.close();
    });

    vehicleMarker.addListener("drag", () => {
      nameWindow.setContent(`${vehicle.name}`)
      nameWindow.open(map, vehicleMarker)
    })

    return(vehicleMarker)
  }

  const SpawnPedestrian = (index: number, nameWindow: google.maps.InfoWindow) => {

    const newPedestrians = pedestrians

    const pedestrian = pedestrians[index]
    const pedestrianMarker = new google.maps.Marker({
      position: {
        lat: pedestrian.location.lat !== null ? pedestrian.location.lat : mapPos.lat - 0.0005,
        lng: pedestrian.location.lng !== null ? pedestrian.location.lng : mapPos.lng,
      },
      map: map,
      icon: {
        url: PersonIcon.src,
        scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
      },
      draggable: true,
    });

    pedestrianMarker.addListener("dragend", () => {
      const markerPos = pedestrianMarker.getPosition();
      const vehiclePos = {
        lat: markerPos ? markerPos.lat() : pedestrians[index].location.lat,
        lng: markerPos ? markerPos.lng() : pedestrians[index].location.lng,
      };
      newPedestrians[index].location = vehiclePos;
      setPedestrians(newPedestrians)
      nameWindow.close();
    });

    pedestrianMarker.addListener("drag", () => {
      nameWindow.setContent(`${pedestrian.name}`)
      nameWindow.open(map, pedestrianMarker)
    })

    return(pedestrianMarker)
  }

  const SpawnObject = (index: number, nameWindow: google.maps.InfoWindow) => {

    const newObjects = objects

    const object = objects[index]
    const objectMarker = new google.maps.Marker({
      position: {
        lat: object.location.lat !== null ? object.location.lat : mapPos.lat + 0.0005,
        lng: object.location.lng !== null ? object.location.lng : mapPos.lng,
      },
      map: map,
      icon: {
        url: ObjectIcon.src,
        scaledSize: new window.google.maps.Size(markerSize.x, markerSize.z),
      },
      draggable: true,
    });

    objectMarker.addListener("dragend", () => {
      const markerPos = objectMarker.getPosition();
      const vehiclePos = {
        lat: markerPos ? markerPos.lat() : objects[index].location.lat,
        lng: markerPos ? markerPos.lng() : objects[index].location.lng,
      };
      newObjects[index].location = vehiclePos;
      setObjects(newObjects)
      nameWindow.close();
    });

    objectMarker.addListener("drag", () => {
      nameWindow.setContent(`${object.description}`)
      nameWindow.open(map, objectMarker)
    })

    
    return(objectMarker)
  }

  /* Update markers */
  useEffect(() => {
    if (map) {
      const nameWindow = new google.maps.InfoWindow();

      /* update bikes */
      markers.Bike.forEach((bikeMarker) => {bikeMarker.setMap(null)});
      const newBikes: google.maps.Marker[] = [];
      bikes.map((bike, index) => {
        newBikes.push(SpawnBike(index, nameWindow));
      });
      setMarkers((prevMarkers) => ({...prevMarkers, Bike: newBikes}));

      markers.Vehicle.forEach((vehicleMarker) => {vehicleMarker.setMap(null)});
      const newVehicles: google.maps.Marker[] = [];
      vehicles.map((vehicle, index) => {
        newVehicles.push(SpawnVehicle(index, nameWindow));
      });
      setMarkers((prevMarkers) => ({...prevMarkers, Vehicle: newVehicles}));

      markers.Pedestrian.forEach((pedestrianMarker) => {pedestrianMarker.setMap(null)});
      const newPedestrians: google.maps.Marker[] = [];
      pedestrians.map((pedestrian, index) => {
        newPedestrians.push(SpawnPedestrian(index, nameWindow));
      });
      setMarkers((prevMarkers) => ({...prevMarkers, Pedestrian: newPedestrians}));

      markers.Object.forEach((objectMarker) => {objectMarker.setMap(null)});
      const newObjects: google.maps.Marker[] = [];
      objects.map((object, index) => {
        newObjects.push(SpawnObject(index, nameWindow));
      });
      setMarkers((prevMarkers) => ({...prevMarkers, Object: newObjects}));
    }
  }, [map, bikes.length, vehicles.length, pedestrians.length, objects.length]);


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
                onLoad={setMap}
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
                    const newPos = {lat: e.latLng?.lat(), lng: e.latLng?.lng()}
                    console.log(newPos);
                    if (newPos.lat && newPos.lng) {
                      console.log("updated");
                      setMapPos({lat: newPos.lat, lng: newPos.lng})
                      setAccidentLocation({lat: newPos.lat, lng: newPos.lng})
                    }
                  }}
                />
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