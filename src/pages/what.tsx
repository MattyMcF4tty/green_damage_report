import React, { useEffect, useState } from "react";
import {TimeDateField, Inputfield, YesNo,
} from "@/components/custom_inputfields";
import { GetServerSidePropsContext, NextPage } from "next";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";
import { useRouter } from "next/router";
import { getData, updateData } from "@/firebase/clientApp";
import { pageProps } from "@/utils/utils";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = context.query.id as string;

  const data = await getData(id);

  return {
    props: {
      data: data || null,
      id: id
    }
  }
}
import PhoneNumber from "@/components/opposite_information/phone_form";

const What: NextPage<pageProps> = ({data, id}) => {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>(data?.driverInfo.firstName || "");
  const [lastName, setLastName] = useState<string>(data?.driverInfo.lastName || "");
  const [address, setAddress] = useState<string>(data?.driverInfo.address || "");
  const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>(data?.driverInfo.socialSecurityNumber || "");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>(data?.driverInfo.drivingLicenseNumber || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(data?.driverInfo.phoneNumber || "");
  const [email, setEmail] = useState<string>(data?.driverInfo.email || "");

  const [greenCarNumberplate, setgreenCarNumberplate] = useState<string>(data?.greenCarNumberPlate || "");
  const [showDriverInfoForm, setShowDriverInfoForm] = useState<boolean | null>(data!.driverRenter);
  const [accidentTime, setAccidentTime] = useState<string>(data?.time || "");
  const [accidentDate, setAccidentDate] = useState<string>(data?.date || "");
  const [accidentLocation, setAccidentLocation] = useState<string>(data?.accidentLocation || "");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showDriverInfoForm != true) {
/* TODO: Make function that gets information about current driver from green server */
    }

    const data = {      
      driverInfo: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        socialSecurityNumber: socialSecurityNumber,
        drivingLicenseNumber: drivingLicenseNumber,
        email: email
      },

      greenCarNumberPlate: greenCarNumberplate,
      time: accidentTime,
      date: accidentDate,
      accidentLocation: accidentLocation,

      driverRenter: showDriverInfoForm,
    };
    await updateData(id, data);

    router.push(`/how?id=${id}`);
  };

  return (
    <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
      {/* GreenMobility car numberplate collection */}
      <div>
        {/* TODO: Make it so you can only type a valid numberplate for the country where the accident took place and get a list from a server with all the green numberplates */}
        <Inputfield
          labelText="Numberplate of GreenMobility car"
          id="greenCarNumberplateInput"
          type="numberplate"
          required={true}
          value={greenCarNumberplate}
          onChange={setgreenCarNumberplate}
        />
      </div>

      {/* Driver information collection */}
      <div className="">
        <YesNo
          labelText="Was driver and renter the same person?"
          id="ShowDriverInfoForm"
          required={true}
          value={showDriverInfoForm}
          onChange={setShowDriverInfoForm}
        />

        {!showDriverInfoForm && showDriverInfoForm !== null && (
          <div className="flex flex-col">
            <Inputfield
              labelText="Drivers first name"
              id="FirstNameInput"
              required={true}
              type="text"
              value={firstName}
              onChange={setFirstName}
            />

            <Inputfield
              labelText="Drivers last name"
              id="LastNameInput"
              required={true}
              type="text"
              value={lastName}
              onChange={setLastName}
            />

            {/* TODO: make google autofill */}
            <Inputfield 
              id="driverAddress"
              labelText="Home address"
              required={true}
              value={address}
              onChange={setAddress}
              type="text"
            />

            {/* TODO: Check if its a real phone number */}
            <Inputfield
              labelText="Drivers social security number"
              id="SocialSecurityNumberInput"
              required={true}
              type="ssn"
              value={socialSecurityNumber}
              onChange={setSocialSecurityNumber}
            />

            <Inputfield
              labelText="Drivers driving license number"
              id="DrivingLicenseNumberInput"
              required={true}
              type="license"
              value={drivingLicenseNumber}
              onChange={setDrivingLicenseNumber}
            />

            <PhoneNumber value={phoneNumber} onChange={setPhoneNumber} />
            
            <Inputfield
              labelText="Drivers email"
              id="EmailInput"
              required={true}
              type="email"
              value={email}
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
          timeValue={accidentTime}
          dateValue={accidentDate}
          timeChange={setAccidentTime}
          dateChange={setAccidentDate}
        />
      </div>

      {/* Accident location collection */}
      <div>
          <Inputfield 
            labelText="Location of accident"
            id="location"
            required={true}
            type="text"
            value={accidentLocation}
            onChange={setAccidentLocation}
          />
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-1/3 justify-start h-12  ml-10">
          <BackButton pageName="/" />
        </div>

        <div className="flex flex-row w-1/3 justify-end mr-10">
          <NextButton />
        </div>
      </div>
    </form>
  );
};

export default What;
