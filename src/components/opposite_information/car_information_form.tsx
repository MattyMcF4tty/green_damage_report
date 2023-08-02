import React, { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import PhoneNumber from "./phone_form";
import { Inputfield } from "../custom_inputfields";

export class carInformation {
  numberplate: string | undefined;
  model: string | undefined;
  color: string | undefined;
  fullName: string | undefined;
  phoneNumber: string | undefined;
  email: string | undefined;
  drivingLicenseNumber: string | undefined;
  insurance: string | undefined;
}

interface carInfoFormProps {
  onChange: (carInfo: carInformation) => void;
}

export default function CarInfoForm(props: carInfoFormProps) {
  const { onChange } = props;
  const [numberplate, setNumberplate] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [insurance, setInsurance] = useState<string>("");

  useEffect(() => {
    const newCarInfo = new carInformation();
    newCarInfo.numberplate = numberplate;
    newCarInfo.model = model;
    newCarInfo.color = color;
    newCarInfo.fullName = fullName;
    newCarInfo.drivingLicenseNumber = drivingLicenseNumber;
    newCarInfo.phoneNumber = phoneNumber; // Convert to number if needed
    newCarInfo.email = email;
    newCarInfo.insurance = insurance;

    onChange(newCarInfo); // Call onChange with the updated car information
  }, [
    fullName,
    numberplate,
    model,
    color,
    drivingLicenseNumber,
    phoneNumber,
    email,
    insurance,
    onChange, // Add onChange as a dependency for useEffect
  ]);

  return (
    <div className="flex flex-col">
      <Inputfield
        labelText="Numberplate on other car"
        id="NumberPlateInput"
        required={true}
        type="numberplate"
        onChange={setNumberplate}
      />
      <Inputfield
        labelText="Model of the car"
        id="ModelInput"
        required={true}
        type="text"
        onChange={setModel}
      />
      <Inputfield
        labelText="Color of the car"
        id="ColorInput"
        required={true}
        type="text"
        onChange={setColor}
      />
      <Inputfield
        labelText="Fullname on the opposite person"
        id="FullnameInput"
        required={true}
        type="text"
        onChange={setFullName}
      />
      <PhoneNumber value={phoneNumber} onChange={setPhoneNumber} />
      <Inputfield
        labelText="Email"
        id="EmailInput"
        required={true}
        type="email"
        onChange={setEmail}
      />
      <Inputfield
        labelText="Drivers license number"
        id="DriversLicenseNumberInput"
        required={true}
        type="license"
        onChange={setDrivingLicenseNumber}
      />
      <Inputfield
        labelText="Insurance"
        id="InsuranceInput"
        required={true}
        type="text"
        onChange={setInsurance}
      />
    </div>
  );
}
