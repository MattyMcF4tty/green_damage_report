import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import PhoneNumber from "./phone_form";
import { Inputfield } from "../custom_inputfields";

export class carInformation {
  numberplate: string;
  model: string;
  color: string;
  fullName: string;
  phoneNumber: number;
  email: string;
  drivingLicenseNumber: string;
  insurance: string;
}

interface carInfoFormProps {
  onchange: (carInfo: carInformation) => void;
}

export default function CarInfoForm(props: carInfoFormProps) {
  const { onchange } = props;
  const [numberplate, setNumberplate] = useState<string>();
  const [model, setModel] = useState<string>();
  const [color, setColor] = useState<string>();
  const [fullName, setFullName] = useState<string>();
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [email, setEmail] = useState<string>();
  const [insurance, setInsurance] = useState<string>();
  const [carInfo, setCarInfo] = useState<carInformation>();

  useEffect(() => {
    const newCarInfo = new carInformation();
    newCarInfo.numberplate = numberplate;
    newCarInfo.model = model;
    newCarInfo.color = color;
    newCarInfo.fullName = fullName;
    newCarInfo.drivingLicenseNumber = drivingLicenseNumber;
    newCarInfo.phoneNumber = phoneNumber;
    newCarInfo.email = email;
    newCarInfo.insurance = insurance;

    setCarInfo(newCarInfo);
  }, [
    fullName,
    numberplate,
    model,
    color,
    drivingLicenseNumber,
    phoneNumber,
    email,
    insurance,
  ]);

  useEffect(() => {
    onchange(carInfo);
  }, [carInfo, onchange]);

  return (
    <div className="flex flex-col ">
      <Inputfield
        labelText="Numberplate on other car"
        id="NumberPlateInput"
        required={true}
        type="text"
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
      <PhoneNumber />
      <Inputfield
        labelText="Email"
        id="EmailInput"
        required={true}
        type="text"
        onChange={setEmail}
      />
      <Inputfield
        labelText="Drivers license number"
        id="DriversLicenseNumberInput"
        required={true}
        type="text"
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
