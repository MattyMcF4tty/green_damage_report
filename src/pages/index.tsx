import { Inputfield } from "@/components/custom_inputfields";
import { createDoc, updateData } from "@/firebase/clientApp";
import { generateId } from "@/utils/utils";
import { useRouter } from "next/router";
import React, { useState } from "react";

const IndexPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = await generateId();

    await createDoc(id, email);
    console.log("Report created:\n" + "id: " + id + "\n" + "Email: " + email);

    router.push(`damagereport/what?id=${id}`);
  };

  return (
    <form
      onSubmit={(e) => handleStart(e)}
      className="flex flex-col items-center"
    >
      <div className="text-center text-2xl text-MainGreen-300 font-semibold"></div>
      <div className="container mx-auto p-8">
        <h2 className="text-[16px] font-semibold mb-4">
          What to anticipate in this damage report{" "}
        </h2>
        <div className="mb-4">
          <div className="flex flex-col">
            <h3 className="mb-2 text-left  text-MainGreen-300 flex flex-row items-center">
              <img
                src="../GreenLogos/GreenLogo-gray-1.png"
                alt="greengraylogo"
                className="h-8 mr-2"
              />
              Initial Event Inquiry
            </h3>
            <h3 className="ml-1">
              {" "}
              We initiate by collecting the essential information about the
              incident
            </h3>
          </div>
          <div className="flex flex-col ">
            <h3 className="mb-2 text-left  text-MainGreen-300 flex flex-row items-center">
              <img
                src="../GreenLogos/GreenLogo-gray-2.png"
                alt="greengraylogo"
                className="h-8 mr-2"
              />
              Incident Occurrence Details{" "}
            </h3>{" "}
            <h3 className="ml-1">
              {" "}
              The second segment delves into the specifics of how the incident
              unfolded.
            </h3>
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
            <h3 className="ml-1">
              {" "}
              In the third section, we collect essential data on parties
              involved
            </h3>
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
            <h3 className="ml-1">
              {" "}
              Lastly, the fourth section involves carefully reviewing your
              responses for accuracy and accepting the declaration.
            </h3>
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
        />
      </div>

      <div className="flex flex-row w-full place-content-between h-10 mt-10">
        <button className="w-2/5 bg-MainGreen-300 text-white">Previous</button>
        <button type="submit" className="w-2/5 bg-MainGreen-300 text-white">
          Next
        </button>
      </div>
    </form>
  );
};

export default IndexPage;
