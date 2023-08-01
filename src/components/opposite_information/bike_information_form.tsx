import React, { useState, useEffect } from "react";
import { YesNo, Inputfield } from "../custom_inputfields";
import PhoneNumber from "./phone_form";

export class bikeInformation {
  ebike: boolean | undefined;
  personDamage: boolean | undefined;
  phoneNumber: string | undefined;
  email: string | undefined;
  fullName: string | undefined;
}

interface bikeInfoFormProps {
  onchange: (bikeInfo: bikeInformation) => void;
}

export default function BikeInfoForm(props: bikeInfoFormProps) {
  const { onchange } = props;
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [personDamage, setPersonDamage] = useState<boolean>(false);
  const [ebike, setEbike] = useState<boolean>(false);
  const [bikeInfo, setBikeInfo] = useState<bikeInformation>();
  const [phoneNumberData, setPhoneNumberData] = useState<string>("");
  const handlePhoneNumberChange = (phoneNumber: string) => {
    setPhoneNumberData(phoneNumber);
  };
  useEffect(() => {
    const newBikeInfo = new bikeInformation();
    newBikeInfo.fullName = fullName;
    newBikeInfo.phoneNumber = phoneNumber;
    newBikeInfo.email = email;
    newBikeInfo.personDamage = personDamage;
    newBikeInfo.ebike = ebike;

    setBikeInfo(newBikeInfo);
  }, [fullName, phoneNumber, email, personDamage, ebike]);

  useEffect(() => {
    if (bikeInfo) {
      onchange(bikeInfo);
    }
  }, [bikeInfo, onchange]);

  return (
    <div className="flex flex-col items-start">
      <div>
        <YesNo
          required={true}
          id="Ebike"
          labelText="Is it an electric bike?"
          onChange={setEbike}
        />
      </div>
      {ebike && (
        <div>
          <Inputfield
            labelText="Fullname on the opposite person"
            id="FullnameInput"
            required={true}
            type="text"
            onChange={setFullName}
          />
          <PhoneNumber onChangePhoneNumber={handlePhoneNumberChange} />
          <Inputfield
            labelText="Email"
            id="EmailInput"
            required={true}
            type="text"
            onChange={setEmail}
          />
        </div>
      )}
      {!ebike && (
        <div>
          <Inputfield
            labelText="Fullname on the opposite person"
            id="FullnameInput"
            required={true}
            type="text"
            onChange={setFullName}
          />
          <PhoneNumber onChangePhoneNumber={handlePhoneNumberChange} />
          <Inputfield
            labelText="Email"
            id="EmailInput"
            required={true}
            type="text"
            onChange={setEmail}
          />
        </div>
      )}
    </div>
  );
}
