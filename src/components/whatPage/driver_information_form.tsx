import React, { useEffect, useState } from "react";
import { Inputfield } from "../custom_inputfields";
import PhoneNumber from "../opposite_information/phone_form";
import { GoogleMapsField } from "../google_maps_fields";

export class driverInformation {
  firstName: string;
  lastName: string;
  address: string;
  socialSecurityNumber: string;
  drivingLicenseNumber: string;
  phoneNumber: string;
  email: string;
}
import { DriverInformation } from "../../utils/logic";

interface DriverInfoFormProps {
    onChange: (driverInfo: DriverInformation) => void;
}

const DriverInfoForm = ({ onChange}: DriverInfoFormProps) => {
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [address, setAddress] = useState<string>();
    const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>();
    const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>();
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [email, setEmail] = useState<string>();

    const [driverInfo, setDriverInfo] = useState<DriverInformation>()

    useEffect(() => {
        const newDriverInfo = new DriverInformation();
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
      <PhoneNumber />

      {/* TODO: Check if its a real email */}
      <Inputfield
        labelText = "Drivers email"
        id="FirstNameInput"
        required={true}
        type="email"
        onChange={setEmail}
      />
    </div>
  );
;}

export default DriverInfoForm;