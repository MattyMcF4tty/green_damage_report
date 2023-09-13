import React, { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import PhoneNumber from "./phone_form";
import { Inputfield } from "../custom_inputfields";

export class carInformation {
  name: string;
  phone: string;
  email: string;
  driversLicenseNumber: string;
  insurance: string;
  numberplate: string;
  model: string;
  location: { lat: number | null; lng: number | null };

  constructor(
    name: string,
    phone: string,
    email: string,
    driversLicenseNumber: string,
    insurance: string,
    numberplate: string,
    model: string,
    location: { lat: number | null; lng: number | null }
  ) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.driversLicenseNumber = driversLicenseNumber;
    this.insurance = insurance;
    this.numberplate = numberplate;
    this.model = model;
    this.location = location;
  }

  updateFields(fields: Partial<carInformation>) {
    Object.assign(this, fields);
  }

  toPlainObject() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      driversLicenseNumber: this.driversLicenseNumber,
      insurance: this.insurance,
      numberplate: this.numberplate,
      model: this.model,
      location: this.location,
    };
  }
}

interface carInfoFormProps {
  value: carInformation;
  onChange: (carInfo: carInformation) => void;
}

const CarInfoForm = ({ value, onChange }: carInfoFormProps) => {
  const [numberplate, setNumberplate] = useState<string>(value.numberplate);
  const [model, setModel] = useState<string>(value.model);
  const [name, setName] = useState<string>(value.name);
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>(
    value.driversLicenseNumber
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(value.phone);
  const [email, setEmail] = useState<string>(value.email);
  const [insurance, setInsurance] = useState<string>(value.insurance);

  useEffect(() => {
    const newCarInfo: carInformation = new carInformation(
      name,
      phoneNumber,
      email,
      drivingLicenseNumber,
      insurance,
      numberplate,
      model,
      { lat: null, lng: null }
    );

    onChange(newCarInfo);
  }, [
    name,
    numberplate,
    model,
    drivingLicenseNumber,
    phoneNumber,
    email,
    insurance,
    onChange, // Add onChange as a dependency for useEffect
  ]);

  return (
    <div className="flex flex-col mt-4">
      <Inputfield
        labelText="
        Please enter the license plate of the party involved"
        id="NumberPlateInput"
        required={true}
        type="text"
        value={numberplate}
        onChange={setNumberplate}
        placeHolder="DR12345"
      />
      <Inputfield
        labelText="
        Please enter the car model of the party involved"
        id="ModelInput"
        required={true}
        type="text"
        value={model}
        onChange={setModel}
        placeHolder="Renault Zoe"
      />
      <Inputfield
        labelText="
        Please enter the full name of the party involved"
        id="FullnameInput"
        required={true}
        type="text"
        value={name}
        onChange={setName}
        placeHolder="John Doe"
      />
      <PhoneNumber
        value={phoneNumber}
        onChange={setPhoneNumber}
        labelText="Please enter the phone number of the party involved"
      />
      <Inputfield
        labelText="Please enter the email address of the party involved"
        id="EmailInput"
        required={false}
        type="text"
        value={email}
        onChange={setEmail}
        placeHolder="Greenmobility@example.com"
      />
      <Inputfield
        labelText="Please enter the driver license number of the party involved"
        id="DriversLicenseNumberInput"
        required={false}
        type="text"
        value={drivingLicenseNumber}
        onChange={setDrivingLicenseNumber}
        placeHolder="12345678"
      />
      <Inputfield
        labelText="Please enter the insurance details of the party involved"
        id="InsuranceInput"
        required={false}
        type="text"
        value={insurance}
        onChange={setInsurance}
        placeHolder="Your insurance..."
      />
    </div>
  );
};

export default CarInfoForm;
