import { reportDataType } from "@/utils/utils"
import { faCloudArrowDown, faEye, faPrint, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import ExpandedReport from "./expandedReport";
import { deleteReports } from "@/firebase/clientApp";

interface ReportControls {
    selectedReports: {id: string, data: reportDataType}[];
}

const ReportControls = ({selectedReports}: ReportControls) => {
    const [showExpandedReports, setShowExpandedReports] = useState<boolean>(false);

    const handleDelete = async () => {
        /* Delete reports on server */
        const selectedReportIDs: string[] = []
        selectedReports.map((report) => {
            selectedReportIDs.push(report.id)
        })

        await deleteReports(selectedReportIDs);

        /* TODO: Reloads before documents are deleted */
        location.reload();
    }

    return (
        <div className="flex flex-row w-1/3 justify-between ml-8">
            <button
                type="button"
                className="bg-white border-gray-300 border-[1px] rounded-xl w-32  hover:bg-MainGreen-300 hover:text-white duration-150"
                onClick={() => handleDelete()}
            >
                <FontAwesomeIcon icon={faTrashCan} />
                {" Delete"}
            </button>
            <button
                type="button"
                className="bg-white border-gray-300 border-[1px] rounded-xl w-32 hover:bg-MainGreen-300 hover:text-white duration-150"
            >
                <FontAwesomeIcon icon={faPrint} />
                {" Print"}
            </button>
            <button
                type="button"
                className="bg-white border-gray-300 border-[1px] rounded-xl w-32 hover:bg-MainGreen-300 hover:text-white duration-150"
            >
                <FontAwesomeIcon icon={faCloudArrowDown} />
                {" Download"}
            </button>
            <button
                type="button"
                className="bg-white border-gray-300 border-[1px] rounded-xl w-32 hover:bg-MainGreen-300 hover:text-white duration-150"
                onClick={() => {
                if (selectedReports.length > 0) {
                    setShowExpandedReports(true)
                }
                }}
            >
                <FontAwesomeIcon icon={faEye} />
                {" Expand"}
            </button>
            
            {showExpandedReports && (
                <ExpandedReport setVisible={setShowExpandedReports} reports={selectedReports}/>
            )}
        </div>
    )
}

export default ReportControls;