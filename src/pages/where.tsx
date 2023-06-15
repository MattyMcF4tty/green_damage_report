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
import { NavButtons } from "@/components/navigation";

function WherePage() {
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

  function handleSubmit() {
    console.log("fuck dig");
  }

  return (
    <form
      className="flex flex-col items-start w-full h-full"
      onSubmit={handleSubmit}
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
      {isCarChecked && <CarInfoForm onchange={setCarInfo} />}
      {isBikeChecked && <Bike onchange={setBikeInfo} />}
      {isPersonChecked && <Person onchange={setPedestrianInfo} />}
      {isOtherChecked && <Other onchange={setOtherInfo} />}
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
      <div className="flex flex-row w-full place-content-between h-10 mt-10">
        <button className="w-2/5 bg-MainGreen-300" type="submit">
          Previous
        </button>
        <button className="w-2/5 bg-MainGreen-300" type="submit">
          Next
        </button>
      </div>{" "}
    </form>
  );
}

export default WherePage;
