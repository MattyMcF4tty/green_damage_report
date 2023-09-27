import { createDoc } from "@/firebase/clientApp";
import { generateId, handleCreateNewReport } from "@/utils/utils";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface EmailPopUpProps {
    setVisibility: (visible: boolean) => void;
    reportIDs: string[];
    email: string
}

const EmailPopUp = ({reportIDs, setVisibility, email}: EmailPopUpProps) => {
    const Router = useRouter()
    const [enableButtons, setEnableButtons] = useState(true)

    const handleNewReport = async() => {
        setEnableButtons(false);
        
        let reportId: string;
        try {
            reportId = await handleCreateNewReport(email)
        } catch ( error:any ) {
            console.error(error);
            setEnableButtons(true);
            return;
        }

        Router.push(`damagereport/what?id=${reportId}`);
    }

    return (
        <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
            <div className="bg-white w-[20rem] p-4 rounded-md">
                <p>I looks like you already have ongoing reports, would you like to continue with one of them?</p>
                <p className="mt-2">Reports:</p>
                <div className="flex flex-col">
                    {reportIDs.map((id, index) => (
                        <button key={index}
                        onClick={() => (Router.push(`damagereport/what?id=${id}`))} 
                        className="italic underline text-left">{id}</button>
                    ))}
                </div>
                <div className="flex flex-row h-[2.4rem] mt-10 justify-evenly">
                    <button disabled={!enableButtons} onClick={() => {setVisibility(false)}} 
                    className="bg-gray-200 p-1 h-full w-24 rounded-sm">Cancel</button>
                    <button disabled={!enableButtons} onClick={() => {handleNewReport()}} 
                    className="bg-MainGreen-300 p-1 h-full w-24 text-white rounded-sm">New report</button>
                </div>
            </div>            
        </div>
    )
}

export default EmailPopUp;