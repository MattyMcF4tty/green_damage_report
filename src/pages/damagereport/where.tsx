import React, { useState } from "react";
import {
  MultipleImageField,
  TextField,
  YesNo,
} from "../../components/custom_inputfields";
import BackButton from "@/components/buttons/back";
import NextButton from "@/components/buttons/next";
import { GetServerSidePropsContext, NextPage } from "next";
import { OtherPartyList } from "@/components/otherPartys/otherPartyList";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import ZoeDrawing from "@/components/carDrawings/zoe";
import VanDrawing from "@/components/carDrawings/kangoo";
import Google from "@/components/google";
import DamageList from "@/components/carDrawings/damageList";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { Vehicle } from "@/utils/schemas/accidentParticipantSchemas/vehicleSchema";
import { Biker } from "@/utils/schemas/accidentParticipantSchemas/bikerSchema";
import { Pedestrian } from "@/utils/schemas/accidentParticipantSchemas/pedestrianSchema";
import { IncidentObject } from "@/utils/schemas/accidentParticipantSchemas/incidentObjectSchema";
import { updateDamageReport, uploadReportFile } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";
import { getEnvVariable, getServerSidePropsWithRedirect } from "@/utils/logic/misc";
import { PageProps } from "@/utils/schemas/miscSchemas/pagePropsSchema";
import { serverUpdateReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getServerSidePropsWithRedirect(context);
};

const WherePage: NextPage<PageProps> = ({ data, images, id }) => {
  const router = useRouter();
  const serverData = new CustomerDamageReport();
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
        new Vehicle(
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
        new Biker(
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
      (info) => new IncidentObject(info.description, info.information)
    )
  );
  const [pedestrianInfo, setPedestrianInfo] = useState(
    serverData.pedestrianInfo.map(
      (info) =>
        new Pedestrian(
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
      await uploadReportFile(id, "Admin/map", mapBlob);
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

    try {
      await serverUpdateReport(id, serverData);
    } catch (error) {
      setAllowClick(true);
      return;
    }

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
          labelText="Any damage to another object"
          value={otherPartyInvolved}
          onChange={setOtherPartyInvolved}
        />
      </div>
      {otherPartyInvolved && (
        <div className="flex flex-col justify-left text-left w-full ">
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

          {/* Damage description collection */}
          <div className="mt-4">
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

          {/* Picture of damages to green car collection */}
          <div className="mb-6 mt-4">
            <MultipleImageField
              reportId={id}
              id="FrontImage"
              labelText="Please take pictures of the damage to the other partys"
              required={false}
              imageLimit={20}
              folderPath="OtherPartyDamages/"
            />
          </div>
        </div>
      )}

      <div className="">
        Please choose the type of the GreenMobility vehicle and indicate the
        position of the damages that occurred
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
            <ZoeDrawing
              reportId={id}
              damages={damages}
              setDamages={setDamages}
            />
          </div>
        )}
        {currentCar === "van" && (
          <div>
            <VanDrawing
              reportId={id}
              damages={damages}
              setDamages={setDamages}
            />
          </div>
        )}
      </div>

      <div className="w-full">
        <DamageList reportId={id} damages={damages} setDamages={setDamages} />
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
