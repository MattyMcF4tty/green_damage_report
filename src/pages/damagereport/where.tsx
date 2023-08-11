import React, { useState } from "react";
import Bike from "../../components/opposite_information/bike_information_form";
import Person, {
  PedestrianInformation,
} from "../../components/opposite_information/person_information_form";
import { YesNo, Checkbox } from "../../components/custom_inputfields";
import Other from "../../components/opposite_information/other_information_form";
import CarInfoForm, {
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
  const [isPersonChecked, setIsPersonChecked] = useState<boolean>(
    data?.collisionPedestrian || false
  );
  const [isOtherChecked, setIsOtherChecked] = useState<boolean>(false);
  const [damageDescription, setDamageDescription] = useState<string>("");

  /* Data */
  const [carInfo, setCarInfo] = useState<carInformation>(
    data?.vehicleInfo || {
      name: "",
      phone: "",
      email: "",
      driversLicenseNumber: "",
      insurance: "",
      numberplate: "",
      model: "",
    }
  );
  const [bikeInfo, setBikeInfo] = useState<bikeInformation>(
    data?.bikerInfo || {
      name: "",
      phone: "",
      email: "",
      ebike: null,
      personDamage: "",
    }
  );
  const [otherInfo, setOtherInfo] = useState<OtherInformation>(
    data?.otherObjectInfo || { description: "", information: "" }
  );
  const [pedestrianInfo, setPedestrianInfo] = useState<PedestrianInformation>(
    data?.pedestrianInfo || { name: "", phone: "", email: "", personDamage: "" }
  );
  /*   const [objectInfo, setObjectInfo] = useState<ObjectInformation>(data?.otherObjectInfo || {description: "", information: ""}); */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Data that gets sent to server */
    const data = {
      vehicleInfo: carInfo,
      bikerInfo: bikeInfo,
      otherObjectInfo: otherInfo,
      pedestrianInfo: pedestrianInfo,
      /*       objectInfo, */

      /* PAGE LOGIC */
      collisionPersonVehicle: isVehicleChecked,
      singleVehicleAccident: isSingleVehicleChecked,
      collisionOther: isCollisionWithObjectChecked,
      collisionCar: isCarChecked,
      collisionBike: isBikeChecked,
      collisionPedestrian: isPersonChecked,
    };

    await updateData(id, data);
    router.push(`confirmation?id=${id}`);
  };

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
        <div className="flex justify-left text-left w-full mb-4">
          <div id="whatvehicle" className="flex flex-col w-full">
            <div>
              <label htmlFor="whatvehicle">What object?</label>
            </div>
            <div className="flex flex-row justify-between">
              <Checkbox
                id="vehicleCar"
                labelText="Car"
                requried={false}
                value={isCarChecked}
                onChange={setIsCarChecked}
              />
              <Checkbox
                id="vehicleBike"
                labelText="Bike"
                requried={false}
                value={isBikeChecked}
                onChange={setIsBikeChecked}
              />
              <Checkbox
                id="vehiclePerson"
                labelText="Pedestrian"
                requried={false}
                value={isPersonChecked}
                onChange={setIsPersonChecked}
              />
              <Checkbox
                id="Other"
                labelText="Other"
                requried={false}
                value={isOtherChecked}
                onChange={setIsOtherChecked}
              />
            </div>
            <div className="w-full">
              {isCarChecked && (
                <CarInfoForm value={carInfo} onChange={setCarInfo} />
              )}
              {isBikeChecked && (
                <Bike value={bikeInfo} onChange={setBikeInfo} />
              )}
              {isPersonChecked && (
                <Person value={pedestrianInfo} onChange={setPedestrianInfo} />
              )}
              {isOtherChecked && (
                <Other value={otherInfo} onChange={setOtherInfo} />
              )}
            </div>
          </div>
        </div>
      )}

      {!isVehicleChecked && (
        <YesNo
          id="SingleVehicleAccident"
          labelText="Single vehicle accident"
          required={true}
          value={isSingleVehicleChecked}
          onChange={setIsSingleVehicleChecked}
        />
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
          <BackButton pageName={`what?id=${id}`} />
        </div>

        <div className="flex flex-row w-16 justify-end h-14 mr-10">
          <NextButton />
        </div>
      </div>
    </form>
  );
};

export default WherePage;
