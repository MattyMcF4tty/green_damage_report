import React, { useState } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import ReportList from "@/components/admin/reportList";
import ReportControls from "@/components/admin/reportControls";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import { requestUserVerification } from "@/utils/logic/firebaseLogic/authenticationLogic/apiRoutes";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  /* try {
    await requestUserVerification()
  } catch (error:any) {
    return {
      redirect: {
        destination: "/auth/signIn",
        permanent: false,
      },
    };
  } */

  return { props: {} };
};

const adminPage: NextPage = () => {
  const [currentStatus, setCurrentStatus] = useState<
    "all" | "finished" | "unfinished"
  >("all");
  const [currentFilter, setCurrentFilter] = useState<
    "id" | "customerId" | "numberplate" | "date"
  >("id");
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [selectedReports, setSelectedReports] = useState<
    { id: string; data: AdminDamageReport }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExpandedReports, setShowExpandedReports] =
    useState<boolean>(false);

  const reportsPerPage = 20;
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;

  let totalPages: number = 0;
  let currentReports: {
    id: string;
    data: AdminDamageReport;
  }[] = [];

  // Function to handle changing the page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full h-full bg-white rounded-md overflow-hidden">
      {/* Report status selection */}
      <div className="flex flex-row w-full justify-start items-center border-b border-gray-300">
        <button
          className={`h-14 flex flex-col items-center justify-center text-lg cursor-pointer relative w-24 ${
            currentStatus === "all" ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setCurrentStatus("all")}
        >
          <span>All</span>
          {currentStatus === "all" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
        <button
          className={`h-14 w-32 flex flex-col items-center justify-center text-lg cursor-pointer relative ${
            currentStatus === "unfinished" ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setCurrentStatus("unfinished")}
        >
          <span>Unfinished</span>
          {currentStatus === "unfinished" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
        <button
          className={`h-14 w-32 flex flex-col items-center justify-center text-lg cursor-pointer relative ${
            currentStatus === "finished" ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setCurrentStatus("finished")}
        >
          <span>Finished</span>
          {currentStatus === "finished" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
      </div>

      <div className="flex flex-row justify-between my-6 items-baseline ">
        <div className="w-2/5">
          <ReportControls selectedReports={selectedReports} />
        </div>
        <div className="w-1/3 relative flex flex-row items-center ">
          <select
            className="h-8 border border-neutral-500 rounded-l-lg shadow-md outline-none"
            id="FilterOptions"
            value={currentFilter}
            onChange={(e) =>
              setCurrentFilter(
                e.target.value as "id" | "customerId" | "numberplate" | "date"
              )
            }
          >
            <option value="id">Report ID</option>
            <option value="CustomerId">Customer ID</option>
            <option value="numberplate">Numberplate</option>
            <option value="date">Updated</option>
          </select>
          {currentFilter === "date" ? (
            <input
              className="pl-2 w-[400px] relative h-8 rounded-r-lg shadow-md border border-neutral-500 outline-none"
              type="date"
              value={currentSearch}
              onChange={(e) => setCurrentSearch(e.target.value)}
            />
          ) : (
            <input
              className="pl-2 w-[400px] relative h-8 rounded-r-lg shadow-md border border-neutral-500 outline-none"
              type="text"
              value={currentSearch}
              onChange={(e) => setCurrentSearch(e.target.value)}
              placeholder="Search"
            />
          )}
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white w-full max-h-[calc(100vh-13.5rem)] block shadow-lg overflow-hidden">
        <ReportList
          status={currentStatus}
          filter={currentFilter}
          search={currentSearch}
          itemsPerPage={20}
          currentPage={currentPage}
          currentSelectedReports={setSelectedReports}
        />
      </div>
    </div>
  );
};

export default adminPage;
