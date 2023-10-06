import { createDoc } from "@/firebase/clientApp";
import { handleCreateNewReport } from "@/utils/firebaseUtils/apiRoutes";
import { handleSendEmail, reportDataType } from "@/utils/utils";
import { useRouter } from "next/router";
import { use, useEffect, useRef, useState } from "react";
import { TextField } from "../custom_inputfields";
import { text } from "stream/consumers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMailForward } from "@fortawesome/free-solid-svg-icons";
import sendEmail from "@/pages/api/sendEmail";

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

  const allowSend = !textArea || !subject;
  useEffect(() => {
    console.log(allowSend);
  }, [allowSend]);

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto overflow-x-auto">
      <div className="absolute flex flex-col justify-center md:w-[32rem] bg-white p-4 rounded-lg">
        <p className="text-2xl flex flex-col items-center justify-center border-b-[1px] border-MainGreen-300 mb-8">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="ml-2 text-MainGreen-300"
          />
          Send mail
        </p>

        <div className="mb-10">
          <p>To:</p>
          <select
            className="h-8 border border-MainGreen-200 bg-MainGreen-100 rounded-md shadow-md outline-none "
            id="FilterOptions"
            value={currentMail}
            onChange={(e) => setCurrentMail(e.target.value)}
          >
            {renterMail && <option value={renterMail}>Renter</option>}
            {userEmail && <option value={userEmail}>Reporter</option>}
            {driverMail && <option value={driverMail}>Driver</option>}
          </select>
          <p className="text-gray-400">{currentMail}</p>
        </div>

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
        <button
          type="button"
          disabled={allowSend}
          onClick={() =>
            handleSendEmail(currentMail, subject || "-", textArea || "-")
          }
          className="bg-MainGreen-300 text-white mt-4 rounded-md p-2 disabled:bg-MainGreen-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SendMailPopUp;
