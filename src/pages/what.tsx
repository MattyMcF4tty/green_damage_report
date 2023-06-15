import React, { useEffect, useState } from "react";
import {
  TimeDateField,
  Inputfield,
  YesNo,
} from "@/components/custom_inputfields";
import DriverInfoForm from "@/components/whatPage/driver_information_form";
import { NextPage } from "next";
import { AccidentInformation } from "@/utils/logic";

const What: NextPage = () => {
  const [greenCarNumberplate, setgreenCarNumberplate] = useState<string>("");
  const [showDriverInfoForm, setShowDriverInfoForm] = useState<boolean>(false);
  const [accidentTime, setAccidentTime] = useState<string>("");
  const [accidentDate, setAccidentDate] = useState<string>("");
  /*   const [accidentLocation, setAccidentLocation] = useState<{
    address: string;
    position: { lat: number; lng: number };
  }>(); */

  /* Defining the classes that the information will be keept in */
  const [accidentInfo, setAccidentInfo] = useState<AccidentInformation>();

  useEffect(() => {
    const newAccidentInfo = new AccidentInformation();

    setAccidentInfo(newAccidentInfo);
  }, [greenCarNumberplate /*,accidentLocation */, accidentTime, accidentDate]);

  function handleSubmit() {}

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      {/* GreenMobility car numberplate collection */}
      <div>
        {/* TODO: Make it so you can only type a valid numberplate for the country where the accident took place and get a list from a server with all the green numberplates */}
        <Inputfield
          labelText="Numberplate of GreenMobility car"
          id="greenCarNumberplateInput"
          type={"text"}
          required={true}
          onChange={setgreenCarNumberplate}
        />
      </div>

      {/* Driver information collection */}
      <div className="">
        <YesNo
          labelText="Was driver and renter the same person?"
          id="ShowDriverInfoForm"
          required={true}
          onChange={setShowDriverInfoForm}
        />

        {!showDriverInfoForm && <DriverInfoForm onChange={setAccidentInfo} />}
      </div>

      {/* Accident time and date collection */}
      <div>
        <TimeDateField
          labelText="When did the accident occur?"
          id="Accident"
          required={true}
          timeChange={setAccidentTime}
          dateChange={setAccidentDate}
        />
      </div>

      <div className="flex flex-row w-full place-content-between h-10 mt-10">
        <button className="w-2/5 bg-MainGreen-300" type="submit">
          Previous
        </button>
        <button className="w-2/5 bg-MainGreen-300" type="submit">
          Next
        </button>
      </div>
    </form>
  );
};

export default What;
