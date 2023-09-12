import React, { useEffect, useState } from "react";
import {
  TimeDateField,
  Inputfield,
  YesNo,
  AddressField
} from "@/components/custom_inputfields";
import { GetServerSidePropsContext, NextPage } from "next";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";
import { useRouter } from "next/router";
import { updateData } from "@/firebase/clientApp";
import { decryptData, getServerSidePropsWithRedirect, pageProps, reportDataType } from "@/utils/utils";
import PhoneNumber from "@/components/opposite_information/phone_form";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getServerSidePropsWithRedirect(context)
};

const What: NextPage<pageProps> = ({ data, id }) => {
  const router = useRouter();
  const serverData = new reportDataType();
  serverData.updateFields(data)

  const [firstName, setFirstName] = useState(serverData.driverInfo.firstName);
  const [lastName, setLastName] = useState(serverData.driverInfo.lastName);
  const [address, setAddress] = useState(serverData.driverInfo.address);
  const [socialSecurityNumber, setSocialSecurityNumber] = useState(serverData.driverInfo.socialSecurityNumber);
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState(serverData.driverInfo.drivingLicenseNumber);
  const [phoneNumber, setPhoneNumber] = useState(serverData.driverInfo.phoneNumber);
  const [email, setEmail] = useState(serverData.driverInfo.email);

  const [greenCarNumberplate, setgreenCarNumberplate] = useState(serverData.greenCarNumberPlate);
  const [showDriverInfoForm, setShowDriverInfoForm] = useState(serverData.driverRenter);
  const [accidentTime, setAccidentTime] = useState(serverData.time);
  const [accidentDate, setAccidentDate] = useState(serverData.date);
  const [allowClick, setAllowClick] = useState(true);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllowClick(false);
    

    /* TODO: Make function that gets information about current driver from green server */
    if (showDriverInfoForm !== true) {
      const newDriverInfo = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        socialSecurityNumber: socialSecurityNumber,
        drivingLicenseNumber: drivingLicenseNumber,
        email: email,
      }
      serverData.updateFields({driverInfo: newDriverInfo})
    } else {
      const newDriverInfo = {
        firstName: "John",
        lastName: "Doe",
        address: "Landgreven, 3, 31301, København",
        phoneNumber: "+00 00 00 00 00",
        socialSecurityNumber: "000000-0000",
        drivingLicenseNumber: "00000000",
        email: "JohnDoe@placeholder.com",
      }
      serverData.updateFields({driverInfo: newDriverInfo})
    }

    serverData.updateFields({
      greenCarNumberPlate: greenCarNumberplate,
      driverRenter: showDriverInfoForm,
      time: accidentTime,
      date: accidentDate,
    })

    await updateData(id, serverData);

    router.push(`how?id=${id}`);
  };


  return (
    <form
      name="viewport"
      content="width=device-width, initial-scale=1.0"
      className="w-full"
      onSubmit={(e) => handleSubmit(e)}
    >
      {/* GreenMobility car numberplate collection */}
      <div>
        {/* TODO: Make it so you can only type a valid numberplate for the country where the accident took place and get a list from a server with all the green numberplates */}
        <p className="text-MainGreen-300 mb-8 flex justify-start font-bold text-[20px]">
          Initial Event Inquiry
        </p>
        <Inputfield
          labelText="
          The license plate of the GreenMobility car"
          id="greenCarNumberplateInput"
          type="numberplate"
          required={true}
          value={greenCarNumberplate}
          onChange={setgreenCarNumberplate}
          placeHolder="DR12345"
        />
      </div>

      {/* Driver information collection */}
      <div className="">
        <YesNo
          labelText="

          Was the driver the same person as the renter?"
          id="ShowDriverInfoForm"
          required={true}
          value={showDriverInfoForm}
          onChange={setShowDriverInfoForm}
        />

        {!showDriverInfoForm && showDriverInfoForm !== null && (
          <div className="flex flex-col">
            <Inputfield
              labelText="First name of the driver"
              id="FirstNameInput"
              required={true}
              type="text"
              value={firstName}
              onChange={setFirstName}
              placeHolder="John"
            />

            <Inputfield
              labelText="Last name of the driver"
              id="LastNameInput"
              required={true}
              type="text"
              value={lastName}
              onChange={setLastName}
           placeHolder="Doe"
           />
            {/* TODO: make google autofill */}
            <AddressField
              labelText="Home address of the driver"
              value={address}
              onChange={setAddress}
            />

            {/* TODO: Check if its a real phone number */}
            <Inputfield
              labelText="Social security number of the driver"
              id="SocialSecurityNumberInput"
              required={false}
              type="ssn"
              value={socialSecurityNumber}
              onChange={setSocialSecurityNumber}
            placeHolder="123456-1234"
            />

            <Inputfield
              labelText="Driving license number of the driver"
              id="DrivingLicenseNumberInput"
              required={false}
              type="license"
              value={drivingLicenseNumber}
              onChange={setDrivingLicenseNumber}
              placeHolder="12345678"
            />

            <PhoneNumber
              value={phoneNumber}
              onChange={setPhoneNumber}
              labelText="Phonenumber of the driver"
            />

            <Inputfield
              labelText="Email of the driver"
              id="EmailInput"
              required={true}
              type="email"
              value={email}
              onChange={setEmail}
              placeHolder="Greenmobility@example.com"
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
          timeValue={accidentTime}
          dateValue={accidentDate}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-16 justify-start h-14 mt-4 ml-10">
          <BackButton pageName="/" />
        </div>

        <div className="flex flex-row h-14 mt-4 w-16 justify-end mr-10">
          <NextButton allowClick={allowClick}/>
        </div>
      </div>
    </form>
  );
};

export default What;
