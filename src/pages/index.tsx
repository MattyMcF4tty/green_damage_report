import Link from "next/link";
import { NavButtons } from "@/components/navigation";
import { handleRequest } from "@/utils/serverUtils";
import { useRouter } from "next/router";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";

const IndexPage = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {};
    await handleRequest(data);

    router.push("/what");
  };

  const handleNextClick = () => {
    router.push("/what");
  };

  return (
    <div onSubmit={(e) => handleSubmit(e)}>
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
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-1/3 justify-start h-12  ml-10">
          <BackButton pageName="" />
        </div>

        <div className="flex flex-row w-1/3 justify-end mr-10">
          <button
            type="button"
            className="text-white bg-MainGreen-300 w-full h-full"
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
