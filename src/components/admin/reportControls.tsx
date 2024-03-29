import {
  faCloudArrowDown,
  faEnvelope,
  faEye,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { handleGeneratePdf } from "@/utils/logic/pdfLogic/pdfLogic";
import SendMailPopUp from "../popups/sendMailPopUp";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import ExpandedReport3 from "./expandedReport3";
import { requestDamageReportDeletion } from "@/utils/logic/damageReportLogic.ts/apiRoutes";

interface ReportControls {
  selectedReports: { id: string; data: AdminDamageReport }[];
}

const ReportControls = ({ selectedReports }: ReportControls) => {
  const [showExpandedReports, setShowExpandedReports] =
    useState<boolean>(false);

  const [allowPdf, setAllowPdf] = useState(true);
  const [sendMail, setSendMail] = useState(false);
  const handleEmail = async (
    selectedReports: { id: string; data: AdminDamageReport }[]
  ) => {
    selectedReports.map(async (report, index) => {});
  };

  const handleInstallPDF = async (
    selectedReports: { id: string; data: AdminDamageReport }[]
  ) => {
    setAllowPdf(false);
    await Promise.all(selectedReports.map(async (report) => {
      await handleGeneratePdf(report.id);
    }));
    setAllowPdf(true);
  };

  const handleDelete = async () => {
    /* Delete reports on server */
    const deletionPromises = selectedReports.map(async(report) => {
      requestDamageReportDeletion(report.id)
    });

    await Promise.all(deletionPromises)

    location.reload();
  };

  return (
    <div className="flex flex-row md:w-[45rem] w-full justify-between ml-8">
      <button
        type="button"
        className="bg-white border-gray-300 border-[1px] rounded-xl w-32  hover:bg-MainGreen-300 hover:text-white duration-150 md:h-[3rem]"
        onClick={() => handleDelete()}
      >
        <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
        {" Delete"}
      </button>
      <button
        className="bg-white text-black w-32 rounded-xl border-[1px]  border-gray-300 hover:bg-MainGreen-300 hover:text-white duration-150 md:h-[3rem]"
        onClick={() => {
          if (selectedReports.length > 0) {
            setSendMail(true);
          }
        }}
      >
        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
        Send mail
      </button>
      <button
        disabled={!allowPdf}
        onClick={() => {
          if (selectedReports.length > 0) {
            handleInstallPDF(selectedReports);
          }
        }}
        className="bg-white text-black px-4 py-2 rounded-xl border-[1px] disabled:bg-MainGreen-200 border-gray-300 hover:bg-MainGreen-300 hover:text-white duration-150 md:h-[3rem] md:w-[11rem]"
      >
        <FontAwesomeIcon icon={faCloudArrowDown} className="mr-2" />
        Download PDF
      </button>

      <button
        type="button"
        className="bg-white border-gray-300 border-[1px] rounded-xl w-32 hover:bg-MainGreen-300 hover:text-white duration-150 md:h-[3rem] md:w-[7rem]"
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
        <ExpandedReport3
          setVisible={setShowExpandedReports}
          reports={selectedReports}
        />
      )}

      {sendMail && (
        <SendMailPopUp
          setVisibility={setSendMail}
          damageReport={selectedReports[0].data}
        />
      )}
    </div>
  );
};

export default ReportControls;
