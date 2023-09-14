import { useEffect, useState } from "react";
import { TextField } from "../custom_inputfields";

interface newDamageListPopUpProps {
  damage: { description: string | null; imageUrl: string | null };
  setDamage: (damageList: {
    description: string | null;
    imageUrl: string | null;
  }) => void;
  setShowPopUp: (show: boolean) => void;
}

const NewDamageListPopUp = ({
  setShowPopUp,
  setDamage,
  damage,
}: newDamageListPopUpProps) => {
  const [damageDescription, setDamageDescription] = useState<string>(
    damage.description ? damage.description : ""
  );
  const [image, setImage] = useState<string>(
    damage.imageUrl ? damage.imageUrl : ""
  );

  const allowSave = damageDescription !== "";

  const handleClosePopUp = () => {
    setDamageDescription("");
    setImage("");
    setShowPopUp(false);
  };

  const handleNewDamageList = () => {
    const newDamage = {
      description: damageDescription,
      imageUrl: image,
    };

    setDamage(newDamage);
    handleClosePopUp();
  };

  return (
    <div className="fixed flex justify-center items-center z-50 inset-0 bg-black bg-opacity-75 overflow-y-auto">
      <div className="absolute flex flex-col justify-center bg-white p-4 rounded-lg">
        <div className="flex flex-row border-b-[1px] border-gray-300 mb-4 justify-center">
          <button
            onClick={() => handleClosePopUp()}
            type="button"
            className="absolute ml-4 pr-4 left-0"
          >
            X
          </button>
          <h1 className="">New damage description</h1>
        </div>

        <div>
          <TextField
            id="damageDescription"
            labelText="
          Please provide a description of the damages incurred to the parties involved"
            maxLength={500}
            required={true}
            value={damageDescription}
            onChange={setDamageDescription}
          />
        </div>
        <button
          type="button"
          disabled={!allowSave}
          onClick={() => handleNewDamageList()}
          className="bg-MainGreen-300 text-white mt-4 p-2 disabled:bg-MainGreen-200"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NewDamageListPopUp;
