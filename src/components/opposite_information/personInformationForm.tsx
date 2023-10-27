import React, { useState, useEffect } from "react";
import PhoneNumber from "./phoneForm";
import { Inputfield, TextField } from "../customeInputfields/custom_inputfields";
import { Pedestrian } from "@/utils/schemas/incidentDetailSchemas/pedestrianSchema";

interface PedestrianProps {
  value: Pedestrian;
  onChange: (pedestrianInfo: Pedestrian) => void;
}

const PedestrianInfoForm = ({ value, onChange }: PedestrianProps) => {
  const [name, setName] = useState<string | null>(value.name);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(value.phone);
  const [email, setEmail] = useState<string | null>(value.email);
  const [personDamage, setPersonDamage] = useState<string | null>(
    value.personDamage
  );

  useEffect(() => {
    const newPedestrianInfo: Pedestrian = new Pedestrian(
      name,
      phoneNumber,
      email,
      personDamage
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
        type="emailPattern"
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
