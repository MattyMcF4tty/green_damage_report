import { reportDataType, sendEmail } from "@/utils/utils";
import {
  faCloudArrowDown,
  faEye,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ExpandedReport from "./expandedReport";
import { deleteReports, getImages, handlePdf, storage } from "@/firebase/clientApp";
import generatePDF from "@/utils/pdfGenerator";
import { ref, uploadBytes } from "firebase/storage";


interface ReportControls {
  selectedReports: { id: string; data: reportDataType }[];
}

const handleDownloadPDF = async (id: string, data: reportDataType) => {
  await handlePdf(id)
/*   const images = await getImages(id);
  if (data !== null) {
    const pdfBlob = await generatePDF(data, images);

    const refer = ref(storage, "abc/")
    await uploadBytes(refer, pdfBlob) */
/*     const url = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "report.pdf";
    link.click();

    URL.revokeObjectURL(url); */
/*   } else {
    console.error("No data available for PDF generation");
  } */
};

const ReportControls = ({ selectedReports }: ReportControls) => {
  const [showExpandedReports, setShowExpandedReports] =
    useState<boolean>(false);

  const [status, setStatus] = useState("");

  const handleSendEmail = async() => {
    await sendEmail("carloslundrodriguez@gmail.com", "sut din far", "dø");
  };

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
      <button onClick={() => handleSendEmail()}>Send Email</button>
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
