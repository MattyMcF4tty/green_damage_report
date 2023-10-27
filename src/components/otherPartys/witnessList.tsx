import { useEffect, useState } from "react";
import { Inputfield } from "../inputFields/custom_inputfields";
import PhoneNumber from "../opposite_information/phoneForm";

interface WitnessListProps {
  value: { name: string | null; phone: string | null; email: string | null }[];
  onChange: (
    witnesses: {
      name: string | null;
      phone: string | null;
      email: string | null;
    }[]
  ) => void;
}

export class WitnessInformation {
  name: string | null;
  phone: string | null;
  email: string | null;

  constructor(name: string | null, phone: string | null, email: string | null) {
    this.name = name;
    this.phone = phone;
    this.email = email;
  }
}

const WitnessList = ({ value, onChange }: WitnessListProps) => {
  const [showNewWitness, setShowNewWitness] = useState<boolean>(false);
  const [showUpdateWitness, setShowUpdateWitness] = useState<boolean>(false);
  const [updateWitnessIndex, setupdateWitnessIndex] = useState<number>(-1);
  const [witnesses, setWitnesses] = useState<WitnessInformation[]>(value);

  useEffect(() => {
    onChange(witnesses);
  }, [witnesses]);

  const handleShowUpdateWitness = (index: number) => {
    setupdateWitnessIndex(index);
    setShowUpdateWitness(true);
  };

  return (
    <div className="">
      {/* New witness PopUp */}
      {showNewWitness && (
        <NewWitnessPopUp
          showPopUp={setShowNewWitness}
          witnesses={witnesses}
          setWitnesses={setWitnesses}
        />
      )}

      {showUpdateWitness && (
        <UpdateWitnessPopUp
          showPopUp={setShowUpdateWitness}
          witnesses={witnesses}
          setWitnesses={setWitnesses}
          index={updateWitnessIndex}
        />
      )}

      <div className="">
        <button
          type="button"
          onClick={() => setShowNewWitness(true)}
          className="bg-MainGreen-300 text-white p-2 mb-2 rounded-md"
        >
          Add witness
        </button>

        <div>
          {witnesses.map((witness, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleShowUpdateWitness(index)}
              className="w-full text-left grid- grid grid-cols-2 gap-y-2 p-1 border-l-2 border-MainGreen-300 mb-2 bg-MainGreen-100"
            >
              <div className="row-start-1 col-start-1">
                <p className="text-xs italic">name:</p>
                <p>{witness.name}</p>
              </div>

              <div className="row-start-1 col-start-2">
                <p className="text-xs italic">Phone number:</p>
                <p>{witness.phone}</p>
              </div>

              <div className="row-start-2 col-span-2">
                <p className="text-xs italic">Email:</p>
                <p>{witness.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WitnessList;

/* ------------------------------------New Witness------------------------------------------------ */
interface newWitnessPopUpProps {
  witnesses: {
    name: string | null;
    phone: string | null;
    email: string | null;
  }[];
  setWitnesses: (
    witnesses: {
      name: string | null;
      phone: string | null;
      email: string | null;
    }[]
  ) => void;
  showPopUp: (show: boolean) => void;
}

const NewWitnessPopUp = ({
  showPopUp,
  setWitnesses,
  witnesses,
}: newWitnessPopUpProps) => {
  const [witnessName, setWitnessName] = useState<string>("");
  const [witnessPhone, setWitnessPhone] = useState<string>("");
  const [witnessEmail, setWitnessEmail] = useState<string>("");

  const allowSave =
    witnessName !== "" || witnessPhone !== "" || witnessEmail !== "";

  const handleClosePopUp = () => {
    setWitnessName("");
    setWitnessPhone("");
    setWitnessEmail("");
    showPopUp(false);
  };

  const handleNewWitness = () => {
    const newWitness = {
      name: witnessName,
      phone: witnessPhone,
      email: witnessEmail,
    };
    var newWitnesses = witnesses;
    newWitnesses.push(newWitness);

    setWitnesses(newWitnesses);
    handleClosePopUp();
  };

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-y-auto">
      <div className="absolute flex flex-col justify-center bg-white p-4 rounded-lg">
        <div className="flex flex-row border-b-[1px] border-gray-300 mb-4 justify-center">
          <button
            onClick={() => handleClosePopUp()}
            type="button"
            className="absolute ml-4 pr-4 left-0"
          >
            X
          </button>
          <h1 className="">New witness</h1>
        </div>

        <div>
          <Inputfield
            id="witnessName"
            labelText="Please enter the name of the witness"
            required={true}
            type="text"
            value={witnessName}
            onChange={setWitnessName}
          />
          <PhoneNumber
            labelText="Please enter the phone number of the witness"
            value={witnessPhone}
            onChange={setWitnessPhone}
          />
          <Inputfield
            id="witnessEmail"
            labelText="Please enter the Email of the witness"
            required={true}
            type="emailPattern"
            value={witnessEmail}
            onChange={setWitnessEmail}
          />
        </div>
        <button
          type="button"
          disabled={!allowSave}
          onClick={() => handleNewWitness()}
          className="bg-MainGreen-300 text-white mt-4 p-2 disabled:bg-MainGreen-200"
        >
          Save
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------update Witness--------------------------------------------- */
interface UpdateWitnessPopUpProps {
  witnesses: {
    name: string | null;
    phone: string | null;
    email: string | null;
  }[];
  index: number;
  setWitnesses: (
    witnesses: {
      name: string | null;
      phone: string | null;
      email: string | null;
    }[]
  ) => void;
  showPopUp: (show: boolean) => void;
}

const UpdateWitnessPopUp = ({
  showPopUp,
  setWitnesses,
  witnesses,
  index,
}: UpdateWitnessPopUpProps) => {
  const [witnessName, setWitnessName] = useState<string>(
    witnesses[index].name || ""
  );
  const [witnessPhone, setWitnessPhone] = useState<string>(
    witnesses[index].phone || ""
  );
  const [witnessEmail, setWitnessEmail] = useState<string>(
    witnesses[index].email || ""
  );

  const allowSave =
    witnessName !== "" || witnessPhone !== "" || witnessEmail !== "";

  const handleUpdateWitness = () => {
    const updatedWitness = {
      name: witnessName,
      phone: witnessPhone,
      email: witnessEmail,
    };
    var updatedWitnesses = witnesses;
    updatedWitnesses[index] = updatedWitness;

    setWitnesses(updatedWitnesses);
    showPopUp(false);
  };

  const handleDeleteWitness = () => {
    var updatedWitnesses = witnesses;
    /* Delete witness on index */
    updatedWitnesses.splice(index, 1);

    setWitnesses(updatedWitnesses);
    showPopUp(false);
  };

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-y-auto scro">
      <div className="absolute flex flex-col justify-center bg-white p-4 rounded-lg">
        <div className="flex flex-row border-b-[1px] border-gray-300 mb-4 justify-center">
          <button
            onClick={() => showPopUp(false)}
            type="button"
            className="absolute ml-4 pr-4 left-0 rounded-md"
          >
            X
          </button>
          <h1 className="">New witness</h1>
        </div>

        <div>
          <Inputfield
            id="witnessName"
            labelText="Name"
            required={true}
            type="text"
            value={witnessName}
            onChange={setWitnessName}
          />
          <PhoneNumber
            labelText="Phone number"
            value={witnessPhone}
            onChange={setWitnessPhone}
          />
          <Inputfield
            id="witnessEmail"
            labelText="Email"
            required={true}
            type="emailPattern"
            value={witnessEmail}
            onChange={setWitnessEmail}
          />
        </div>
        <div className="flex flex-row justify-evenly">
          <button
            type="button"
            onClick={() => handleDeleteWitness()}
            className="bg-red-600 text-white mt-4 p-2 w-1/3"
          >
            Delete
          </button>
          <button
            type="button"
            disabled={!allowSave}
            onClick={() => handleUpdateWitness()}
            className="bg-MainGreen-300 text-white mt-4 p-2 w-1/3 disabled:bg-MainGreen-200"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
