import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect } from "react";
import { YesNo } from "../custom_inputfields";
import { Inputfield } from "../custom_inputfields";
import PhoneNumber from "./phone_form";
import PhoneInput from "react-phone-input-2";

export class bikeInformation {
  ebike: boolean;
  personDamage: boolean;
  fullName: string;
  phoneNumber: number;
  email: string;
}
interface bikeInfoFormProps {
  onchange: (carInfo: bikeInformation) => void;
}

export default function BikeInfoForm(props: bikeInfoFormProps) {
  const { onchange } = props;
  const [fullName, setFullName] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [email, setEmail] = useState<string>();
  const [bikeInfo, setBikeInfo] = useState<bikeInformation>();
  const [personDamage, setPersonDamage] = useState<boolean>();
  const [ebike, setIsEbike] = useState<boolean>();

  useEffect(() => {
    const newBikeInfo = new bikeInformation();
    newBikeInfo.fullName = fullName;
    newBikeInfo.phoneNumber = phoneNumber;
    newBikeInfo.email = email;
    newBikeInfo.personDamage = personDamage;
    newBikeInfo.ebike = ebike;

    setBikeInfo(newBikeInfo);
  }, [ebike, fullName, phoneNumber, email, personDamage]);

  useEffect(() => {
    onchange(bikeInfo);
  }, [bikeInfo, onchange]);

  const [isEbikeChecked, setIsEbikeChecked] = useState(true);

  return (
    <div className="flex flex-col items-start">
      <div className="">
        <YesNo
          required={true}
          id="Ebike"
          labelText="Is it an electric bike?"
          onChange={setIsEbikeChecked}
        />
      </div>
      {isEbikeChecked && (
        <div>
          <Inputfield
            labelText="Fullname on the opposite person"
            id="FullnameInput"
            required={true}
            type="text"
            onChange={setFullName}
          />
          <PhoneNumber />
          <Inputfield
            labelText="Email"
            id="EmailInput"
            required={true}
            type="text"
            onChange={setEmail}
          />
        </div>
      )}
      {!isEbikeChecked && (
        <div>
          <Inputfield
            labelText="Fullname on the opposite person"
            id="FullnameInput"
            required={true}
            type="text"
            onChange={setFullName}
          />
          <PhoneNumber />
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
