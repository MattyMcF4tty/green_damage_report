import React, { useState } from "react";
import adminNavbar from "@/components/admin/adminNav";
import ReportList from "@/components/admin/reportList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPrint,
  faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { getData, getImages, getReports } from "@/firebase/clientApp";
import { GetServerSidePropsContext, NextPage } from "next";
import { pageProps, reportDataType } from "@/utils/utils";
import ReportList2 from "@/components/admin/reportList2";



const adminPage: NextPage = () => {
  const [currentStatusFilter, setCurrentStatusFilter] = useState<'all' | 'finished' | 'unfinished'>('all');

  const [activeSection, setActiveSection] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const reportsPerPage = 20;
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;

  let totalPages: number = 0;
  let currentReports: {
    id: string;
    data: reportDataType;
  }[] = [];

/*   if (reportList) {
    totalPages = Math.ceil(reportList.length / reportsPerPage);
    currentReports = reportList.slice(startIndex, endIndex);
  } */

  // Function to handle changing the page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Apply filtering based on activeSection
/*   const reportsToShow = reportList!.filter((report) => {
    if (report === null) {
      return false;
    } else if (activeSection === "All") {
      return true;
    } else if (activeSection === "Unfinished") {
      return !report.data.finished;
    } else if (activeSection === "Finished") {
      return report.data.finished;
    }
    return false;
  });
 */
  return (
    <div className="w-full h-full bg-white rounded-md overflow-hidden">
      {/* Report status selection */}
      <div className="flex flex-row w-full justify-start items-center border-b border-gray-300">
        <button
          className={`h-14 flex flex-col items-center justify-center text-lg cursor-pointer relative w-24 ${
            currentStatusFilter === 'all' ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setCurrentStatusFilter('all')}
        >
          <span>All</span>
          {activeSection === "All" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
        <button
          className={`h-14 w-32 flex flex-col items-center justify-center text-lg cursor-pointer relative ${
            currentStatusFilter === 'unfinished' ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setCurrentStatusFilter('unfinished')}
        >
          <span>Unfinished</span>
          {activeSection === "Unfinished" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
        <button
          className={`h-14 w-32 flex flex-col items-center justify-center text-lg cursor-pointer relative ${
            currentStatusFilter === "finished" ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setCurrentStatusFilter('finished')}
        >
          <span>Finished</span>
          {activeSection === "Finished" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
      </div>
      {/* middle section */}
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

        <div className="relative flex flex-row items-center">
          <input
            type="search"
            style={{
              borderColor: "#808080", // Green border color
              marginRight: "2rem",
            }}
            className="relative h-8 m-0 block w-[400px] rounded-lg shadow-md border border-solid border-neutral-300 bg-transparent bg-clip-padding pl-10 pr-[1rem] py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:ring-0 focus:border-[#3EA635] dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon2"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#3EA635] dark:text-neutral-400 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#3EA635" // Change the fill color to green
              className="h-5 w-5"
              onClick={() => {
                // Handle clear action here
              }}
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
      {/* Table section */}
      <div className="bg-white w-full shadow-lg h-[calc(100vh-13rem)]">
        <ReportList2
          status={currentStatusFilter}
          filter="driver"
          search=""
          itemsPerPage={20}
        />
      </div>
    </div>
  );
};

export default adminPage;
