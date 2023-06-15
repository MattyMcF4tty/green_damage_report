import React, { useEffect, useState } from "react";
import {
  TimeDateField,
  Inputfield,
  YesNo,
} from "@/components/custom_inputfields";
import DriverInfoForm from "@/components/whatPage/driver_information_form";
import { NextPage } from "next";
import { handleRequest } from "@/utils/serverUtils";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";

const What: NextPage = () => {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>();
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [email, setEmail] = useState<string>();

  const [greenCarNumberplate, setgreenCarNumberplate] = useState<string>();
  const [showDriverInfoForm, setShowDriverInfoForm] = useState<boolean>(false);
  const [accidentTime, setAccidentTime] = useState<string>();
  const [accidentDate, setAccidentDate] = useState<string>();
  const [accidentLocation, setAccidentLocation] = useState<{
    address: string;
    position: { lat: number; lng: number };
  }>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    /* TODO: Make function that gets information about current driver from server */
    if (showDriverInfoForm !== true) {
      setFirstName("John");
      setLastName("Doe");
      setAddress("Moon");
      setSocialSecurityNumber("696969696969");
      setDrivingLicenseNumber("42424242424242");
      setPhoneNumber("+45 42 69 21 00");
      setEmail("JohnDoe@placeholder.com");
    }

    const data = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      socialSecurityNumber: socialSecurityNumber,
      drivingLicenseNumber: drivingLicenseNumber,
      phoneNumber: phoneNumber,
      email: email,

      greenCarNumberplate: greenCarNumberplate,
      accidentTime: accidentTime,
      accidentDate: accidentDate,
      accidentLocation: accidentLocation,
    };
    handleRequest(data);
  }

  return (
    <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
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

        {!showDriverInfoForm && (
          <div className="flex flex-col">
            <Inputfield
              labelText="Drivers first name"
              id="FirstNameInput"
              required={true}
              type="text"
              onChange={setFirstName}
            />

            <Inputfield
              labelText="Drivers last name"
              id="LastNameInput"
              required={true}
              type="text"
              onChange={setLastName}
            />

            {/* TODO: make google autofill */}

            {/* TODO: Check if its a real phone number */}
            <Inputfield
              labelText="Drivers social security number"
              id="SocialSecurityNumberInput"
              required={true}
              type="number"
              onChange={setSocialSecurityNumber}
            />

            <Inputfield
              labelText="Drivers driving license number"
              id="DrivingLicenseNumberInput"
              required={true}
              type="number"
              onChange={setDrivingLicenseNumber}
            />

            {/* TODO: Check if its a real phone number */}

            {/* TODO: Check if its a real email */}
            <Inputfield
              labelText="Drivers email"
              id="FirstNameInput"
              required={true}
              type="email"
              onChange={setEmail}
            />
          </div>
        )}
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

      <div className="flex justify-between">
        <BackButton pageName="/"/>
        <NextButton />
      </div>
    </form>
  );
};

export default What;
