import React, { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import PhoneNumber from "./phone_form";
import { Inputfield } from "../custom_inputfields";

export type carInformation = {
  name: string;
  phone: string;
  email: string;
  driversLicenseNumber: string;
  insurance: string;
  numberplate: string;
  color: string;
  model: string;
};

interface carInfoFormProps {
  value: carInformation;
  onChange: (carInfo: carInformation) => void;
}

const CarInfoForm = ({ value, onChange }: carInfoFormProps) => {
  const [numberplate, setNumberplate] = useState<string>(value.numberplate);
  const [model, setModel] = useState<string>(value.model);
  const [color, setColor] = useState<string>(value.color);
  const [name, setName] = useState<string>(value.name);
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>(
    value.driversLicenseNumber
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(value.phone);
  const [email, setEmail] = useState<string>(value.email);
  const [insurance, setInsurance] = useState<string>(value.insurance);

  useEffect(() => {
    const newCarInfo: carInformation = {
      name: name,
      phone: phoneNumber,
      email: email,
      insurance: insurance,
      driversLicenseNumber: drivingLicenseNumber,
      numberplate: numberplate,
      color: color,
      model: model,
    };

    onChange(newCarInfo);
  }, [
    name,
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
    <div className="flex flex-col w-full">
      <Inputfield
        labelText="Numberplate on other car"
        id="NumberPlateInput"
        required={true}
        type="text"
        value={numberplate}
        onChange={setNumberplate}
      />
      <Inputfield
        labelText="Model of the car"
        id="ModelInput"
        required={true}
        type="text"
        value={model}
        onChange={setModel}
      />
      <Inputfield
        labelText="Color of the car"
        id="ColorInput"
        required={true}
        type="text"
        value={color}
        onChange={setColor}
      />
      <Inputfield
        labelText="Fullname on the opposite person"
        id="FullnameInput"
        required={true}
        type="text"
        value={name}
        onChange={setName}
      />
      <PhoneNumber value={phoneNumber} onChange={setPhoneNumber} />
      <Inputfield
        labelText="Email"
        id="EmailInput"
        required={true}
        type="text"
        value={email}
        onChange={setEmail}
      />
      <Inputfield
        labelText="Drivers license number"
        id="DriversLicenseNumberInput"
        required={true}
        type="text"
        value={drivingLicenseNumber}
        onChange={setDrivingLicenseNumber}
      />
      <Inputfield
        labelText="Insurance"
        id="InsuranceInput"
        required={true}
        type="text"
        value={insurance}
        onChange={setInsurance}
      />
    </div>
  );
};

export default CarInfoForm;
