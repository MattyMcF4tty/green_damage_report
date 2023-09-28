import { useState } from "react";
import DamagePopUp from "../popups/damagePopUp";

interface damageListProps {
  damages: {
    position: string | null;
    description: string | null;
    images: string[];
  }[];
  setDamages: (
    damages: {
      position: string | null;
      description: string | null;
      images: string[];
    }[]
  ) => void;
}

const DamageList = ({ damages, setDamages }: damageListProps) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(
    null
  );

  const handleEdit = (index: number) => {
    setCurrentEditingIndex(index);
    setShowPopUp(true);
  };

  const handleSave = (updatedDamage: (typeof damages)[0], index: number) => {
    const newDamages = [...damages];
    newDamages[index] = updatedDamage;
    setDamages(newDamages);
    setShowPopUp(false);
    setCurrentEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updatedDamages = [...damages];
    updatedDamages.splice(index, 1);
    setDamages(updatedDamages);
  };

  return (
    <div>
      {damages.map((damage, index) => (
        <div key={index}>
          <p>Position: {damage.position}</p>
          <p>Description: {damage.description}</p>
          <p>Images: {damage.images.join(", ")}</p>
          <button type="button" onClick={() => handleEdit(index)}>
            Edit
          </button>
          <button type="button" onClick={() => handleDelete(index)}>
            Delete
          </button>
          {showPopUp && currentEditingIndex !== null && (
            <DamagePopUp
              setShowPopUp={setShowPopUp}
              setDamage={(updatedDamage) =>
                handleSave(updatedDamage, currentEditingIndex)
              }
              damage={damages[currentEditingIndex]}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DamageList;
