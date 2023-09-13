import {
  handleDownloadPdf,
  reportDataType,
  handleSendEmail,
} from "@/utils/utils";
import {
  faCloudArrowDown,
  faEnvelope,
  faEye,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ExpandedReport from "./expandedReport";
import { deleteReports } from "@/firebase/clientApp";


interface ReportControls {
  selectedReports: { id: string; data: reportDataType }[];
}

const ReportControls = ({ selectedReports }: ReportControls) => {
  const [showExpandedReports, setShowExpandedReports] =
    useState<boolean>(false);

  const [allowPdf, setAllowPdf] = useState(true);

  const handleEmail = async () => {
    await handleSendEmail("carloslundrodriguez@gmail.com", "sut din far", "dø");
  };

  const handleInstallPDF = async (
    selectedReports: { id: string; data: reportDataType }[]
  ) => {
    setAllowPdf(false);
    selectedReports.map(async (report) => {
      await handleDownloadPdf(report.id);
    });
    setAllowPdf(true);
  };

  const handleDelete = async () => {
    /* Delete reports on server */
    const selectedReportIDs: string[] = [];
    selectedReports.map((report) => {
      selectedReportIDs.push(report.id);
    });

    await deleteReports(selectedReportIDs);

    location.reload();
  };

  return (
    <div className="flex flex-row w-full justify-between ml-8">
      <button
        type="button"
        className="bg-white border-gray-300 border-[1px] rounded-xl w-32  hover:bg-MainGreen-300 hover:text-white duration-150"
        onClick={() => handleDelete()}
      >
        <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
        {" Delete"}
      </button>
      <button
        className="bg-white text-black w-32 rounded-xl border-[1px]  border-gray-300 hover:bg-MainGreen-300 hover:text-white duration-150"
        onClick={() => handleEmail()}
      >
        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
        Send Email
      </button>
      <button
        disabled={!allowPdf}
        onClick={() => {
          if (selectedReports.length > 0) {
            handleInstallPDF(selectedReports);
          }
        }}
        className="bg-white text-black px-4 py-2 rounded-xl border-[1px]  border-gray-300 hover:bg-MainGreen-300 hover:text-white duration-150"
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
        <FontAwesomeIcon icon={faEye} className="mr-2" />
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
