import React, { useState, useEffect } from "react";
import PhoneNumber from "./phone_form";
import { Inputfield, TextField } from "../custom_inputfields";

export type PedestrianInformation = {
  name: string;
  phone: string;
  email: string;
  personDamage: string;
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
    <div className="flex flex-col">
      <Inputfield
        id="NamePedestrian"
        labelText="Name of the pedestrian"
        required={true}
        type="text"
        value={name}
        onChange={setName}
      />
      <PhoneNumber value={phoneNumber} onChange={setPhoneNumber} />
      <Inputfield
        id="EmailPedestrian"
        labelText="Email of the pedestrian"
        required={true}
        type="text"
        value={email}
        onChange={setEmail}
      />

      <TextField
        id="personDamage"
        labelText="Descripe the damages to the person"
        maxLength={200}
        required={true}
        value={personDamage}
        onChange={setPersonDamage}
      />
    </div>
  );
};

export default PedestrianInfoForm;
