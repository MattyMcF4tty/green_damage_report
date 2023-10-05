import { createDoc } from "@/firebase/clientApp";
import { handleCreateNewReport } from "@/utils/firebaseUtils/apiRoutes";
import { reportDataType } from "@/utils/utils";
import { useRouter } from "next/router";
import { use, useEffect, useRef, useState } from "react";
import { TextField } from "../custom_inputfields";
import { text } from "stream/consumers";

interface SendMailPopUpProps {
  setVisibility: (visible: boolean) => void;
  damageReport: reportDataType;
}
const SendMailPopUp = ({ setVisibility, damageReport }: SendMailPopUpProps) => {
  const userEmail = damageReport.userEmail;
  const driverMail = damageReport.driverInfo.email;
  const renterMail = damageReport.renterInfo.email;

  console.log(
    "Driver:",
    driverMail,
    "\nReporter:",
    userEmail,
    "\nRenter",
    renterMail
  );

  const [subject, setSubject] = useState<string | null>(null);
  const [textArea, setTextArea] = useState<string | null>(null);
  const [currentMail, setCurrentMail] = useState<string>("No emails");

  useEffect(() => {
    // Initialize currentMail based on the selected report's recipient
    if (userEmail) {
      setCurrentMail(userEmail);
    } else if (renterMail) {
      setCurrentMail(renterMail);
    } else if (driverMail) {
      setCurrentMail(driverMail);
    }
  }, []);

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
      <div className="absolute flex flex-col justify-center md:w-[32rem] bg-white p-4 rounded-lg">
        <p>To:</p>
        <select
          className="h-8 border border-neutral-500 rounded-l-lg shadow-md outline-none"
          id="FilterOptions"
          value={currentMail}
          onChange={(e) => setCurrentMail(e.target.value)}
        >
          {renterMail && <option value={renterMail}>Renter</option>}
          {userEmail && <option value={userEmail}>Reporter</option>}
          {driverMail && <option value={driverMail}>Driver</option>}
        </select>
        <div className="">
          <TextField
            id="subject"
            maxLength={100}
            labelText="Subject:"
            required={true}
            onChange={setSubject}
            value={subject}
          />
        </div>
        <div>
          <TextField
            id="textArea"
            maxLength={500}
            labelText=""
            required={true}
            onChange={setTextArea}
            value={textArea}
          />
        </div>
      </div>
    </div>
  );
};

export default SendMailPopUp;
