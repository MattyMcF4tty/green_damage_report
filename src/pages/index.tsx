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
      <div className="text-center text-2xl text-MainGreen-300 font-semibold">
        <h1>GreenMobility damage report</h1>
      </div>
      <div className="container mx-auto p-8">
        <h2 className="text-[16px] font-semibold mb-4">

        What you can anticipate in this damage report        </h2>
        <div className="border-[8px] border-MainGreen-200 shadow-lg ">
          <div className="flex flex-col">
            
            <h3 className="mb-2 text-left font-bold">
           1. Initial Event Inquiry:
            </h3>
            <h3 className="ml-1"> We initiate by exploring the events that took place.</h3>             
          </div>
          <div className="flex flex-col ">
            <h3 className="mb-2 text-left font-bold">
           2. Incident Occurrence Details: </h3> <h3 className="ml-1"> The second segment delves into the specifics of how the incident unfolded.
            </h3>
          </div>
          <div className="flex flex-col">
            <h3 className="mb-2 text-left font-bold">
           3. Vital Information:</h3><h3 className="ml-1"> In the third section, we collect essential data crucial to completing the report.
            </h3>
          </div>
          <div className="flex flex-col">
            <h3 className="mb-2 text-left font-bold">
           4. Personal Particulars:</h3><h3 className="ml-1"> On the fourth part, we kindly request certain personal details from you.
            </h3>
          </div>
          <div className="flex flex-col">
            <h3 className="mb-2 text-left font-bold">
           5. Response Review:</h3><h3 className="ml-1"> Lastly, the fifth section involves carefully reviewing your responses for accuracy and accepting the declaration.
            </h3>
          </div>
        </div>
        <Inputfield
          id="Email"
          labelText="Enter your Email"
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
