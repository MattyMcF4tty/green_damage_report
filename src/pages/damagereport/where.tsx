import React, { use, useEffect, useState } from "react";
import { PedestrianInformation } from "../../components/opposite_information/person_information_form";
import {
  ImageField,
  TextField,
  YesNo,
} from "../../components/custom_inputfields";
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
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import ZoeDrawing from "@/components/carDrawings/zoe";
import KangooDrawing from "@/components/carDrawings/kangoo";
import VanDrawing from "@/components/carDrawings/kangoo";
import DamagePopUp from "@/components/popups/damagePopUp";
import Google from "@/components/google";
import DamageList from "@/components/carDrawings/damageList";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getServerSidePropsWithRedirect(context);
};

const WherePage: NextPage<pageProps> = ({ data, images, id }) => {
  const router = useRouter();
  const serverData = new reportDataType();
  const mapsId = "GoogleMap";
  serverData.updateFields(data);
  const [allowClick, setAllowClick] = useState(true);
  const [currentCar, setCurrentCar] = useState<"zoe" | "van">(
    serverData.greenCarType || "zoe"
  );
  const [damages, setDamages] = useState<
    {
      position: string | null;
      description: string | null;
      images: string[];
    }[]
  >(serverData.damages);

  /* logic */
  const [otherPartyInvolved, setOtherPartyInvolved] = useState<boolean | null>(
    serverData.otherPartyInvolved
  );
  const [isSingleVehicleChecked, setIsSingleVehicleChecked] = useState<
    boolean | null
  >(serverData.singleVehicleAccident);

  console.log(damages);
  // DATA

  const [damageDescription, setDamageDescription] = useState(
    serverData.damageDescription
  );

  const [greenImages, setGreenImages] = useState<string[] | null>(
    images?.["GreenMobility"] || null
  );
  const [otherPartyImages, setOtherPartyImages] = useState<string[] | null>(
    images?.["OtherParty"] || null
  );

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
          info.model
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
          info.personDamage
        )
    )
  );
  const [otherInfo, setOtherInfo] = useState(
    serverData.otherObjectInfo.map(
      (info) => new OtherInformation(info.description, info.information)
    )
  );
  const [pedestrianInfo, setPedestrianInfo] = useState(
    serverData.pedestrianInfo.map(
      (info) =>
        new PedestrianInformation(
          info.name,
          info.phone,
          info.email,
          info.personDamage
        )
    )
  );
  const [accidentLocation, setAccidentLocation] = useState({
    lat: serverData.accidentLocation.lat,
    lng: serverData.accidentLocation.lng,
  });
  const [accidentAddress, setAccidentAddress] = useState(
    serverData.accidentAddress
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllowClick(false);

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

    const mapField = document.getElementById(mapsId);
    if (mapField) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const canvas = await html2canvas(mapField, {
        useCORS: true,
        scale: 1,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const mapBlob: Blob = dataURItoBlob(dataUrl);

      console.log("map created");
      await handleUploadMap(mapBlob, id);
      console.log("map done");
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
      })),
      bikerInfo: bikeInfo.map((info) => ({
        name: info.name,
        phone: info.phone,
        email: info.email,
        ebike: info.ebike,
        personDamage: info.personDamage,
      })),
      otherObjectInfo: otherInfo.map((info) => ({
        description: info.description,
        information: info.information,
      })),
      pedestrianInfo: pedestrianInfo.map((info) => ({
        name: info.name,
        phone: info.phone,
        email: info.email,
        personDamage: info.personDamage,
      })),

      accidentLocation: accidentLocation,
      damageDescription: damageDescription,
      accidentAddress: accidentAddress,

      /* PAGE LOGIC */
      otherPartyInvolved: otherPartyInvolved,
      singleVehicleAccident: isSingleVehicleChecked,

      damages: damages,
      greenCarType: currentCar,
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
        <div className="my-4">
          <p className="break-words">
            Please indicate on the map where the GreenMobility car was located.
          </p>
        </div>

        <div className="w-full">
          <Google
            id={mapsId}
            show={true}
            showAutocomplete={true}
            accidentAddress={accidentAddress}
            setAccidentAddress={setAccidentAddress}
            setAccidentLocation={setAccidentLocation}
            accidentLocation={accidentLocation}
          />
        </div>
        <YesNo
          required={true}
          id="collisionWithOtherParty"
          labelText="Damage to other object?"
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

          {/* Picture of damages to green car collection */}
          <div className="">
            <ImageField
              reportID={id}
              id="LeftImage"
              labelText="Please take pictures of the damage to the other party"
              required={false}
              images={otherPartyImages}
              imageType="OtherParty"
              multiple={true}
            />
          </div>

          {/* Damage description collection */}
          <div className="">
            <TextField
              id="damageDescription"
              labelText="
          Please provide a description of the damages incurred to the parties involved"
              maxLength={500}
              required={true}
              value={damageDescription}
              onChange={setDamageDescription}
            />
          </div>
        </div>
      )}
      <ImageField
        reportID={id}
        id="FrontImage"
        labelText="Please take pictures of the damage to the GreenMobility car"
        required={false}
        images={greenImages}
        imageType="GreenMobility"
        multiple={true}
      />

      <div className="">
        What type of car is damaged?
        <div className="">
          <select
            className="h-8 border border-MainGreen-300 bg-MainGreen-200 rounded-md shadow-md outline-none"
            id="FilterOptions"
            value={currentCar}
            onChange={(e) => {
              setCurrentCar(e.target.value as "zoe" | "van");
              setDamages([]);
            }}
          >
            <option value="zoe">Passenger vehicle</option>
            <option value="van">Van</option>
          </select>
        </div>
        {currentCar === "zoe" && (
          <div className="">
            <ZoeDrawing damages={damages} setDamages={setDamages} />
          </div>
        )}
        {currentCar === "van" && (
          <div>
            <VanDrawing damages={damages} setDamages={setDamages} />
          </div>
        )}
      </div>

      <div className="w-full">
        <DamageList damages={damages} setDamages={setDamages} />
      </div>

      <div className="flex flex-row justify-between w-full mt-4 ">
        <div className="flex flex-row w-16 justify-start h-14 ml-10 lg:w-16">
          <BackButton pageName={`how?id=${id}`} />
        </div>

        <div className="flex flex-row w-16 justify-end h-14 mr-10 lg:w-16">
          <NextButton allowClick={allowClick} />
        </div>
      </div>
    </form>
  );
};

export default WherePage;
