import { reportDataType } from "@/utils/utils";
import {
  faCloudArrowDown,
  faEye,
  faPrint,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ExpandedReport from "./expandedReport";
import { deleteReports, getImages } from "@/firebase/clientApp";
import ReactPDF from "@react-pdf/renderer";
import generatePDF from "@/components/admin/pdfGenerator";

interface ReportControls {
  selectedReports: { id: string; data: reportDataType }[];
}

const handleDownloadPDF = async (id: string, data: reportDataType) => {
  const images = await getImages(id);
  if (data !== null) {
    const pdfBlob = await generatePDF(data, images);
    const url = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "report.pdf";
    link.click();

    URL.revokeObjectURL(url);
  } else {
    console.error("No data available for PDF generation");
  }
};

const ReportControls = ({ selectedReports }: ReportControls) => {
  const [showExpandedReports, setShowExpandedReports] =
    useState<boolean>(false);

  const handleDelete = async () => {
    /* Delete reports on server */
    const selectedReportIDs: string[] = [];
    selectedReports.map((report) => {
      selectedReportIDs.push(report.id);
    });

    await deleteReports(selectedReportIDs);

    /* TODO: Reloads before documents are deleted */
    /*  location.reload(); */
  };

  return (
    <div className="flex flex-row w-full justify-between ml-8">
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
        onClick={() => {
          if (selectedReports.length > 0) {
            handleDownloadPDF(selectedReports[0].id, selectedReports[0].data);
          }
        }}
        className="bg-MainGreen-300 text-white px-4 py-2 rounded-md shadow-md"
      >
        <FontAwesomeIcon icon={faCloudArrowDown} className="mr-2" />
        Download PDF
      </button>

      <button
        type="button"
        className="bg-white border-gray-300 border-[1px] rounded-xl w-32 hover:bg-MainGreen-300 hover:text-white duration-150"
        onClick={() => {
          if (selectedReports.length > 0) {
            setShowExpandedReports(true);
          }
        }}
      >
        <FontAwesomeIcon icon={faEye} />
        {" Expand"}
      </button>

      {showExpandedReports && (
        <ExpandedReport
          setVisible={setShowExpandedReports}
          reports={selectedReports}
        />
      )}
    </div>
  );
};

export default ReportControls;
