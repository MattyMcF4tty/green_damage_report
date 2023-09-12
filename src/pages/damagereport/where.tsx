import React, { useState } from "react";
import { PedestrianInformation } from "../../components/opposite_information/person_information_form";
import { YesNo } from "../../components/custom_inputfields";
import { carInformation } from "../../components/opposite_information/car_information_form";
import { bikeInformation } from "../../components/opposite_information/bike_information_form";
import { OtherInformation } from "../../components/opposite_information/other_information_form";
import BackButton from "@/components/buttons/back";
import NextButton from "@/components/buttons/next";
import { handleUploadMap, updateData } from "@/firebase/clientApp";
import { GetServerSidePropsContext, NextPage } from "next";
import {
  getServerSidePropsWithRedirect,
  pageProps,
  reportDataType,
} from "@/utils/utils";
import { OtherPartyList } from "@/components/otherPartys/otherPartyList";
import GoogleMapsField, {
  googleIndicator,
} from "@/components/google_maps_field";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getServerSidePropsWithRedirect(context);
};

const WherePage: NextPage<pageProps> = ({ data, id }) => {
  const router = useRouter();
  const serverData = new reportDataType();
  serverData.updateFields(data);
  const [allowClick, setAllowClick] = useState(true);

  /* logic */
  const [otherPartyInvolved, setOtherPartyInvolved] = useState<boolean | null>(
    serverData.otherPartyInvolved
  );
  const [isSingleVehicleChecked, setIsSingleVehicleChecked] = useState<
    boolean | null
  >(serverData.singleVehicleAccident);

  const [indicators, setIndicators] = useState(
    data.googleIndicators.map(
      (info) => new googleIndicator(info.marker1, info.marker2, info.marker3)
    )
  );
  /* Data */
  const [carInfo, setCarInfo] = useState(
    serverData.vehicleInfo.map(
      (info) =>
        new carInformation(
          info.name,
          info.phone,
          info.email,
          info.driversLicenseNumber,
          info.insurance,
          info.numberplate,
          info.model,
          info.location
        )
    )
  );
  const [bikeInfo, setBikeInfo] = useState(
    serverData.bikerInfo.map(
      (info) =>
        new bikeInformation(
          info.name,
          info.phone,
          info.email,
          info.ebike,
          info.personDamage,
          info.location
        )
    )
  );
  const [otherInfo, setOtherInfo] = useState(
    serverData.otherObjectInfo.map(
      (info) =>
        new OtherInformation(info.description, info.information, info.location)
    )
  );
  const [pedestrianInfo, setPedestrianInfo] = useState(
    serverData.pedestrianInfo.map(
      (info) =>
        new PedestrianInformation(
          info.name,
          info.phone,
          info.email,
          info.personDamage,
          info.location
        )
    )
  );
  const [accidentLocation, setAccidentLocation] = useState({
    lat: serverData.accidentLocation.lat,
    lng: serverData.accidentLocation.lng,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    function dataURItoBlob(dataURI: string): Blob {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    }

    const mapField = document.getElementById("MyMap"); // Assuming you give an ID to the map container in GoogleMapsField

    if (mapField) {
      const canvas = await html2canvas(mapField, {
        useCORS: true,
        scale: 17, // Set the zoom level
      });

      const dataUrl = canvas.toDataURL("image/png");
      const mapBlob: Blob = dataURItoBlob(dataUrl);

      // Do something with the dataURL (e.g., save it or send it to the server)
      await handleUploadMap(mapBlob, id);

      // Example: Save the Blob as a file (client-side)
      const a = document.createElement("a");
      a.href = URL.createObjectURL(mapBlob);
      a.download = "map.png";
      a.click();
    }

    /* Data that gets sent to server */
    serverData.updateFields({
      vehicleInfo: carInfo.map((info) => ({
        name: info.name,
        phone: info.phone,
        email: info.email,
        driversLicenseNumber: info.driversLicenseNumber,
        insurance: info.insurance,
        numberplate: info.numberplate,
        model: info.model,
        location: info.location,
      })),
      bikerInfo: bikeInfo.map((info) => ({
        name: info.name,
        phone: info.phone,
        email: info.email,
        ebike: info.ebike,
        personDamage: info.personDamage,
        location: info.location,
      })),
      otherObjectInfo: otherInfo.map((info) => ({
        description: info.description,
        information: info.information,
        location: info.location,
      })),
      pedestrianInfo: pedestrianInfo.map((info) => ({
        name: info.name,
        phone: info.phone,
        email: info.email,
        personDamage: info.personDamage,
        location: info.location,
      })),

      googleIndicators: indicators.map((info) => ({
        marker1: info.marker1,
        marker2: info.marker2,
        marker3: info.marker3,
      })),
      accidentLocation: accidentLocation,

      /* PAGE LOGIC */
      otherPartyInvolved: otherPartyInvolved,
      singleVehicleAccident: isSingleVehicleChecked,
    });

    await updateData(id, serverData);
    router.push(`confirmation?id=${id}`);
  };
  /*   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
   */
  /*     <LoadScript googleMapsApiKey={apiKey || ""} libraries={["places"]}> */

  return (
    <form
      className="flex flex-col items-start w-full h-full"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="w-full ">
        <p className="text-MainGreen-300 mb-8 flex justify-start font-bold text-[20px]">
          Vital Information
        </p>
        <YesNo
          required={true}
          id="collisionWithOtherParty"
          labelText="Collision with another object?"
          value={otherPartyInvolved}
          onChange={setOtherPartyInvolved}
        />
      </div>
      {otherPartyInvolved && (
        <div className="flex flex-col justify-left text-left w-full mb-4">
          <div id="whatvehicle" className="flex flex-col w-full">
            <div>
              <label htmlFor="whatvehicle">Please select the object</label>
            </div>
            <div className="flex flex-row justify-between">
              <OtherPartyList
                bikeValue={bikeInfo}
                setBikeValue={setBikeInfo}
                vehicleValue={carInfo}
                setVehicleValue={setCarInfo}
                pedestrianValue={pedestrianInfo}
                setPedestrianValue={setPedestrianInfo}
                otherInfoValue={otherInfo}
                setOtherInfoValue={setOtherInfo}
              />
            </div>
          </div>
          <div className="my-4">
            <p className="break-words">
              Please indicate on the map where the GreenMobility car was
              located, as well as the location of the other partys, by using the
              markers. Please use the draggable line to mark the car's
              trajectory leading to the collision.

              The green dot indicates the starting point, the yellow dot indicates the move leading to the incident and the red dot indicates the incident.
            </p>
          </div>

          <div className="w-full">
            <GoogleMapsField
              showMap={true}
              startZoom={17}
              startPos={{ lat: 55.68292552469843, lng: 12.585443426890635 }}
              accidentLocation={accidentLocation}
              setAccidentLocation={setAccidentLocation}
              bikes={bikeInfo}
              setBikes={setBikeInfo}
              vehicles={carInfo}
              setVehicles={setCarInfo}
              pedestrians={pedestrianInfo}
              setPedestrians={setPedestrianInfo}
              objects={otherInfo}
              setObjects={setOtherInfo}
              indicators={indicators}
              setIndicators={setIndicators}
            />
          </div>
        </div>
      )}

      {/*       {isCollisionWithObjectChecked && (
        <ObjectInfoForm onchange={setObjectInfo} />
      )} */}

      {/*       <div className="flex flex-col justify-center">
        <YesNo
          required={true}
          id="personDamage"
          labelText="Person damage?"
          value={isPersonDamageChecked}
          onChange={setIsPersonDamageChecked}
        />
      </div>

      {isPersonDamageChecked && (
        <div>
          <TextField
            id="damageDescription"
            maxLength={400}
            labelText="Descripe the damage"
            required={true}
            value={damageDescription}
            onChange={setDamageDescription}
          />
        </div>
      )} */}

      <div className="flex flex-row justify-between w-full mt-4 ">
        <div className="flex flex-row w-16 justify-start h-14 ml-10 lg:w-16">
          <BackButton pageName={`how?id=${id}`} />
        </div>

        <div className="flex flex-row w-16 justify-end h-14 mr-10 lg:w-16">
          <NextButton allowClick={allowClick}/>
        </div>
      </div>
    </form>
  );
};

export default WherePage;
