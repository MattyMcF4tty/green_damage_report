import React, { useEffect, useState } from "react";
import { Inputfield } from "../custom_inputfields";
import PhoneNumber from "../opposite_information/phone_form";
import { AccidentInformation } from "@/utils/utils";

interface DriverInfoFormProps {
  onChange: (driverInfo: AccidentInformation) => void;
}

const DriverInfoForm = ({ onChange }: DriverInfoFormProps) => {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>();
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [email, setEmail] = useState<string>();

  const [driverInfo, setDriverInfo] = useState<AccidentInformation>(
    new AccidentInformation()
  );
  const [phoneNumberData, setPhoneNumberData] = useState<string>("");
  const handlePhoneNumberChange = (phoneNumber: string) => {
    setPhoneNumberData(phoneNumber);
  };

  useEffect(() => {
    const newDriverInfo = new AccidentInformation();
    newDriverInfo.firstName = firstName;
    newDriverInfo.lastName = lastName;
    newDriverInfo.address = address;
    newDriverInfo.socialSecurityNumber = socialSecurityNumber;
    newDriverInfo.drivingLicenseNumber = drivingLicenseNumber;
    newDriverInfo.phoneNumber = phoneNumber;
    newDriverInfo.email = email;

    setDriverInfo(newDriverInfo);
  }, [
    firstName,
    lastName,
    address,
    socialSecurityNumber,
    drivingLicenseNumber,
    phoneNumber,
    email,
  ]);

  useEffect(() => {
    onChange(driverInfo);
  }, [driverInfo, onChange]);

  return (
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
        type="ssn"
        onChange={setSocialSecurityNumber}
      />

      <Inputfield
        labelText="Drivers driving license number"
        id="DrivingLicenseNumberInput"
        required={true}
        type="license"
        onChange={setDrivingLicenseNumber}
      />

      {/* TODO: Check if its a real phone number */}
      <PhoneNumber value={phoneNumber} onChange={setPhoneNumber} />

      {/* TODO: Check if its a real email */}
      <Inputfield
        labelText="Drivers email"
        id="FirstNameInput"
        required={true}
        type="email"
        onChange={setEmail}
      />
    </div>
  );
};

export default DriverInfoForm;
