import React, { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import PhoneNumber from "./phoneForm";
import { Inputfield } from "../inputFields/custom_inputfields";
import { Vehicle } from "@/utils/schemas/incidentDetailSchemas/vehicleSchema";

interface carInfoFormProps {
  value: Vehicle;
  onChange: (carInfo: Vehicle) => void;
}

const CarInfoForm = ({ value, onChange }: carInfoFormProps) => {
  const [numberplate, setNumberplate] = useState<string | null>(
    value.numberplate
  );
  const [model, setModel] = useState<string | null>(value.model);
  const [name, setName] = useState<string | null>(value.name);
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<
    string | null
  >(value.driversLicenseNumber);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(value.phone);
  const [email, setEmail] = useState<string | null>(value.email);
  const [insurance, setInsurance] = useState<string | null>(value.insurance);

  useEffect(() => {
    const newCarInfo: Vehicle = new Vehicle(
      name,
      phoneNumber,
      email,
      drivingLicenseNumber,
      insurance,
      numberplate,
      model
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
        type="numberplate"
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
        type="emailPattern"
        value={email}
        onChange={setEmail}
        placeHolder="Greenmobility@example.com"
      />
      <Inputfield
        labelText="Please enter the driver license number of the party involved"
        id="DriversLicenseNumberInput"
        required={false}
        type="license"
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
        placeHolder="Insurance company"
      />
    </div>
  );
};

export default CarInfoForm;
