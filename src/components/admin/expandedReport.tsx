import { reportDataType } from "@/utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface ExpandedReportProps {
  visible: boolean,
  id: string,
  report: reportDataType | undefined
}


const ExpandedReport = ({visible, id, report}: ExpandedReportProps) => {
  const [showWidget, setShowWidget] = useState<'visible' | 'invisible'>('invisible')

  useEffect(() => {
    if (visible) {
      setShowWidget('visible')
    } else {
      setShowWidget('invisible')
    }
  }, [visible])

  return (
    <div className={`${showWidget} absolute h-[100vh] w-full z-40`}>
      <div className="fixed w-full h-10 bg-MainGreen-300 text-white">
        <FontAwesomeIcon icon={faX} />
      </div>
    </div>
  );
};

export default ExpandedReport;
