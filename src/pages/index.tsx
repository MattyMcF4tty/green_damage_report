import { Inputfield } from "@/components/custom_inputfields";
import { createDoc } from "@/firebase/clientApp";
import { generateId, getReportsByEmail } from "@/utils/utils";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import EmailPopUp from "@/components/popups/emailPopUp";

const IndexPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [ongoingReports, setOngoingReports] = useState<string[]>([]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();

    const ID = await generateId();

    try {
      const ongoingReports = await getReportsByEmail(email);
      if (ongoingReports.length == 0) {
        if (ID !== undefined && email !== "") {
          await createDoc(ID, email);
          router.push(`damagereport/what?id=${ID}`);
        } else {
          throw new Error("Error creating report Missing ID or Mail");
        }
      } else {
        setOngoingReports(ongoingReports);
        setShowPopUp(true);
      }
    } catch (error) {
      console.error(`Something went wrong:\n${error}`);
    }
  };

  return (
    <form
      onSubmit={(e) => handleStart(e)}
      className="flex flex-col items-center justify-center lg:justify-center h-[80vh]"
    >
      <img
        src="../GreenLogos/GreenMobilityTextLogo.png"
        alt="greenlogo"
        className="absolute top-0 lg:w-[40%] md:bg-inherit w-3/4 mt-2"
      />
      <div className="mx-8">
        <div className=" flex flex-col lg:text-center mb-8 lg:text-xl lg:w-[56rem]">
          <span className="mb-2">
            The purpose of this damage report is to document and record
            information about your incident. Please ensure that you provide
            accurate information, as this report will be submitted to our
            insurance company to cover your side of the incident.
          </span>
        </div>

        <div className="lg:mx-auto lg:w-[25rem]">
          <Inputfield
            id="Email"
            labelText="

          To access the damage report, please enter your email"
            required={true}
            onChange={setEmail}
            value={email}
            type="email"
            placeHolder="greenmobility@example.com"
          />
        </div>
      </div>

      <button
        type="submit"
        className="absolute bottom-4 w-32 h-14 text-lg font-semibold rounded-full bg-MainGreen-300 text-white
          lg:bottom-auto"
      >
        Start
      </button>

      {showPopUp && (
        <EmailPopUp
          setVisibility={setShowPopUp}
          reportIDs={ongoingReports}
          email={email}
        />
      )}
    </form>
  );
};

export default IndexPage;
