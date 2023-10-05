import { useState } from "react";
import { SingleImagefield, TextField } from "../custom_inputfields";

interface DamagePopUpProps {
  reportId: string;
  position: string;
  damage: {
    description: string | null;
    images: string[];
    position: string | null;
  } | null;
  setDamage: (damageList: {
    position: string | null;
    description: string | null;
    images: string[];
  }) => void;
  setShowPopUp: (show: boolean) => void;
}

const DamagePopUp = ({
  reportId,
  setShowPopUp,
  setDamage,
  damage,
  position,
}: DamagePopUpProps) => {
  const [damageDescription, setDamageDescription] = useState<string>(
    damage && damage.description ? damage.description : ""
  );
  const [images, setImages] = useState<string[]>(
    damage && damage.images ? damage.images : []
  );
  const [currentImage, setCurrentImage] = useState<string>();

  const allowSave = damageDescription !== "";

  const handleClosePopUp = () => {
    setDamageDescription("");
    setImages([]);
    setShowPopUp(false);
  };

  const handleNewDamageList = async () => {
    /*     const storageRef = ref(FireStorage, `${id}/Damage/${currentImage}`);
    const images = await getDownloadURL(storageRef); */

    const newDamage = {
      position: position,
      description: damageDescription,
      images: images,
    };
    console.log(newDamage);
    setDamage(newDamage);
    handleClosePopUp();
  };

  return (
    <div className="fixed flex justify-center items-center z-50 inset-0 bg-black bg-opacity-75 overflow-y-auto">
      <div className="absolute flex flex-col justify-center md:w-[32rem] bg-white p-4 rounded-lg">
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

        <TextField
          id="damageDescription"
          labelText="Please describe the damages to this position"
          maxLength={500}
          required={true}
          value={damageDescription}
          onChange={setDamageDescription}
        />
        <div>
          <SingleImagefield
            reportId={reportId}
            id={"DamageImage"}
            labelText="Please take picture of damage"
            required={false}
            filePath={`GreenDamage/${position}`}
            setImage={(image) => {
              setImages([image]);
            }}
          />
        </div>
        <button
          type="button"
          disabled={!allowSave}
          onClick={() => handleNewDamageList()}
          className="bg-MainGreen-300 text-white mt-4 rounded-md p-2 disabled:bg-MainGreen-200"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DamagePopUp;
