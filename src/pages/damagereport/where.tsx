import React, { useState } from "react";
import {
  PedestrianInformation,
} from "../../components/opposite_information/person_information_form";
import {
  YesNo,
} from "../../components/custom_inputfields";
import {
  carInformation,
} from "../../components/opposite_information/car_information_form";
import { bikeInformation } from "../../components/opposite_information/bike_information_form";
import { OtherInformation } from "../../components/opposite_information/other_information_form";

import { useRouter } from "next/router";
import BackButton from "@/components/buttons/back";
import NextButton from "@/components/buttons/next";
import { getData, updateData } from "@/firebase/clientApp";
import { GetServerSidePropsContext, NextPage } from "next";
import { pageProps } from "@/utils/utils";
import { OtherPartyList } from "@/components/otherPartys/otherPartyList";
import GoogleMapsField from "@/components/google_maps_field";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id as string;

  const data = await getData(id);

  return {
    props: {
      data: data || null,
      id: id,
    },
  };
};

const WherePage: NextPage<pageProps> = ({ data, id }) => {
  const router = useRouter();

  /* logic */
  const [isVehicleChecked, setIsVehicleChecked] = useState<boolean | null>(
    data!.collisionPersonVehicle
  );
  const [isSingleVehicleChecked, setIsSingleVehicleChecked] = useState<
    boolean | null
  >(data!.singleVehicleAccident);
  const [isCollisionWithObjectChecked, setIsCollisionWithObjectChecked] =
    useState<boolean | null>(data!.collisionOther);
  /*   const [isPersonDamageChecked, setIsPersonDamageChecked] = useState<boolean | null>(null);
   */
  const [isCarChecked, setIsCarChecked] = useState<boolean>(
    data?.collisionCar || false
  );
  const [isBikeChecked, setIsBikeChecked] = useState<boolean>(
    data?.collisionBike || false
  );

  const [address, setAddress] = useState<string>(
    data?.driverInfo.address || ""
  );
  const [isPersonChecked, setIsPersonChecked] = useState<boolean>(
    data?.collisionPedestrian || false
  );
  const [isOtherChecked, setIsOtherChecked] = useState<boolean>(false);
  const [damageDescription, setDamageDescription] = useState<string>("");

  /* Data */
  const [carInfo, setCarInfo] = useState<carInformation[]>(
    data?.vehicleInfo || []
  );
  const [bikeInfo, setBikeInfo] = useState<bikeInformation[]>(
    data?.bikerInfo || []
  );
  const [otherInfo, setOtherInfo] = useState<OtherInformation[]>(
    data?.otherObjectInfo || []
  );
  const [pedestrianInfo, setPedestrianInfo] = useState<PedestrianInformation[]>(
    data?.pedestrianInfo || []
  );
  const [accidentLocation, setAccidentLocation] = useState(data?.accidentLocation || {lat:0, lng:0})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Data that gets sent to server */
    const data = {
      vehicleInfo: carInfo.map(info => info.toPlainObject()) ,
      bikerInfo: bikeInfo.map(info => info.toPlainObject()) ,
      otherObjectInfo: otherInfo.map(info => info.toPlainObject()) ,
      pedestrianInfo: pedestrianInfo.map(info => info.toPlainObject()),
      address: address,
      
      /* PAGE LOGIC */
      collisionPersonVehicle: isVehicleChecked,
      singleVehicleAccident: isSingleVehicleChecked,
      collisionOther: isCollisionWithObjectChecked,
      collisionCar: isCarChecked,
      collisionBike: isBikeChecked,
      collisionPedestrian: isPersonChecked,
    };

    await updateData(id, data);
/*     router.push(`confirmation?id=${id}`);
 */  };
/*   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
 */
  /*     <LoadScript googleMapsApiKey={apiKey || ""} libraries={["places"]}> */
  return (
      <form
        className="flex flex-col items-start w-full h-full"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="w-full">
          <p className="text-MainGreen-300 mb-8 flex justify-start font-bold text-[20px]">
            Vital Information
          </p>
          <YesNo
            required={true}
            id="whatvehicle"
            labelText="Collision with another object?"
            value={isVehicleChecked}
            onChange={setIsVehicleChecked}
          />
        </div>
        {isVehicleChecked && (
          <div className="flex flex-col justify-left text-left w-full mb-4">
            <div id="whatvehicle" className="flex flex-col w-full">
              <div>
                <label htmlFor="whatvehicle">What object?</label>
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
              <p>
                Please indicate on the map where the GreenMobility car was
                located, as well as the location of the other partys, by using
                the markers. Please use the draggable line to mark the car's
                trajectory leading to the collision.
              </p>
            </div>

            <div className="w-full">
              <GoogleMapsField 
              showMap={true} 
              startZoom={17} 
              startPos={{lat:55.682993, lng:12.585482}}
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
              />
            </div>
          </div>
        )}

        {!isVehicleChecked && (
          <div className="w-full">
            <div>
              <YesNo
                id="SingleVehicleAccident"
                labelText="Single vehicle accident"
                required={true}
                value={isSingleVehicleChecked}
                onChange={setIsSingleVehicleChecked} // Update the handler
              />
            </div>
            <div className="w-full">
              {isSingleVehicleChecked && (
                <div/>
/*                 <Google show={false} showAutocomplete={true} />
 */              )}
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

        <div className="flex flex-row justify-between w-full mt-4">
          <div className="flex flex-row w-16 justify-start h-14 ml-10 ">
            <BackButton pageName={`how?id=${id}`} />
          </div>

          <div className="flex flex-row w-16 justify-end h-14 mr-10">
            <NextButton />
          </div>
        </div>
      </form>
  );
};

export default WherePage;
