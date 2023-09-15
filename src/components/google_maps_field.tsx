import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useState, useRef } from "react";
import Loading from "./loading";
import { GetUserPosition, reportDataType } from "@/utils/utils";
import { bikeInformation } from "./opposite_information/bike_information_form";
import { carInformation } from "./opposite_information/car_information_form";
import BikeIcon from "../../public/MapIcons/BikeIcon.png";
import CarIcon from "../../public/MapIcons/CarIcon.png";
import PersonIcon from "../../public/MapIcons/PersonIcon.png";
import ObjectIcon from "../../public/MapIcons/ObjectIcon.png";
import GreenCarIcon from "../../public/MapIcons/GreenCarIcon.png";
import { PedestrianInformation } from "./opposite_information/person_information_form";
import { OtherInformation } from "./opposite_information/other_information_form";
import html2canvas from "html2canvas";
/* Design settings */
const markerSize = { x: 30, z: 50 };

export class googleIndicator {
  marker1: { lat: number | null; lng: number | null };
  marker2: { lat: number | null; lng: number | null };
  marker3: { lat: number | null; lng: number | null };

  constructor(
    marker1: { lat: number | null; lng: number | null },
    marker2: { lat: number | null; lng: number | null },
    marker3: { lat: number | null; lng: number | null }
  ) {
    this.marker1 = marker1;
    this.marker2 = marker2;
    this.marker3 = marker3;
  }
  updateFields(fields: Partial<googleIndicator>) {
    Object.assign(this, fields);
  }

  toPlainObject() {
    return {
      marker1: this.marker1,
      marker2: this.marker2,
      marker3: this.marker3,
    };
  }
}

interface GoogleMapsFieldProps {
  startPos: { lat: number; lng: number };
  startZoom?: number;
  showMap: boolean;

  accidentLocation: { lat: number | null; lng: number | null };
  setAccidentLocation: (newAccidentLocation: {
    lat: number;
    lng: number;
  }) => void;

  bikes: bikeInformation[];
  setBikes: (
    newBikes:
      | bikeInformation[]
      | ((prevBikes: bikeInformation[]) => bikeInformation[])
  ) => void;

  vehicles: carInformation[];
  setVehicles: (
    newVehicles:
      | carInformation[]
      | ((prevVehicles: carInformation[]) => carInformation[])
  ) => void;

  pedestrians: PedestrianInformation[];
  setPedestrians: (
    newPedestrians:
      | PedestrianInformation[]
      | ((prevPedestrians: PedestrianInformation[]) => PedestrianInformation[])
  ) => void;

  objects: OtherInformation[];
  setObjects: (
    newObjects:
      | OtherInformation[]
      | ((prevObject: OtherInformation[]) => OtherInformation[])
  ) => void;

  indicators: googleIndicator[];
  setIndicators: (
    indicators:
      | googleIndicator[]
      | ((prevIndicator: googleIndicator[]) => googleIndicator[])
  ) => void;
}

