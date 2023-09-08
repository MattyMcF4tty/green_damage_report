import { Inputfield } from "@/components/custom_inputfields";
import { checkEmailExists, createDoc, updateData } from "@/firebase/clientApp";
import { generateId } from "@/utils/utils";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import EmailPopUp from "@/components/popups/emailPopUp";

const IndexPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [ongoingReports, setOngoingReports] = useState<string[]>([])
  const [id, setId] = useState(generateId());

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();

    const ID = await generateId()

    try {
      const ongoingReports = await checkEmailExists(email);
      if (ongoingReports.length == 0) { 
        if (ID !== undefined) {
          await createDoc(ID, email);
          router.push(`damagereport/what?id=${ID}`);
        } else {
          throw new Error("Error creating id")
        } 
      } else {
        setOngoingReports(ongoingReports)
        setShowPopUp(true)
      }
    } catch ( error ) {
      console.log(`Something went wrong:\n${error}`)
    }

  };

  return (
    <form
      onSubmit={(e) => handleStart(e)}
      className="flex flex-col items-center"
    >
      <div className="container mx-auto p-8">
        <div className="mb-4 ">
          <div className="flex flex-col ">
            <h3 className="mb-2 text-left  text-MainGreen-300 flex flex-row items-center ">
              <img
                src="../GreenLogos/GreenLogo-gray-1.png"
                alt="greengraylogo"
                className="h-8 mr-2"
              />
              Initial Event Inquiry
            </h3>
            <p className="ml-1 mb-3">
              We initiate by collecting the essential information about the
              incident.
            </p>
          </div>
          <div className="flex flex-col ">
            <h3 className="mb-2 text-left  text-MainGreen-300 flex flex-row items-center">
              <img
                src="../GreenLogos/GreenLogo-gray-2.png"
                alt="greengraylogo"
                className="h-8 mr-2"
              />
              Incident Occurrence Details
            </h3>
            <p className="ml-1 mb-3">
              The second segment delves into the specifics of how the incident
              unfolded.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="mb-2 text-left text-MainGreen-300 flex flex-row items-center">
              <img
                src="../GreenLogos/GreenLogo-gray-3.png"
                alt="greengraylogo"
                className="h-8 mr-2"
              />
              Vital Information
            </h3>
            <p className="ml-1 mb-3">
              In the third section, we collect essential data on parties
              involved.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="mb-2 text-left text-MainGreen-300 flex flex-row items-center">
              <img
                src="../GreenLogos/GreenLogo-gray-4.png"
                alt="greengraylogo"
                className="h-8 mr-2"
              />
              Response Review{" "}
            </h3>
            <p className="ml-1 mb-3">
              {" "}
              Lastly, the fourth section involves carefully reviewing your
              responses for accuracy and accepting the declaration.
            </p>
          </div>
        </div>
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

      <div className="flex flex-row w-full place-content-between h-10 justify-end">
        <button
          type="submit"
          className="w-16 h-14 mr-6 rounded-full bg-MainGreen-300 text-white"
        >
          <FontAwesomeIcon icon={faArrowRightLong} className="w-full text-xl" />
        </button>
      </div>

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
