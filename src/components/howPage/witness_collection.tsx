import React, { useEffect, useState } from "react";
import { WitnessInformation } from "../../utils/logic";
import { Inputfield } from "../custom_inputfields";
import PhoneNumber from "../opposite_information/phone_form";

/* Indiviual witness information */
interface WitnessProps {
  witnessInfo: WitnessInformation;
  index: number;
  handleWitnessDelete: (index: number) => void;
}

const Witness = ({ witnessInfo, index, handleWitnessDelete }: WitnessProps) => {
  const name = witnessInfo.name;
  const phone = witnessInfo.phone;
  const email = witnessInfo.email;

  function onDelete() {
    handleWitnessDelete(index);
  }

  return (
    <li className="border-[1px] border-MainGreen-100 focus:bg-MainGreen-100">
      <div>
        <label htmlFor="Name">Name</label>
        <p id="Name">{name}</p>
      </div>

      <div>
        <label htmlFor="Phone">Phone number</label>
        <p id="Phone">{phone}</p>
      </div>

      <div>
        <label htmlFor="Email">Email</label>
        <p id="Email">{email}</p>
      </div>

      <button onClick={onDelete}>Delete</button>
    </li>
  );
};

/* Witness information list */
interface WitnessListProps {
  OnChange: (witnessArray: WitnessInformation[]) => void;
}

export const WitnessList = ({}: WitnessListProps) => {
  const [witnessArray, setWitnessArray] = useState<WitnessInformation[]>([]);
  const [showNewWitness, setShowNewWitness] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");

  function handleNewWitness() {
    const Witness = new WitnessInformation();

    Witness.name = newName;
    Witness.phone = newPhone;
    Witness.email = newEmail;

    setWitnessArray([...witnessArray, Witness]);
    setShowNewWitness(false);
  }

  function handleWitnessDelete(index: number) {
    const updatedWitnessArray = witnessArray.filter((_, i) => {
      const isDifferentIndex = i !== index;
      return isDifferentIndex;
    });

    setWitnessArray(updatedWitnessArray);
  }

  useEffect(() => {}, [witnessArray]);

  return (
    <div>
      <button type="button" onClick={() => setShowNewWitness(true)}>
        New Witness
      </button>
      {showNewWitness && (
        <div>
          <Inputfield
            labelText="Name"
            id="NewName"
            required={true}
            type="text"
            onChange={setNewName}
          />

          <PhoneNumber />

          <Inputfield
            labelText="Email"
            id="NewEmail"
            required={true}
            type="text"
            onChange={setNewEmail}
          />

          <button type="button" onClick={handleNewWitness}>
            Save
          </button>
        </div>
      )}
      <ul>
        {witnessArray.map((witness, index) => (
          <Witness
            key={index}
            witnessInfo={witness}
            index={index}
            handleWitnessDelete={handleWitnessDelete}
          />
        ))}
      </ul>
    </div>
  );
};
