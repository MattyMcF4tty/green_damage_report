import { reportDataType } from "@/utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const ExpandedReport = (id: string, report: reportDataType) => {
  return (
    <div className="absolute h-[100vh] w-full z-40">
      <div className="fixed w-full h-10 bg-MainGreen-300 text-white">
        <FontAwesomeIcon icon={faX} />
      </div>
    </div>
  );
};

export default ExpandedReport;
