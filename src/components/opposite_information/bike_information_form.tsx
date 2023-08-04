import React, { useState, useEffect } from "react";
import { YesNo, Inputfield, TextField } from "../custom_inputfields";
import PhoneNumber from "./phone_form";

export type bikeInformation = {
  name: string
  phone: string
  email: string
  ebike: boolean | null
  personDamage: string
}

interface bikeInfoFormProps {
  value: bikeInformation
  onchange: (bikeInfo: bikeInformation) => void;
}

const BikeInfoForm = ({value, onchange}: bikeInfoFormProps) => {
  const [name, setName] = useState<string>(value.name);
  const [phoneNumber, setPhoneNumber] = useState<string>(value.phone);
  const [email, setEmail] = useState<string>(value.email);
  const [personDamage, setPersonDamage] = useState<string>(value.personDamage);
  const [ebike, setEbike] = useState<boolean | null>(value.ebike);

  useEffect(() => {
    const newBikeInfo:bikeInformation = {
      name: name,
      phone: phoneNumber,
      email: email,
      personDamage: personDamage,
      ebike: ebike
    };

    onchange(newBikeInfo);
  }, [name, phoneNumber, email, personDamage, ebike]);

  return (
    <div className="flex flex-col items-start">
        <YesNo
          required={true}
          id="Ebike"
          labelText="Is it an electric bike?"
          value={ebike}
          onChange={setEbike}
        />
          
        <Inputfield
          labelText="Fullname on the opposite person"
          id="nameInput"
          required={true}
          type="text"
          value={name}
          onChange={setName}
        />

        {/* TODO: FIX <PhoneNumber onchange={setPhoneNumber} /> */}
        <Inputfield
          labelText="Email"
          id="EmailInput"
          required={true}
          type="text"
          value={email}
          onChange={setEmail}
        />

        <TextField 
          id="BikePersonDamage"
          maxLength={200}
          labelText="Descripe the damage to the person"
          required={true}
          value={personDamage}
          onChange={setPersonDamage}
        />
    </div>
  );
}

export default BikeInfoForm;