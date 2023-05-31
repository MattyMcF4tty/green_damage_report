import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect } from "react";
import PhoneNumber from "./phone_form";
import { Inputfield } from "../custom_inputfields";

export class ObjectInformation {
  descripeObject: string;
  infoObject: string;
}
interface ObjectProps {
  onchange: (objectInfo: ObjectInformation) => void;
}

export default function ObjectInfoForm(props: ObjectProps) {
  const { onchange } = props;
  const [descripeObject, setDescripeObject] = useState<string>();
  const [infoObject, setInfoObject] = useState<string>();
  const [objectInfo, setObjectInfo] = useState<ObjectInformation>();

  useEffect(() => {
    const newObjectInfo = new ObjectInformation();
    newObjectInfo.descripeObject = descripeObject;
    newObjectInfo.infoObject = infoObject;

    setObjectInfo(newObjectInfo);
  }, [descripeObject, infoObject]);

  useEffect(() => {
    onchange(objectInfo);
  }, [objectInfo, onchange]);

  return (
    <div className="flex flex-col">
      <Inputfield
        id="DescripeObject"
        labelText="Descripe the object"
        required={true}
        type="text"
        onChange={setDescripeObject}
      />
      <Inputfield
        id="InfoObject"
        labelText="Information about the object"
        required={true}
        type="text"
        onChange={setInfoObject}
      />
    </div>
  );
}