const GoogleMapsField = ({
  showMap,
  startZoom,
  startPos,
  bikes,
  setBikes,
  vehicles,
  setVehicles,
  pedestrians,
  setPedestrians,
  objects,
  setObjects,
  accidentLocation,
  setAccidentLocation,
  indicators,
  setIndicators,
}: GoogleMapsFieldProps) => {
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
  const [lineMarkers, setLineMarkers] = useState<google.maps.Marker[]>([]);
  const [lines, setLines] = useState<google.maps.Polyline[]>([]);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(
    null
  );

  const clearAllLinesAndMarkers = () => {
    lineMarkers.forEach((marker) => marker.setMap(null)); // Remove marker from map
    lines.forEach((line) => line.setMap(null)); // Remove line from map
    setLineMarkers([]);
    setLines([]);
  };

  useEffect(() => {
    if (map) {
      clearAllLinesAndMarkers(); // Clear existing lines and markers
      indicators.forEach((marker) =>
        createLineWithoutUpdatingIndicators(marker)
      );
    }
  }, [map]);

  const updateIndicatorsState = (newIndicators: googleIndicator[]) => {
    setIndicators(newIndicators);
  };
  const calculateMiddlePosition = (
    start: google.maps.LatLng,
    end: google.maps.LatLng
  ): google.maps.LatLng => {
    return new google.maps.LatLng(
      (start.lat() + end.lat()) / 2,
      (start.lng() + end.lng()) / 2
    );
  };

  const createLineWithoutUpdatingIndicators = (markers: googleIndicator) => {
    addDraggableLine(markers, false);
  };

  const addDraggableLine = (markers: googleIndicator, isNewLine: boolean) => {
    if (map) {
      const center = map.getCenter();
      if (!center) {
        return;
      }

      const position = new google.maps.LatLng(center.lat(), center.lng());

      // Define initial positions based on passed `markers` or `position`
      const initialPositions = {
        start: {
          lat: markers.marker1.lat || position.lat(),
          lng: markers.marker1.lng || position.lng(),
        },
        middle: {
          lat: markers.marker2.lat || position.lat(),
          lng: markers.marker2.lng || position.lng(),
        },
        end: {
          lat: markers.marker3.lat || position.lat(),
          lng: markers.marker3.lng || position.lng(),
        },
      };

      // Create the markers
      const startMarker = new google.maps.Marker({
        position: initialPositions.start,
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
        position: initialPositions.end,
        map: map,
        draggable: true,
      });

      const middleMarker = new google.maps.Marker({
        position: initialPositions.middle,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "yellow",
          fillOpacity: 1,
          strokeWeight: 0,
        },
        draggable: true,
      });

      // Create the line
      const line = new google.maps.Polyline({
        path: [
          startMarker.getPosition()!,
          middleMarker.getPosition()!,
          endMarker.getPosition()!,
        ],
        map: map,
      });

      // Attach event listeners for dragging
      const updateLineAndMiddle = () => {
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
      };

      startMarker.addListener("drag", updateLineAndMiddle);
      endMarker.addListener("drag", updateLineAndMiddle);

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
      // Function to update markers after dragend
      const updateMarkerPositions = () => {
        const startMarkerPosition = startMarker.getPosition();
        const middleMarkerPosition = middleMarker.getPosition();
        const endMarkerPosition = endMarker.getPosition();

        if (startMarkerPosition && middleMarkerPosition && endMarkerPosition) {
          const newIndicator = new googleIndicator(
            {
              lat: startMarkerPosition.lat(),
              lng: startMarkerPosition.lng(),
            },
            {
              lat: middleMarkerPosition.lat(),
              lng: middleMarkerPosition.lng(),
            },
            {
              lat: endMarkerPosition.lat(),
              lng: endMarkerPosition.lng(),
            }
          );

          if (isNewLine) {
            // Add new line to the state
            setIndicators([...indicators, newIndicator]);
          } else {
            // Find and update the corresponding line in the state
            const indexToUpdate = indicators.findIndex((indicator) => {
              // Compare using some logic to find the corresponding line (e.g. by positions)
              // Modify this as per your needs
              return JSON.stringify(indicator) === JSON.stringify(markers);
            });
            if (indexToUpdate !== -1) {
              const updatedIndicators = [...indicators];
              updatedIndicators[indexToUpdate] = newIndicator;
              setIndicators(updatedIndicators);
            }
          }
        }
      };
      // Attach dragend event listeners
      startMarker.addListener("dragend", updateMarkerPositions);
      middleMarker.addListener("dragend", updateMarkerPositions);
      endMarker.addListener("dragend", updateMarkerPositions);

      // Conditionally call updateMarkerPositions
      if (!isNewLine) {
        updateMarkerPositions();
      } else {
        // Update existing line and markers
        startMarker.setPosition(
          new google.maps.LatLng(
            initialPositions.start.lat,
            initialPositions.start.lng
          )
        );
        middleMarker.setPosition(
          new google.maps.LatLng(
            initialPositions.middle.lat,
            initialPositions.middle.lng
          )
        );
        endMarker.setPosition(
          new google.maps.LatLng(
            initialPositions.end.lat,
            initialPositions.end.lng
          )
        );
        line.setPath([
          startMarker.getPosition()!,
          middleMarker.getPosition()!,
          endMarker.getPosition()!,
        ]);
        updateMarkerPositions();
      }

      middleMarker.addListener("click", () => {
        const index = indicators.findIndex((indicators) => {
          return JSON.stringify(indicators) === JSON.stringify(markers);
        });
        setSelectedLineIndex(index);
      });

      // Update line markers
      setLineMarkers((prevMarkers) => [
        ...prevMarkers,
        startMarker,
        middleMarker,
        endMarker,
      ]);

      // Update lines
      setLines((prevLines) => [...prevLines, line]);
    }
  };

  const deleteLine = (index: number) => {
    // Delete the line and markers from the map
    const startMarker = lineMarkers[index * 3];
    const middleMarker = lineMarkers[index * 3 + 1];
    const endMarker = lineMarkers[index * 3 + 2];

    startMarker.setMap(null);
    middleMarker.setMap(null);
    endMarker.setMap(null);
    lines[index].setMap(null);

    // Update the lineMarkers and lines state
    const updatedLineMarkers = [...lineMarkers];
    updatedLineMarkers.splice(index * 3, 3);
    setLineMarkers(updatedLineMarkers);

    const updatedLines = [...lines];
    updatedLines.splice(index, 1);
    setLines(updatedLines);

    // Update the indicators state
    const updatedIndicators = [...indicators];
    updatedIndicators.splice(index, 1);
    setIndicators(updatedIndicators);
    google.maps.event.clearListeners(updatedLineMarkers, "click");

    // Close the InfoWindow
    setSelectedLineIndex(null);
  };

  /* Load Google maps javascript api */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  /* Load previos location or where user is now */
  useEffect(() => {
    if (accidentLocation.lat !== null && accidentLocation.lng !== null) {
      console.log("Accident", accidentLocation);
      console.log("Startpos", startPos);
      setMapPos({ lat: accidentLocation.lat, lng: accidentLocation.lng });
    } else {
      GetUserLocation();
    }
  }, []);

  const GetUserLocation = async () => {
    const userLocation = await GetUserPosition();
    if (userLocation) {
      setMapPos(userLocation);
    }
  };

  useEffect(() => {
    setAccidentLocation(mapPos);
  }, [mapPos]);

  const SpawnBike = (index: number, nameWindow: google.maps.InfoWindow) => {
    const newBikes = bikes;

    const bike = bikes[index];
    const bikeMarker = new google.maps.Marker({
      position: {
        lat: bike.location.lat !== null ? bike.location.lat : mapPos.lat,
        lng:
          bike.location.lng !== null ? bike.location.lng : mapPos.lng - 0.0005,
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

      setBikes((prevBikes: bikeInformation[]) => {
        const updatedBikes = [...prevBikes];
        if (updatedBikes[index]) {
          updatedBikes[index].location = bikePos;
        } else {
          console.warn(
            `Bike at index ${index} does not exist in updatedBikes.`
          );
        }
        return updatedBikes;
      });

      nameWindow.close();
    });

    bikeMarker.addListener("drag", () => {
      nameWindow.setContent(`${bike.name}`);
      nameWindow.open(map, bikeMarker);
    });

    return bikeMarker;
  };

  const SpawnVehicle = (index: number, nameWindow: google.maps.InfoWindow) => {
    const newVehicles = vehicles;

    const vehicle = vehicles[index];
    const vehicleMarker = new google.maps.Marker({
      position: {
        lat: vehicle.location.lat !== null ? vehicle.location.lat : mapPos.lat,
        lng:
          vehicle.location.lng !== null
            ? vehicle.location.lng
            : mapPos.lng + 0.0005,
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

      setVehicles((prevVehicles: carInformation[]) => {
        const updatedVehicles = [...prevVehicles];
        if (updatedVehicles[index]) {
          updatedVehicles[index].location = vehiclePos;
        } else {
          console.warn(
            `Vehicle at index ${index} does not exist in updatedVehicle.`
          );
        }
        return updatedVehicles;
      });

      nameWindow.close();
    });
    vehicleMarker.addListener("drag", () => {
      nameWindow.setContent(`${vehicle.name}`);
      nameWindow.open(map, vehicleMarker);
    });

    return vehicleMarker;
  };

  const SpawnPedestrian = (
    index: number,
    nameWindow: google.maps.InfoWindow
  ) => {
    const newPedestrians = pedestrians;

    const pedestrian = pedestrians[index];
    const pedestrianMarker = new google.maps.Marker({
      position: {
        lat:
          pedestrian.location.lat !== null
            ? pedestrian.location.lat
            : mapPos.lat - 0.0005,
        lng:
          pedestrian.location.lng !== null
            ? pedestrian.location.lng
            : mapPos.lng,
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
      const PedestrianPos = {
        lat: markerPos ? markerPos.lat() : pedestrians[index].location.lat,
        lng: markerPos ? markerPos.lng() : pedestrians[index].location.lng,
      };

      setPedestrians((prevPedestrians: PedestrianInformation[]) => {
        const updatedPedestrian = [...prevPedestrians];
        if (updatedPedestrian[index]) {
          updatedPedestrian[index].location = PedestrianPos;
        } else {
          console.warn(
            `Pedestrian at index ${index} does not exist in  updatedPedestrian.`
          );
        }
        return updatedPedestrian;
      });

      nameWindow.close();
    });

    pedestrianMarker.addListener("drag", () => {
      nameWindow.setContent(`${pedestrian.name}`);
      nameWindow.open(map, pedestrianMarker);
    });

    return pedestrianMarker;
  };

  const SpawnObject = (index: number, nameWindow: google.maps.InfoWindow) => {
    const newObjects = objects;

    const object = objects[index];
    const objectMarker = new google.maps.Marker({
      position: {
        lat:
          object.location.lat !== null
            ? object.location.lat
            : mapPos.lat + 0.0005,
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
      const objectPos = {
        lat: markerPos ? markerPos.lat() : objects[index].location.lat,
        lng: markerPos ? markerPos.lng() : objects[index].location.lng,
      };

      setObjects((prevObject: OtherInformation[]) => {
        const updatedObject = [...prevObject];
        if (updatedObject[index]) {
          updatedObject[index].location = objectPos;
        } else {
          console.warn(
            `Object at index ${index} does not exist in  updatedObject.`
          );
        }
        return updatedObject;
      });

      nameWindow.close();
    });

    objectMarker.addListener("drag", () => {
      nameWindow.setContent(`${object.description}`);
      nameWindow.open(map, objectMarker);
    });

    return objectMarker;
  };

  /* Update markers */
  useEffect(() => {
    if (map) {
      const nameWindow = new google.maps.InfoWindow();

      /* update bikes */
      markers.Bike.forEach((bikeMarker) => {
        bikeMarker.setMap(null);
      });
      const newBikes: google.maps.Marker[] = [];
      bikes.map((bike, index) => {
        newBikes.push(SpawnBike(index, nameWindow));
      });
      setMarkers((prevMarkers) => ({ ...prevMarkers, Bike: newBikes }));

      markers.Vehicle.forEach((vehicleMarker) => {
        vehicleMarker.setMap(null);
      });
      const newVehicles: google.maps.Marker[] = [];
      vehicles.map((vehicle, index) => {
        newVehicles.push(SpawnVehicle(index, nameWindow));
      });
      setMarkers((prevMarkers) => ({ ...prevMarkers, Vehicle: newVehicles }));

      markers.Pedestrian.forEach((pedestrianMarker) => {
        pedestrianMarker.setMap(null);
      });
      const newPedestrians: google.maps.Marker[] = [];
      pedestrians.map((pedestrian, index) => {
        newPedestrians.push(SpawnPedestrian(index, nameWindow));
      });
      setMarkers((prevMarkers) => ({
        ...prevMarkers,
        Pedestrian: newPedestrians,
      }));

      markers.Object.forEach((objectMarker) => {
        objectMarker.setMap(null);
      });
      const newObjects: google.maps.Marker[] = [];
      objects.map((object, index) => {
        newObjects.push(SpawnObject(index, nameWindow));
      });
      setMarkers((prevMarkers) => ({ ...prevMarkers, Object: newObjects }));
    }
  }, [map, bikes.length, vehicles.length, pedestrians.length, objects.length]);

  return (
    <div className="w-full h-full">
      <button
        className="add-line-button border-[1px] border-MainGreen-200 rounded-md mb-2 bg-MainGreen-100 w-1/2"
        onClick={() =>
          addDraggableLine(
            new googleIndicator(
              { lat: null, lng: null }, // Or default coordinates
              { lat: null, lng: null }, // Or default coordinates
              { lat: null, lng: null } // Or default coordinates
            ),
            true // isNewLine is true
          )
        }
        type="button"
      >
        Add Draggable Line
      </button>

      {showMap && (
        <div className="w-full h-full">
          {loadError ? (
            <p>Error loading Google Maps: {`${loadError}`}</p>
          ) : isLoaded ? (
            <div>
              <GoogleMap
                id="MyMap"
                mapContainerClassName="w-full h-[400px] border-[1px] border-MainGreen-200 rounded-lg"
                zoom={startZoom}
                center={mapPos}
                onLoad={setMap}
                options={{
                  fullscreenControl: false,
                  streetViewControl: false,
                }}
              >
                {selectedLineIndex !== null &&
                  selectedLineIndex < indicators.length &&
                  indicators[selectedLineIndex]?.marker2 && (
                    <InfoWindow
                      position={{
                        lat: indicators[selectedLineIndex].marker2.lat!,
                        lng: indicators[selectedLineIndex].marker2.lng!,
                      }}
                      onCloseClick={() => setSelectedLineIndex(null)}
                    >
                      <button onClick={() => deleteLine(selectedLineIndex)}>
                        Delete
                      </button>
                    </InfoWindow>
                  )}
                <MarkerF
                  position={mapPos}
                  draggable={true}
                  icon={{
                    url: GreenCarIcon.src,
                    scaledSize: new window.google.maps.Size(50, 60),
                  }}
                  onDragEnd={(e) => {
                    const newPos = {
                      lat: e.latLng?.lat(),
                      lng: e.latLng?.lng(),
                    };
                    console.log(newPos);
                    if (newPos.lat && newPos.lng) {
                      console.log("updated");
                      setMapPos({ lat: newPos.lat, lng: newPos.lng });
                      setAccidentLocation({ lat: newPos.lat, lng: newPos.lng });
                    }
                  }}
                />
              </GoogleMap>
            </div>
          ) : (
            <div>
              <Loading />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleMapsField;
