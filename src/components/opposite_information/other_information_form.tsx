import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect } from "react";
import { info } from "console";
import { TextField } from "../custom_inputfields";

export class OtherInformation {
  description: string;
  information: string;
  location: {lat: number | null, lng: number | null};

  constructor (
    description: string,
    information: string,
    location: {lat: number | null, lng: number | null},
  ) {
    this.description = description;
    this.information = information;
    this.location = location;
  }

  updateFields(fields: Partial<OtherInformation>) {
    Object.assign(this, fields);
  }

  toPlainObject() {
    return {
      description: this.description,
      information: this.information,
      location: this.location,
    };
  }
};

interface OtherProps {
  value: OtherInformation;
  onChange: (otherInfo: OtherInformation) => void;
}

const OtherInfoForm = ({ value, onChange }: OtherProps) => {
  const [descripeOther, setDescripeOther] = useState<string>(value.description);
  const [infoOther, setInfoOther] = useState<string>(value.information);

  useEffect(() => {
    const newOtherInfo: OtherInformation = new OtherInformation(descripeOther, infoOther, {lat: null, lng: null})
  
    onChange(newOtherInfo);
  }, [descripeOther, infoOther]);

  return (
    <div className="w-full mt-4">
      <TextField
        id="descripeOther"
        maxLength={500}
        labelText="Please descripe other"
        required={true}
        value={descripeOther}
        onChange={setDescripeOther}
      />
      <TextField
        id="InformationOther"
        maxLength={500}
        labelText="Please provide information on other"
        required={true}
        value={infoOther}
        onChange={setInfoOther}
      />
    </div>
  );
};

export default OtherInfoForm;
