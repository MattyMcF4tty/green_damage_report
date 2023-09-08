import React, { useState, useEffect } from "react";
import PhoneNumber from "./phone_form";
import { Inputfield, TextField } from "../custom_inputfields";

export class PedestrianInformation {
  name: string;
  phone: string;
  email: string;
  personDamage: string;
  location: { lat: number | null; lng: number | null };

  constructor(
    name: string,
    phone: string,
    email: string,
    personDamage: string,
    location: { lat: number | null; lng: number | null }
  ) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.personDamage = personDamage;
    this.location = location;
  }

  updateFields(fields: Partial<PedestrianInformation>) {
    Object.assign(this, fields);
  }

  toPlainObject() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      personDamage: this.personDamage,
      location: this.location,
    };
  }
}

interface PedestrianProps {
  value: PedestrianInformation;
  onChange: (pedestrianInfo: PedestrianInformation) => void;
}

const PedestrianInfoForm = ({ value, onChange }: PedestrianProps) => {
  const [name, setName] = useState<string>(value.name);
  const [phoneNumber, setPhoneNumber] = useState<string>(value.phone);
  const [email, setEmail] = useState<string>(value.email);
  const [personDamage, setPersonDamage] = useState<string>(value.personDamage);

  useEffect(() => {
    const newPedestrianInfo: PedestrianInformation = new PedestrianInformation(
      name,
      phoneNumber,
      email,
      personDamage,
      { lat: null, lng: null }
    );

    onChange(newPedestrianInfo);
  }, [name, phoneNumber, email, personDamage]);

  return (
    <div className="flex flex-col w-full mt-4">
      <Inputfield
        id="NamePedestrian"
        labelText="Please enter the full name of the party involved"
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
        id="EmailPedestrian"
        labelText="Please enter the email adress of the party involved"
        required={false}
        type="text"
        value={email}
        onChange={setEmail}
        placeHolder="Greenmobility@example.com"
      />

      <TextField
        id="personDamage"
        labelText="
        If any personal injury has occurred, please describe the injury"
        maxLength={200}
        required={false}
        value={personDamage}
        onChange={setPersonDamage}
      />
    </div>
  );
};

export default PedestrianInfoForm;
