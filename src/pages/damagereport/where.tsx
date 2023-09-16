import React, { useState } from "react";
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
import GoogleMapsField, {
  googleIndicator,
} from "@/components/google_maps_field";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
/* import ZoeDrawing from "@/components/carDrawings/zoe";
import KangooDrawing from "@/components/carDrawings/kangoo";
import VanDrawing from "@/components/carDrawings/kangoo";
import DamagePopUp from "@/components/popups/damagePopup";
 */ import Google from "@/components/google";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getServerSidePropsWithRedirect(context);
};

const WherePage: NextPage<pageProps> = ({ data, images, id }) => {
  const router = useRouter();
  const serverData = new reportDataType();
  serverData.updateFields(data);
  const [allowClick, setAllowClick] = useState(true);
  /*   const [currentCar, setCurrentCar] = useState<"zoe" | "van">("zoe");
  const [showOne, setShowOne] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showThree, setShowThree] = useState(false);
  const [showFour, setShowFour] = useState(false);
  const [showFive, setShowFive] = useState(false);
  const [showSix, setShowSix] = useState(false);
  const [showSeven, setShowSeven] = useState(false);
  const [showEight, setShowEight] = useState(false);
  const [showNine, setShowNine] = useState(false);
  const [showTen, setShowTen] = useState(false);
  const [showEleven, setShowEleven] = useState(false);
  const [showTwelve, setShowTwelve] = useState(false);
  const [showThirteen, setShowThirteen] = useState(false);
  const [showFourteen, setShowFourteen] = useState(false);
  const [showFifteen, setShowFifteen] = useState(false); */

  /* logic */
  const [otherPartyInvolved, setOtherPartyInvolved] = useState<boolean | null>(
    serverData.otherPartyInvolved
  );
  const [isSingleVehicleChecked, setIsSingleVehicleChecked] = useState<
    boolean | null
  >(serverData.singleVehicleAccident);

  // DATA
  /*   const [damageOne, setDamageOne] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageTwo, setDamageTwo] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageThree, setDamageThree] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageFour, setDamageFour] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageFive, setDamageFive] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageSix, setDamageSix] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageSeven, setDamageSeven] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageEight, setDamageEight] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageNine, setDamageNine] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageTen, setDamageTen] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageEleven, setDamageEleven] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageTwelve, setDamageTwelve] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageThirteen, setDamageThirteen] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageFourteen, setDamageFourteen] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  });
  const [damageFifteen, setDamageFifteen] = useState<{
    description: string | null;
    imageUrl: string | null;
  }>({
    description: null,
    imageUrl: null,
  }); */

  const [damageDescription, setDamageDescription] = useState(
    serverData.damageDescription
  );

  const [greenImages, setGreenImages] = useState<string[] | null>(
    images?.["GreenMobility"] || null
  );
  const [otherPartyImages, setOtherPartyImages] = useState<string[] | null>(
    images?.["OtherParty"] || null
  );

  const [indicators, setIndicators] = useState(
    data.googleIndicators.map(
      (info) => new googleIndicator(info.marker1, info.marker2, info.marker3)
    )
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

    const mapField = document.getElementById("MyMap");
    if (mapField) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const canvas = await html2canvas(mapField, {
        useCORS: true,
        scale: 17,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const mapBlob: Blob = dataURItoBlob(dataUrl);

      await handleUploadMap(mapBlob, id);
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
      damageDescription: damageDescription,
      accidentAddress: accidentAddress,

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
              located.
            </p>
          </div>

          <div className="w-full">
            {/*   <GoogleMapsField
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
            /> */}
            <Google
              show={true}
              showAutocomplete={true}
              accidentAddress={accidentAddress}
              setAccidentAddress={setAccidentAddress}
              setAccidentLocation={setAccidentLocation}
              accidentLocation={accidentLocation}
            />
          </div>

          {/* Picture of damages to green car collection */}
          <div>
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

      {/* <div>
        What type of car is damaged?
        <div className="">
          <select
            className="h-8 border border-neutral-500 rounded-md shadow-md outline-none"
            id="FilterOptions"
            value={currentCar}
            onChange={(e) => setCurrentCar(e.target.value as "zoe" | "van")}
          >
            <option value="zoe">Passenger vehicle</option>
            <option value="van">Van</option>
          </select>
        </div>
        {currentCar === "zoe" && (
          <div className="">
            <ZoeDrawing
              setShowOne={setShowOne}
              setShowTwo={setShowTwo}
              setShowThree={setShowThree}
              setShowFour={setShowFour}
              setShowFive={setShowFive}
              setShowSix={setShowSix}
              setShowSeven={setShowSeven}
              setShowEight={setShowEight}
              setShowNine={setShowNine}
              setShowTen={setShowTen}
              setShowEleven={setShowEleven}
              setShowTwelve={setShowTwelve}
              setShowThirteen={setShowThirteen}
              setShowFourteen={setShowFourteen}
              setShowFifteen={setShowFifteen}
            />
          </div>
        )}
        {currentCar === "van" && (
          <div>
            <VanDrawing
              setShowOne={setShowOne}
              setShowTwo={setShowTwo}
              setShowThree={setShowThree}
              setShowFour={setShowFour}
              setShowFive={setShowFive}
              setShowSix={setShowSix}
              setShowSeven={setShowSeven}
              setShowEight={setShowEight}
              setShowNine={setShowNine}
            />
          </div>
        )}
        {showOne && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowOne}
            damage={damageOne}
            setDamage={setDamageOne}
          />
        )}
        {showTwo && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowTwo}
            damage={damageTwo}
            setDamage={setDamageTwo}
          />
        )}
        {showThree && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowThree}
            damage={damageThree}
            setDamage={setDamageThree}
          />
        )}
        {showFour && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowFour}
            damage={damageFour}
            setDamage={setDamageFour}
          />
        )}
        {showFive && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowFive}
            damage={damageFive}
            setDamage={setDamageFive}
          />
        )}
        {showSix && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowSix}
            damage={damageSix}
            setDamage={setDamageSix}
          />
        )}
        {showSeven && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowSeven}
            damage={damageSeven}
            setDamage={setDamageSeven}
          />
        )}
        {showEight && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowEight}
            damage={damageEight}
            setDamage={setDamageEight}
          />
        )}
        {showNine && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowNine}
            damage={damageNine}
            setDamage={setDamageNine}
          />
        )}
        {showTen && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowTen}
            damage={damageTen}
            setDamage={setDamageTen}
          />
        )}
        {showEleven && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowEleven}
            damage={damageEleven}
            setDamage={setDamageEleven}
          />
        )}
        {showTwelve && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowTwelve}
            damage={damageTwelve}
            setDamage={setDamageTwelve}
          />
        )}
        {showThirteen && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowThirteen}
            damage={damageThirteen}
            setDamage={setDamageThirteen}
          />
        )}
        {showFourteen && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowFourteen}
            damage={damageFourteen}
            setDamage={setDamageFourteen}
          />
        )}
        {showFifteen && (
          <DamagePopUp
            id={id}
            setShowPopUp={setShowFifteen}
            damage={damageFifteen}
            setDamage={setDamageFifteen}
          />
        )}
      </div> */}

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
