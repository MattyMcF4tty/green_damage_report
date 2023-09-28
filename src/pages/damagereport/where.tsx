import React, { useEffect, useState } from "react";
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
  const [currentCar, setCurrentCar] = useState<"zoe" | "van">("zoe");
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
  const [showFifteen, setShowFifteen] = useState(false);
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
  const [damageOne, setDamageOne] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[0]
      ? {
          position: damages[0].position,
          description: damages[0].description,
          images: damages[0].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageTwo, setDamageTwo] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[1]
      ? {
          position: damages[1].position,
          description: damages[1].description,
          images: damages[1].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageThree, setDamageThree] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[2]
      ? {
          position: damages[2].position,
          description: damages[2].description,
          images: damages[2].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageFour, setDamageFour] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[3]
      ? {
          position: damages[3].position,
          description: damages[3].description,
          images: damages[3].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageFive, setDamageFive] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[4]
      ? {
          position: damages[4].position,
          description: damages[4].description,
          images: damages[4].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageSix, setDamageSix] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[5]
      ? {
          position: damages[5].position,
          description: damages[5].description,
          images: damages[5].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageSeven, setDamageSeven] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[6]
      ? {
          position: damages[6].position,
          description: damages[6].description,
          images: damages[6].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageEight, setDamageEight] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[7]
      ? {
          position: damages[7].position,
          description: damages[7].description,
          images: damages[7].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageNine, setDamageNine] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[8]
      ? {
          position: damages[8].position,
          description: damages[8].description,
          images: damages[8].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageTen, setDamageTen] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[9]
      ? {
          position: damages[9].position,
          description: damages[9].description,
          images: damages[9].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageEleven, setDamageEleven] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[10]
      ? {
          position: damages[10].position,
          description: damages[10].description,
          images: damages[10].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageTwelve, setDamageTwelve] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[11]
      ? {
          position: damages[11].position,
          description: damages[11].description,
          images: damages[11].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageThirteen, setDamageThirteen] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[12]
      ? {
          position: damages[12].position,
          description: damages[12].description,
          images: damages[12].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageFourteen, setDamageFourteen] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[13]
      ? {
          position: damages[13].position,
          description: damages[13].description,
          images: damages[13].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );
  const [damageFifteen, setDamageFifteen] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  }>(
    damages[14]
      ? {
          position: damages[14].position,
          description: damages[14].description,
          images: damages[14].images,
        }
      : {
          position: null,
          description: null,
          images: [],
        }
  );

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
    });

    await updateData(id, serverData);
    router.push(`confirmation?id=${id}`);
  };
  /*   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
   */
  /*     <LoadScript googleMapsApiKey={apiKey || ""} libraries={["places"]}> */

  useEffect(() => {
    const newDamageArray = [
      damageOne,
      damageTwo,
      damageThree,
      damageFour,
      damageFive,
      damageSix,
      damageSeven,
      damageEight,
      damageNine,
      damageTen,
      damageEleven,
      damageTwelve,
      damageThirteen,
      damageFourteen,
      damageFifteen,
    ];

    setDamages(newDamageArray);
  }, [
    damageOne,
    damageTwo,
    damageThree,
    damageFour,
    damageFive,
    damageSix,
    damageSeven,
    damageEight,
    damageNine,
    damageTen,
    damageEleven,
    damageTwelve,
    damageThirteen,
    damageFourteen,
    damageFifteen,
  ]);

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

      <div>
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
            setShowPopUp={setShowOne}
            damage={damageOne}
            setDamage={setDamageOne}
          />
        )}
        {showTwo && (
          <DamagePopUp
            setShowPopUp={setShowTwo}
            damage={damageTwo}
            setDamage={setDamageTwo}
          />
        )}
        {showThree && (
          <DamagePopUp
            setShowPopUp={setShowThree}
            damage={damageThree}
            setDamage={setDamageThree}
          />
        )}
        {showFour && (
          <DamagePopUp
            setShowPopUp={setShowFour}
            damage={damageFour}
            setDamage={setDamageFour}
          />
        )}
        {showFive && (
          <DamagePopUp
            setShowPopUp={setShowFive}
            damage={damageFive}
            setDamage={setDamageFive}
          />
        )}
        {showSix && (
          <DamagePopUp
            setShowPopUp={setShowSix}
            damage={damageSix}
            setDamage={setDamageSix}
          />
        )}
        {showSeven && (
          <DamagePopUp
            setShowPopUp={setShowSeven}
            damage={damageSeven}
            setDamage={setDamageSeven}
          />
        )}
        {showEight && (
          <DamagePopUp
            setShowPopUp={setShowEight}
            damage={damageEight}
            setDamage={setDamageEight}
          />
        )}
        {showNine && (
          <DamagePopUp
            setShowPopUp={setShowNine}
            damage={damageNine}
            setDamage={setDamageNine}
          />
        )}
        {showTen && (
          <DamagePopUp
            setShowPopUp={setShowTen}
            damage={damageTen}
            setDamage={setDamageTen}
          />
        )}
        {showEleven && (
          <DamagePopUp
            setShowPopUp={setShowEleven}
            damage={damageEleven}
            setDamage={setDamageEleven}
          />
        )}
        {showTwelve && (
          <DamagePopUp
            setShowPopUp={setShowTwelve}
            damage={damageTwelve}
            setDamage={setDamageTwelve}
          />
        )}
        {showThirteen && (
          <DamagePopUp
            setShowPopUp={setShowThirteen}
            damage={damageThirteen}
            setDamage={setDamageThirteen}
          />
        )}
        {showFourteen && (
          <DamagePopUp
            setShowPopUp={setShowFourteen}
            damage={damageFourteen}
            setDamage={setDamageFourteen}
          />
        )}
        {showFifteen && (
          <DamagePopUp
            setShowPopUp={setShowFifteen}
            damage={damageFifteen}
            setDamage={setDamageFifteen}
          />
        )}
      </div>

      <div>
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
