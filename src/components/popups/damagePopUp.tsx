import { useEffect, useState } from "react";
import { ImageField, TextField } from "../custom_inputfields";
import { handleDownloadImages } from "@/utils/utils";
import { updateImages } from "@/firebase/clientApp";
import { url } from "inspector";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FireStorage } from "@/firebase/firebaseConfig";

interface DamagePopUpProps {
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

        <div className="md:w-[32rem] md:h-[8rem] md:mt-6">
          <TextField
            id="damageDescription"
            labelText="Please describe the damages to this position"
            maxLength={500}
            required={true}
            value={damageDescription}
            onChange={setDamageDescription}
          />
        </div>
        {/*    <div>
          <label htmlFor="Please uploade pictures of the damage"></label>
          <input
            type="file"
            required={false}
            multiple={false}
            accept="image/png, image/jpeg"
            value={currentImage}
            onChange={async (e) => {
              const fieldImage = e.target.files;
              if (fieldImage) {
                const imageBlob = new Blob([fieldImage[0]], {
                  type: fieldImage[0].type,
                });
                const storageRef = ref(
                  FireStorage,
                  `${id}/Damage/${fieldImage[0].name}`
                );
                await uploadBytes(storageRef, imageBlob);
                setCurrentImage(fieldImage[0].name);
              }
            }}
          />
        </div> */}
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

export default DamagePopUp;
