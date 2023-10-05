import { useState } from "react";
import DamagePopUp from "../popups/damagePopUp";
import { deleteReportFile } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";

interface damageListProps {
  reportId: string;
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
const DamageList = ({ damages, setDamages, reportId }: damageListProps) => {
  // Combine showPopUp and currentEditingIndex
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (
    updatedDamage: {
      position: string | null;
      description: string | null;
      images: string[];
    },
    index: number
  ) => {
    const updatedDamages = [...damages];
    updatedDamages[index] = updatedDamage;
    setDamages(updatedDamages);
    setEditingIndex(null);
  };

  const handleDelete = async (index: number) => {
    const updatedDamages = [...damages];
    try {
      await deleteReportFile(reportId, `GreenDamage/${updatedDamages[index].position}`)
    } catch(error) {
      console.error(error)
    }
    updatedDamages.splice(index, 1);
    setDamages(updatedDamages);
    setEditingIndex(null);
  };

  return (
    <div className="w-full">
      {editingIndex !== null && (
        <DamagePopUp
        reportId={reportId}
          position={damages[editingIndex].position || ""}
          setShowPopUp={(show) =>
            show ? setEditingIndex(editingIndex) : setEditingIndex(null)
          }
          setDamage={(updatedDamage) => handleSave(updatedDamage, editingIndex)}
          damage={damages[editingIndex]}
        />
      )}
      {damages.map((damage, index) =>
        damage.description ? (
          <div className="p-2 mb-4  bg-MainGreen-100 rounded-md" key={index}>
            <p className="break-words">Position: {damage.position}</p>
            <p className="break-words">Description: {damage.description}</p>
            <div className="mb-4">
              <p>Images:</p>
              {damage.images[0].length > 0 && (
                <img className="h-14 w-14"
                src={damage.images[0]} alt="Damage" />
              )}
            </div>

            <button
              className="rounded-full w-16 mr-2 bg-MainGreen-300 text-white"
              type="button"
              onClick={() => handleEdit(index)}
            >
              Edit
            </button>
            <button
              className="rounded-full w-16 bg-MainGreen-300 hover:bg-red-500 text-white"
              type="button"
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>
          </div>
        ) : null
      )}
    </div>
  );
};
export default DamageList;
