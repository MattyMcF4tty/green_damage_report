import React, { useState } from "react";
import ReportList from "@/components/admin/reportList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPrint,
  faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { NextPage } from "next";
import { reportDataType } from "@/utils/utils";
import ExpandedReport from "@/components/admin/expandedReport";
import ReportList2 from "@/components/admin/reportList";

const adminPage: NextPage = () => {
  const [currentStatus, setCurrentStatus] = useState<
    "all" | "finished" | "unfinished"
  >("all");
  const [currentFilter, setCurrentFilter] = useState<
    "id" | "driver" | "numberplate" | "date"
  >("id");
  const [currentSearch, setCurrentSearch] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);

  const reportsPerPage = 20;
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;

  let totalPages: number = 0;
  let currentReports: {
    id: string;
    data: reportDataType;
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

      {/* Search and control panel */}
      <div className="flex flex-row justify-between my-6 items-baseline ">
        <div className="flex flex-row w-1/3 justify-between ml-8">
          <button
            type="button"
            className="bg-white border-gray-300 border-[1px] rounded-xl w-32  hover:bg-red-600 hover:text-white duration-150"
          >
            <FontAwesomeIcon icon={faTrashCan} />
            {" Delete"}
          </button>
          <button
            type="button"
            className="bg-white border-gray-300 border-[1px] rounded-xl w-32 hover:bg-MainGreen-300 hover:text-white duration-150"
          >
            <FontAwesomeIcon icon={faPrint} />
            {" Print"}
          </button>
          <button
            type="button"
            className="bg-white border-gray-300 border-[1px] rounded-xl w-32 hover:bg-blue-500 hover:text-white duration-150"
          >
            <FontAwesomeIcon icon={faCloudArrowDown} />
            {" Download"}
          </button>
        </div>

        <div className="w-1/3 relative flex flex-row items-center ">
          <select
            className="h-8 border border-neutral-500 rounded-l-lg shadow-md outline-none"
            id="FilterOptions"
            value={currentFilter}
            onChange={(e) =>
              setCurrentFilter(
                e.target.value as "id" | "driver" | "numberplate" | "date"
              )
            }
          >
            <option value="id">Id</option>
            <option value="driver">Driver</option>
            <option value="numberplate">Numberplate</option>
            <option value="date">Date</option>
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
        <ReportList2
          status={currentStatus}
          filter={currentFilter}
          search={currentSearch}
          itemsPerPage={20}
          currentPage={currentPage} // Pass the currentPage prop
        />
      </div>
    </div>
  );
};

export default adminPage;
