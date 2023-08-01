import React, { useState, useRef, useEffect } from "react";
import Bike from "../components/opposite_information/bike_information_form";
import Person, {
  PedestrianInformation,
} from "../components/opposite_information/person_information_form";
import { YesNo, Inputfield, TextField } from "../components/custom_inputfields";
import Checkbox from "../components/custom_checkbox";
import Other from "../components/opposite_information/other_information_form";
import CarInfoForm, {
  carInformation,
} from "../components/opposite_information/car_information_form";
import { bikeInformation } from "../components/opposite_information/bike_information_form";
import OtherInfoForm, {
  OtherInformation,
} from "../components/opposite_information/other_information_form";
import PedestrianInfoForm from "../components/opposite_information/person_information_form";
import ObjectInfoForm, {
  ObjectInformation,
} from "../components/opposite_information/object_information";

import { useRouter } from "next/router";
import { handleRequest } from "@/utils/serverUtils";
import BackButton from "@/components/buttons/back";
import NextButton from "@/components/buttons/next";

function WherePage() {
  const router = useRouter();

  const [isVehicleChecked, setIsVehicleChecked] = useState(false);
  const [isCarChecked, setIsCarChecked] = useState(false);
  const [isBikeChecked, setIsBikeChecked] = useState(false);
  const [isPersonChecked, setIsPersonChecked] = useState(false);
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [isPersonDamageChecked, setIsPersonDamageChecked] = useState(false);
  const [damageDescription, setDamageDescription] = useState<string>("");
  const [isSingleVehicleChecked, setIsSingleVehicleChecked] = useState(false);
  const [isCollisionWithObjectChecked, setIsCollisionWithObjectChecked] =
    useState(false);

  const [carInfo, setCarInfo] = useState<carInformation>();
  const [bikeInfo, setBikeInfo] = useState<bikeInformation>();
  const [otherInfo, setOtherInfo] = useState<OtherInformation>();
  const [pedestrianInfo, setPedestrianInfo] = useState<PedestrianInformation>();
  const [objectInfo, setObjectInfo] = useState<ObjectInformation>();

  /* Data that gets sent to server */
  const data = {
    carInfo,
    bikeInfo,
    otherInfo,
    pedestrianInfo,
    objectInfo,
  };

  /* Logic behind what data needs to get sent to server */
  useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log the selected options
    console.log("Selected Options:");
    console.log("isVehicleChecked:", isVehicleChecked);
    console.log("isCarChecked:", isCarChecked);
    console.log("isBikeChecked:", isBikeChecked);
    console.log("isPersonChecked:", isPersonChecked);
    console.log("isOtherChecked:", isOtherChecked);
    console.log("isPersonDamageChecked:", isPersonDamageChecked);
    console.log("damageDescription:", damageDescription);
    console.log("isSingleVehicleChecked:", isSingleVehicleChecked);
    console.log("isCollisionWithObjectChecked:", isCollisionWithObjectChecked);

    // Log the selected data
    console.log("Selected Data:");
    console.log("carInfo:", carInfo);
    console.log("bikeInfo:", bikeInfo);
    console.log("otherInfo:", otherInfo);
    console.log("pedestrianInfo:", pedestrianInfo);
    console.log("objectInfo:", objectInfo);

    await handleRequest(data);

    router.push("/confirmation");
  };

  return (
    <form
      className="flex flex-col items-start w-full h-full"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="w-full">
        <YesNo
          required={true}
          id="whatvehicle"
          labelText="Collision with another vehicle/person?"
          onChange={setIsVehicleChecked}
        />
      </div>

      {isVehicleChecked && (
        <div className="flex justify-left text-left w-full mb-4">
          <div id="whatvehicle" className="flex flex-col">
            <div>
              <label htmlFor="whatvehicle">What vehicle?</label>
            </div>
            <div className="flex flex-row">
              <Checkbox
                id="vehicleCar"
                labelText="Car"
                onChange={setIsCarChecked}
              />
              <Checkbox
                id="vehicleBike"
                labelText="Bike"
                onChange={setIsBikeChecked}
              />
              <Checkbox
                id="vehiclePerson"
                labelText="Pedestrian"
                onChange={setIsPersonChecked}
              />
              <Checkbox
                id="vehicleOther"
                labelText="Other"
                onChange={setIsOtherChecked}
              />
            </div>
            {isCarChecked && <CarInfoForm onChange={setCarInfo} />}
            {isBikeChecked && <Bike onchange={setBikeInfo} />}
            {isPersonChecked && <Person onchange={setPedestrianInfo} />}
            {isOtherChecked && <Other onchange={setOtherInfo} />}
          </div>
        </div>
      )}

      {!isVehicleChecked && (
        <YesNo
          id="SingleVehicleAccident"
          labelText="Single vehicle accident"
          required={true}
          onChange={setIsSingleVehicleChecked}
        />
      )}

      {!isSingleVehicleChecked && (
        <YesNo
          id="CollisionWithObject"
          labelText="Collision with object"
          required={true}
          onChange={setIsCollisionWithObjectChecked}
        />
      )}

      {isCollisionWithObjectChecked && (
        <ObjectInfoForm onchange={setObjectInfo} />
      )}

      <div className="flex flex-col justify-center">
        <YesNo
          required={true}
          id="personDamage"
          labelText="Person damage?"
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
            onChange={setDamageDescription}
          />
        </div>
      )}
      <div className="flex items-center justify-between w-full mt-4">
        <div className="flex flex-row justify-start items-center h-14 ml-7 w-32">
          <BackButton pageName="how" />
        </div>

        <div className="flex flex-row justify-end items-center h-14 mr-7 w-32">
          <NextButton />
        </div>
      </div>
    </form>
  );
}

export default WherePage;
