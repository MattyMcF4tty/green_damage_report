import React, { useEffect, useState } from "react";
import {
  TimeDateField,
  Inputfield,
  YesNo,
  AddressField,
} from "@/components/inputFields/custom_inputfields";
import { GetServerSidePropsContext, NextPage } from "next";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";
import { useRouter } from "next/router";
import PhoneNumber from "@/components/opposite_information/phoneForm";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { DamageReportPageProps } from "@/utils/schemas/miscSchemas/pagePropsSchema";
import { handleGetRenter } from "@/utils/logic/wunderfleetLogic/apiRoutes";
import { patchCustomerDamageReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { getDamageReport } from "@/utils/logic/damageReportLogic.ts/logic";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const reportId = context.query.id as string;

  const damageReport = new CustomerDamageReport();
  damageReport.updateFields(await getDamageReport(reportId));
  
  if (damageReport.isExpired() || damageReport.isFinished()) {
    return {
      redirect: {
        destination: "/damagereport/reportfinished",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data: damageReport.crypto('decrypt'),
      id: reportId,
    },
  };
};

const What: NextPage<DamageReportPageProps> = ({data, id }) => {
  const router = useRouter();
  const serverData = new CustomerDamageReport();
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
  const [validDriversLicense, setValidDriversLicense] = useState(
    serverData.driverInfo.validDriversLicense
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
  const [invalidTime, setInvalidTime] = useState(false);

  useEffect(() => {
    setInvalidNumberplate(false);
  }, [greenCarNumberplate]);
  useEffect(() => {
    setInvalidTime(false);
  }, [greenCarNumberplate, accidentTime, accidentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllowClick(false);

    const combinedDateTime = `${accidentDate}T${accidentTime}`;
    const date = new Date(combinedDateTime);

    try {
      await handleGetRenter(id, greenCarNumberplate as string, date);
    } catch (error: any) {
      if (error.message === "Car not found") {
        setInvalidNumberplate(true);
      } else if (
        error.message === "No reservations were ongoing at that point in time"
      ) {
        setInvalidTime(true);
      } else {
        console.error(error.message);
      }

      setAllowClick(true);
      return;
    }

    /* TODO: Make function that gets information about current driver from green server */
    if (showDriverInfoForm !== true) {
      console.log(phoneNumber)
      const newDriverInfo = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        socialSecurityNumber: socialSecurityNumber,
        drivingLicenseNumber: drivingLicenseNumber,
        email: email,
        validDriversLicense: validDriversLicense,
      };
      serverData.updateFields({ driverInfo: newDriverInfo });
    }

    serverData.updateFields({
      greenCarNumberPlate: greenCarNumberplate,
      driverRenter: showDriverInfoForm,
      time: accidentTime,
      date: accidentDate,
    });

    try {
      await patchCustomerDamageReport(id, serverData.toPlainObject());
    } catch (error) {
      setAllowClick(true);
      return;
    }

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
          <p className="text-sm text-red-500 mt-[-1rem] mb-4">
            This numberplate does not belong to GreenMobility
          </p>
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

            <YesNo
              id="drivers license"
              labelText="Does the driver have a valid driver license?"
              required={true}
              onChange={setValidDriversLicense}
              value={validDriversLicense}
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
              type="emailPattern"
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
          <p className="text-sm text-red-500 mt-[-1rem] mb-4">
            No reservation exist on the given point in time
          </p>
        )}
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-16 justify-start h-14 mt-4 ml-10">
          <BackButton pageName="/" />
        </div>

        <div className="flex flex-row h-14 mt-4 w-16 justify-end mr-10">
          <NextButton disabled={!allowClick} />
        </div>
      </div>
    </form>
  );
};

export default What;
