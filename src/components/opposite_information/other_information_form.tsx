import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect } from "react";
import { info } from "console";
import { TextField } from "../custom_inputfields";

export class OtherInformation {
  descripeOther: string;
  infoOther: string;
}

interface OtherProps {
  onchange: (otherInfo: OtherInformation) => void;
}

export default function OtherInfoForm(props: OtherProps) {
  const { onchange } = props;
  const [descripeOther, setDescripeOther] = useState<string>();
  const [infoOther, setInfoOther] = useState<string>();
  const [otherInfo, setOtherInfo] = useState<OtherInformation>();

  useEffect(() => {
    const newOtherInfo = new OtherInformation();
    newOtherInfo.descripeOther = descripeOther;
    newOtherInfo.infoOther = infoOther;

    setOtherInfo(newOtherInfo);
  }, [descripeOther, infoOther]);

  useEffect(() => {
    onchange(otherInfo);
  }, [otherInfo, onchange]);

  return (
    <div>
      <TextField
        id="descripeOther"
        maxLength={500}
        labelText="Descripe other"
        required={true}
        onChange={setDescripeOther}
      />
      <TextField
        id="InformationOther"
        maxLength={500}
        labelText="Information on other"
        required={true}
        onChange={setInfoOther}
      />
    </div>
  );
}
