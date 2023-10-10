import { Inputfield } from "@/components/custom_inputfields";
import { useRouter } from "next/router";
import React, { useState } from "react";
import EmailPopUp from "@/components/popups/emailPopUp";
import { requestDamageReportCreation } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { queryDamageReports } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";

const IndexPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [ongoingReports, setOngoingReports] = useState<string[]>([]);
  const [isError, setIsError] = useState<string | null>(null);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for ongoing reports with that email.
    const ongoingReports = await queryDamageReports("userEmail", email);

    if (Object.keys(ongoingReports).length !== 0) {
      setOngoingReports(Object.keys(ongoingReports));
      setShowPopUp(true);
      return;
    }

    // Create a new report
    let reportId: string;
    try {
      reportId = await requestDamageReportCreation(email);
    } catch (error: any) {
      console.error(error);
      setIsError(error.message);
      return;
    }

    //Push to start of damage report
    router.push(`/damagereport/what?id=${reportId}`);
  };

  return (
    <form
      onSubmit={(e) => handleStart(e)}
      className="flex flex-col items-center justify-center lg:justify-center h-[80vh] lg:h-[100vh]"
    >
      <img
        src="../GreenLogos/GreenMobilityTextLogo.png"
        alt="greenlogo"
        className="absolute top-4 lg:w-[20%] md:bg-inherit w-3/4 mt-2"
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
            type="emailPattern"
            placeHolder="greenmobility@example.com"
          />
        </div>
      </div>

      {isError && <p className="text-sm text-red-500">{isError}</p>}
      <button
        type="submit"
        className="absolute bottom-4 w-32 h-14 text-lg font-semibold rounded-full bg-MainGreen-300 text-white
          lg:bottom-auto lg:relative"
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
