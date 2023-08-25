import React, { useState, useEffect } from "react";
import PhoneNumber from "./phone_form";
import { Inputfield, TextField } from "../custom_inputfields";

export class PedestrianInformation {
  name: string;
  phone: string;
  email: string;
  personDamage: string;

  constructor (
    name: string,
    phone: string,
    email: string,
    personDamage: string,
  ) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.personDamage = personDamage;
  }
};

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
    const newPedestrianInfo: PedestrianInformation = {
      name: name,
      phone: phoneNumber,
      email: email,
      personDamage: personDamage,
    };

    onChange(newPedestrianInfo);
  }, [name, phoneNumber, email, personDamage]);

  return (
    <div className="flex flex-col w-full mt-4">
      <Inputfield
        id="NamePedestrian"
        labelText="Fullname of the other person involved"
        required={true}
        type="text"
        value={name}
        onChange={setName}
      />
      <PhoneNumber
        value={phoneNumber}
        onChange={setPhoneNumber}
        labelText="Phone number of the other person involved"
      />
      <Inputfield
        id="EmailPedestrian"
        labelText="Email adress of the other person"
        required={false}
        type="text"
        value={email}
        onChange={setEmail}
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
