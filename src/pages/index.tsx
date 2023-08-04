import { Inputfield } from "@/components/custom_inputfields";
import { createDoc, updateData } from "@/firebase/clientApp";
import { generateId } from "@/utils/utils";
import { useRouter } from "next/router";
import React, { useState } from "react";

const IndexPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("")

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const id = await generateId();
  
    await createDoc(id, email);
    console.log("Report created:\n" + "id: " + id + "\n" + "Email: " + email)

    router.push(`/what?id=${id}`)
  }

  return (
    <form onSubmit={(e) => handleStart(e)}
    className="flex flex-col items-center">
      <div className="text-center text-2xl text-MainGreen-300 font-semibold">
        <h1>GreenMobility damage report</h1>
      </div>
      <div className="container mx-auto p-8">
        <h2 className="text-[16px] font-semibold mb-4">
          What to expect in this damage report
        </h2>
        <div className="border-[8px] border-MainGreen-200 shadow-lg ">
          <div className="flex flex-row">
            <h3 className="px-1 mr-3">1.</h3>
            <h3 className="mb-2 text-left">
              This is the first page where we ask you about what happened.
            </h3>
          </div>
          <div className="flex flex-row ">
            <h3 className="px-1 mr-3">2. </h3>
            <h3 className="mb-2 text-left">
              This is the second page which is the page where we ask you how the
              incident happened.
            </h3>
          </div>
          <div className="flex flex-row">
            <h3 className="px-1 mr-3">3.</h3>
            <h3 className="mb-2 text-left">
              This is the third page where we need the last bit of information
              to complete the report.
            </h3>
          </div>
          <div className="flex flex-row">
            <h3 className="px-1 mr-3">4.</h3>
            <h3 className="mb-2 text-left">
              This is the fourth page here you are asked for some information
              about you.
            </h3>
          </div>
          <div className="flex flex-row">
            <h3 className="px-1 mr-3">5.</h3>
            <h3 className="mb-2 text-left">
              This is the fifth and final page here you are asked to check all
              your answers and make sure they are all correctly answered, and
              finally accept the decleration.
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
        <button className="w-2/5 bg-MainGreen-300">Previous</button>
        <button type="submit" className="w-2/5 bg-MainGreen-300">Next</button>
      </div>
    </form>
  );
};

export default IndexPage;
