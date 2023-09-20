import React, { useEffect, useState, useRef } from "react";
import {
  TimeDateField,
  Inputfield,
  YesNo,
  AddressField,
} from "@/components/custom_inputfields";
import { GetServerSidePropsContext, NextPage } from "next";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";
import { useRouter } from "next/router";
import { updateData } from "@/firebase/clientApp";
import {
  getServerSidePropsWithRedirect,
  handleGetRenter,
  pageProps,
  reportDataType,
} from "@/utils/utils";
import PhoneNumber from "@/components/opposite_information/phone_form";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getServerSidePropsWithRedirect(context);
};

const What: NextPage<pageProps> = ({ data, id }) => {
  const router = useRouter();
  const serverData = new reportDataType();
  serverData.updateFields(data);

  const [firstName, setFirstName] = useState(serverData.driverInfo.firstName);
  const [lastName, setLastName] = useState(serverData.driverInfo.lastName);
  const [address, setAddress] = useState(serverData.driverInfo.address);
  const [socialSecurityNumber, setSocialSecurityNumber] = useState(
    serverData.driverInfo.socialSecurityNumber
  );
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState(
    serverData.driverInfo.drivingLicenseNumber
  );
  const [phoneNumber, setPhoneNumber] = useState(
    serverData.driverInfo.phoneNumber
  );
  const [email, setEmail] = useState(serverData.driverInfo.email);

  const [greenCarNumberplate, setgreenCarNumberplate] = useState(
    serverData.greenCarNumberPlate
  );
  const [showDriverInfoForm, setShowDriverInfoForm] = useState(
    serverData.driverRenter
  );
  const [accidentTime, setAccidentTime] = useState(serverData.time);
  const [accidentDate, setAccidentDate] = useState(serverData.date);
  const [allowClick, setAllowClick] = useState(true);

  const [invalidNumberplate, setInvalidNumberplate] = useState(false);
  const [invalidTime, setInvalidTime] = useState(false)

  useEffect(() => {
    setInvalidNumberplate(false)
  }, [greenCarNumberplate])

  useEffect(() => {
    setInvalidTime(false)
  }, [greenCarNumberplate, accidentTime, accidentDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllowClick(false);

    const combinedDateTime = `${accidentDate}T${accidentTime}`;
    const date = new Date(combinedDateTime);

    let renter;
    try {
      renter = await handleGetRenter(greenCarNumberplate as string, date);
    } catch (error: any) {
      if (error.message === "Car not found") {
        setInvalidNumberplate(true)
      } else if (error.message === "No reservations were found on given date") {
        setInvalidTime(true)
      } else {
        console.log(error.message)
      }

      setAllowClick(true);
      return
    }
    console.log(renter)
    serverData.updateFields({ renterInfo: renter });

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
      };
      serverData.updateFields({ driverInfo: newDriverInfo });
    } else {
      const newDriverInfo = {
        firstName: renter.firstName,
        lastName: renter.lastName,
        address: null,
        phoneNumber: null,
        socialSecurityNumber: null,
        drivingLicenseNumber: null,
        email: null,
      };
      serverData.updateFields({ driverInfo: newDriverInfo });
    }

    serverData.updateFields({
      greenCarNumberPlate: greenCarNumberplate,
      driverRenter: showDriverInfoForm,
      time: accidentTime,
      date: accidentDate,
    });

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
        <p className="text-MainGreen-300 mb-8 flex justify-start font-bold text-[20px]">
          Initial Event Inquiry
        </p>
      </div>

      <div className="mb-2">
        <Inputfield
            labelText="
            Please enter the license plate of the GreenMobility car"
            id="greenCarNumberplateInput"
            type="text"
            required={true}
            value={greenCarNumberplate}
            onChange={setgreenCarNumberplate}
            placeHolder="DR12345"
          />
          {invalidNumberplate && (
            <p className="text-sm text-red-500 mt-[-1rem] mb-4">This numberplate does not belong to GreenMobility</p>
          )}
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
              labelText="Please enter the first name of the driver"
              id="FirstNameInput"
              required={true}
              type="text"
              value={firstName}
              onChange={setFirstName}
              placeHolder="John"
            />
            <Inputfield
              labelText="Please enter the last name of the driver"
              id="LastNameInput"
              required={true}
              type="text"
              value={lastName}
              onChange={setLastName}
              placeHolder="Doe"
            />
            <AddressField
              labelText="Please enter the home address of the driver"
              value={address}
              onChange={setAddress}
            />
            <Inputfield
              labelText="Please enter the social security number of the driver"
              id="SocialSecurityNumberInput"
              required={false}
              type="ssn"
              value={socialSecurityNumber}
              onChange={setSocialSecurityNumber}
              placeHolder="123456-1234"
            />

            <Inputfield
              labelText="Please enter the driving license number of the driver"
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
              labelText="Please enter the phonenumber of the driver"
            />
            <Inputfield
              labelText="Please enter the email of the driver"
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
          labelText="Please enter the date and the time the accident occurred"
          id="Accident"
          required={true}
          timeChange={setAccidentTime}
          dateChange={setAccidentDate}
          timeValue={accidentTime}
          dateValue={accidentDate}
        />
        {invalidTime && (
            <p className="text-sm text-red-500 mt-[-1rem] mb-4">No reservation exist on the given point in time</p>
        )}
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-16 justify-start h-14 mt-4 ml-10">
          <BackButton pageName="/" />
        </div>

        <div className="flex flex-row h-14 mt-4 w-16 justify-end mr-10">
          <NextButton allowClick={allowClick} />
        </div>
      </div>
    </form>
  );
};

export default What;
