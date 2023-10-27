import { useEffect, useState } from "react";
import DamagePopUp from "../popups/damagePopUp";
import { fetchDamageReportFolderFilesUrl, requestDamageReportFolderDeletion } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { DamageSchema } from "@/utils/schemas/incidentDetailSchemas/damageSchema";
import { normalizeFolderPath } from "@/utils/logic/misc";

interface damageListProps {
  reportId: string;
  damages: DamageSchema[];
  setDamages: (
    damages: DamageSchema[]
  ) => void;
}
const DamageList = ({ damages, setDamages, reportId }: damageListProps) => {
  // Combine showPopUp and currentEditingIndex
  const [editingIndex, setEditingIndex] = useState<number | null>(null);


  const handleSave = (
    updatedDamage: DamageSchema,
    index: number
  ) => {
    const updatedDamages = [...damages];
    updatedDamages[index] = updatedDamage;
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
          <div key={damage.position}>
            <DamageObject
            reportId={reportId}
            damage={damage}
            index={index}
            damages={damages}
            setDamages={setDamages}
            setEditingIndex={setEditingIndex}
            />
          </div>
        ) : null
      )}
    </div>
  );
};
export default DamageList;


interface DamageObjectProps {
  reportId:string
  damage:DamageSchema;
  index:number;
  damages: DamageSchema[];
  setDamages: (
    damages: DamageSchema[]
  ) => void
  setEditingIndex: (EditingIndex:number | null) => void;
}

const DamageObject = ({reportId, damage, index, damages, setDamages, setEditingIndex}: DamageObjectProps) => {
  const [imageUrls, setImageUrls] = useState<{
    fileName: string;
    downloadUrl: string;
  }[]>([])
  const normalizedFolderPath = normalizeFolderPath(`GreenDamage/${damage.position}/`)

  const getImages = async () => {
    setImageUrls(await fetchDamageReportFolderFilesUrl(reportId, normalizedFolderPath))
  }

  useEffect(() => {
    getImages()
  }, [damages])

  useEffect(() => {
    getImages()
  }, [])

  const handleDelete = async (index: number) => {
    const updatedDamages = [...damages];
    try {
      console.log('efesffeef')
      await requestDamageReportFolderDeletion(reportId, `GreenDamage/${damage.position}`)
      console.log('dfsf sdf sdf SDF ')
    } catch(error) {
      console.error(error)
    }
    updatedDamages.splice(index, 1);
    setDamages(updatedDamages);
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  return (
    <div className="p-2 mb-4  bg-MainGreen-100 rounded-md">
      <p className="break-words">Position: {damage.position}</p>
      <p className="break-words">Description: {damage.description}</p>
      <div className="mb-4">
        <p>Images:</p>
          <div className="flex flex-wrap">
            {imageUrls.length > 0 && imageUrls.map((image) => (
              <img className="h-14 w-14 m-1" key={image.fileName}
              src={image.downloadUrl} alt={image.fileName} />
            ))}
        </div>
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
  )
}