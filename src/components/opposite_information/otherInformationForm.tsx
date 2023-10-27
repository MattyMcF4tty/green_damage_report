import React, { useState, useEffect } from "react";
import { TextField } from "../customeInputfields/custom_inputfields";
import { IncidentObject } from "@/utils/schemas/incidentDetailSchemas/incidentObjectSchema";


interface OtherProps {
  value: IncidentObject;
  onChange: (otherInfo: IncidentObject) => void;
}

const OtherInfoForm = ({ value, onChange }: OtherProps) => {
  const [descripeOther, setDescripeOther] = useState<string | null>(value.description);
  const [infoOther, setInfoOther] = useState<string | null>(value.information);

  useEffect(() => {
    const newOtherInfo: IncidentObject = new IncidentObject(descripeOther, infoOther)
  
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
