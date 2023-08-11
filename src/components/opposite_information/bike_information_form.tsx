import React, { useState, useEffect } from "react";
import { YesNo, Inputfield, TextField } from "../custom_inputfields";
import PhoneNumber from "./phone_form";

export type bikeInformation = {
  name: string;
  phone: string;
  email: string;
  ebike: boolean | null;
  personDamage: string;
};

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

  /*   const [phoneNumberData, setPhoneNumberData] = useState<string>("");
  const handlePhoneNumberChange = (phoneNumber: string) => {
    setPhoneNumberData(phoneNumber);
  };
 */

  useEffect(() => {
    const newBikeInfo: bikeInformation = {
      name: name,
      phone: phoneNumber,
      email: email,
      personDamage: personDamage,
      ebike: ebike,
    };

    onChange(newBikeInfo);
  }, [name, phoneNumber, email, personDamage, ebike]);

  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full">
        <YesNo
          required={true}
          id="Ebike"
          labelText="Is it an electric bike?"
          value={ebike}
          onChange={setEbike}
        />

        <Inputfield
          labelText="Fullname of the other person involved"
          id="nameInput"
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
          labelText="Email address of the other person"
          id="EmailInput"
          required={false}
          type="text"
          value={email}
          onChange={setEmail}
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
