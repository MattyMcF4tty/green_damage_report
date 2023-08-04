import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect } from "react";
import { info } from "console";
import { TextField } from "../custom_inputfields";

export type OtherInformation = {
  description: string
  information: string
}

interface OtherProps {
  value: OtherInformation;
  onChange: (otherInfo: OtherInformation) => void;
}

const OtherInfoForm = ({value, onChange}: OtherProps) => {
  const [descripeOther, setDescripeOther] = useState<string>(value.description);
  const [infoOther, setInfoOther] = useState<string>(value.information);

  useEffect(() => {
    const newOtherInfo: OtherInformation = {
      description: descripeOther, 
      information: infoOther
    };

    onChange(newOtherInfo);
  }, [descripeOther, infoOther]);

  return (
    <div className="w-full">
      <TextField
        id="descripeOther"
        maxLength={500}
        labelText="Descripe other"
        required={true}
        value={descripeOther}
        onChange={setDescripeOther}
      />
      <TextField
        id="InformationOther"
        maxLength={500}
        labelText="Information on other"
        required={true}
        value={infoOther}
        onChange={setInfoOther}
      />
    </div>
  );
}

export default OtherInfoForm;