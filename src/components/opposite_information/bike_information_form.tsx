import React, { useState, useEffect } from "react";
import { YesNo, Inputfield, TextField } from "../custom_inputfields";
import PhoneNumber from "./phone_form";

export class bikeInformation {
  name: string;
  phone: string;
  email: string;
  ebike: boolean | null;
  personDamage: string;

  constructor(
    name: string,
    phone: string,
    email: string,
    ebike: boolean | null,
    personDamage: string
  ) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.ebike = ebike;
    this.personDamage = personDamage;
  }

  updateFields(fields: Partial<bikeInformation>) {
    Object.assign(this, fields);
  }

  toPlainObject() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      ebike: this.ebike,
      personDamage: this.personDamage,
    };
  }
}

interface bikeInfoFormProps {
  value: bikeInformation;
  onChange: (bikeInfo: bikeInformation) => void;
}

const BikeInfoForm = ({ value, onChange }: bikeInfoFormProps) => {
  const [name, setName] = useState<string>(value.name);
  const [phoneNumber, setPhoneNumber] = useState<string>(value.phone);
  const [email, setEmail] = useState<string>(value.email);
  const [personDamage, setPersonDamage] = useState<string>(value.personDamage);
  const [ebike, setEbike] = useState<boolean | null>(value.ebike);

  useEffect(() => {
    const newBikeInfo = new bikeInformation(
      name,
      phoneNumber,
      email,
      ebike,
      personDamage
    );

    onChange(newBikeInfo);
  }, [name, phoneNumber, email, personDamage, ebike]);

  return (
    <div className="flex flex-col items-start w-full mt-4">
      <div className="w-full">
        <YesNo
          required={true}
          id="Ebike"
          labelText="Was it an electric bike?"
          value={ebike}
          onChange={setEbike}
        />

        <Inputfield
          labelText="Please enter the full name of the party involved"
          id="nameInput"
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
          type="email"
          value={email}
          onChange={setEmail}
          placeHolder="Greenmobility@example.com"
        />

        <TextField
          id="BikePersonDamage"
          maxLength={200}
          labelText="
          If any personal injury has occurred, please describe the injury"
          required={false}
          value={personDamage}
          onChange={setPersonDamage}
        />
      </div>
    </div>
  );
};

export default BikeInfoForm;
