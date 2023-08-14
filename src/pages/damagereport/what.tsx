import React, { useEffect, useState } from "react";
import {
  TimeDateField,
  Inputfield,
  YesNo,
} from "@/components/custom_inputfields";
import { GetServerSidePropsContext, NextPage } from "next";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";
import { useRouter } from "next/router";
import { getData, updateData } from "@/firebase/clientApp";
import { pageProps } from "@/utils/utils";
import PhoneNumber from "@/components/opposite_information/phone_form";
import AddressField from "@/components/google_autofill";

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

const What: NextPage<pageProps> = ({ data, id }) => {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>(
    data?.driverInfo.firstName || ""
  );
  const [lastName, setLastName] = useState<string>(
    data?.driverInfo.lastName || ""
  );
  const [address, setAddress] = useState<string>(
    data?.driverInfo.address || ""
  );
  const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>(
    data?.driverInfo.socialSecurityNumber || ""
  );
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>(
    data?.driverInfo.drivingLicenseNumber || ""
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    data?.driverInfo.phoneNumber || ""
  );
  const [email, setEmail] = useState<string>(data?.driverInfo.email || "");

  const [greenCarNumberplate, setgreenCarNumberplate] = useState<string>(
    data?.greenCarNumberPlate || ""
  );
  const [showDriverInfoForm, setShowDriverInfoForm] = useState<boolean | null>(
    data!.driverRenter
  );
  const [accidentTime, setAccidentTime] = useState<string>(data?.time || "");
  const [accidentDate, setAccidentDate] = useState<string>(data?.date || "");
  const [accidentLocation, setAccidentLocation] = useState<string>(
    data?.accidentLocation || ""
  );

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
        email: email,
      },

      greenCarNumberPlate: greenCarNumberplate,
      time: accidentTime,
      date: accidentDate,
      accidentLocation: accidentLocation,

      driverRenter: showDriverInfoForm,
    };
    await updateData(id, data);

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
            />

            <Inputfield
              labelText="Last name of the driver"
              id="LastNameInput"
              required={true}
              type="text"
              value={lastName}
              onChange={setLastName}
            />

            {/* TODO: make google autofill */}
            <AddressField labelText="Home address of the driver" />

            {/* TODO: Check if its a real phone number */}
            <Inputfield
              labelText="Social security number of the driver"
              id="SocialSecurityNumberInput"
              required={false}
              type="ssn"
              value={socialSecurityNumber}
              onChange={setSocialSecurityNumber}
            />

            <Inputfield
              labelText="Driving license number of the driver"
              id="DrivingLicenseNumberInput"
              required={false}
              type="license"
              value={drivingLicenseNumber}
              onChange={setDrivingLicenseNumber}
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

      {/* Accident location collection */}
      <div>
        <AddressField labelText="Where did the accident occur?" />
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-16 justify-start h-14 mt-4 ml-10">
          <BackButton pageName="/" />
        </div>

        <div className="flex flex-row h-14 mt-4 w-16 justify-end mr-10">
          <NextButton />
        </div>
      </div>
    </form>
  );
};

export default What;
