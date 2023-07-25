import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect } from "react";
import PhoneNumber from "./phone_form";
import { Inputfield } from "../custom_inputfields";

export class PedestrianInformation {
  name: string | undefined;
  phoneNumber: number | undefined;
  email: string | undefined;
  personDamage: string | undefined;
}
interface PedestrianProps {
  onchange: (pedestrianInfo: PedestrianInformation) => void;
}

export default function PedestrianInfoForm(props: PedestrianProps) {
  const { onchange } = props;
  const [name, setName] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [email, setEmail] = useState<string>();
  const [pedestrianInfo, setPedestrianInfo] = useState<PedestrianInformation>();

  useEffect(() => {
    const newPedestrianInfo = new PedestrianInformation();
    newPedestrianInfo.name = name;
    newPedestrianInfo.phoneNumber = phoneNumber;
    newPedestrianInfo.email = email;

    setPedestrianInfo(newPedestrianInfo);
  }, [name, phoneNumber, email]);

  useEffect(() => {
    if (pedestrianInfo) {
      onchange(pedestrianInfo);
    }
  }, [pedestrianInfo, onchange]);

  return (
    <div className="flex flex-col">
      <Inputfield
        id="NamePedestrian"
        labelText="Name of the pedestrian"
        required={true}
        type="text"
        onChange={setName}
      />
      <PhoneNumber />
      <Inputfield
        id="EmailPedestrian"
        labelText="Email of the pedestrian"
        required={true}
        type="text"
        onChange={setEmail}
      />
    </div>
  );
}
