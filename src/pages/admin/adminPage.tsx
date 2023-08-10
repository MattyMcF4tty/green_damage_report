import React, { useState } from "react";
import adminNavbar from "@/components/admin/adminNav";
import ReportList from "@/components/admin/reportList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPrint,
  faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { getData, getImages } from "@/firebase/clientApp";
import { GetServerSidePropsContext, NextPage } from "next";
import { pageProps, reportDataType } from "@/utils/utils";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const data = await getData("dQvpvpXS1m6zZQU6");
  const images = await getImages("dQvpvpXS1m6zZQU6");

  return {
    props: {
      data: data || null,
      images: images || null,
    },
  };
};

const adminPage: NextPage<pageProps> = ({ data, images }) => {
  const [activeSection, setActiveSection] = useState("All");
  const [reportList, setReportList] = useState<(reportDataType | null)[]>([
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
    data,
  ]);
  const reportsPerPage = 20;
  const totalPages = Math.ceil(reportList.length / reportsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // Function to handle changing the page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  // Calculate the range of reports to display based on current page
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentReports = reportList.slice(startIndex, endIndex);

  // Apply filtering based on activeSection
  const reportsToShow = reportList.filter((report) => {
    if (report === null) {
      return false;
    }

    if (activeSection === "All") {
      return true;
    } else if (activeSection === "Unfinished") {
      return !report.finished;
    } else if (activeSection === "Finished") {
      return report.finished;
    }
    return false;
  });

  return (
    <div className="w-full h-full bg-white rounded-md overflow-hidden">
      {/* Top section */}
      <div className="flex flex-row w-full justify-start items-center border-b border-gray-300">
        <button
          className={`h-14 flex flex-col items-center justify-center text-lg cursor-pointer relative w-24 ${
            activeSection === "All" ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setActiveSection("All")}
        >
          <span>All</span>
          {activeSection === "All" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
        <button
          className={`h-14 w-32 flex flex-col items-center justify-center text-lg cursor-pointer relative ${
            activeSection === "Unfinished" ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setActiveSection("Unfinished")}
        >
          <span>Unfinished</span>
          {activeSection === "Unfinished" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
        <button
          className={`h-14 w-32 flex flex-col items-center justify-center text-lg cursor-pointer relative ${
            activeSection === "Finished" ? "text-MainGreen-300" : ""
          }`}
          onClick={() => setActiveSection("Finished")}
        >
          <span>Finished</span>
          {activeSection === "Finished" && (
            <div className="absolute bottom-0 w-full h-1 bg-MainGreen-300"></div>
          )}
        </button>
      </div>
      {/* middle section */}
      <div className="flex flex-row justify-between my-4 items-baseline ">
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
              borderColor: "#3EA635", // Green border color
              marginRight: "2rem",
            }}
            className="relative h-8 m-0 block w-[400px] rounded-lg border border-solid border-neutral-300 bg-transparent bg-clip-padding pl-10 pr-[1rem] py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:ring-0 focus:border-[#3EA635] dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
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
      <div className="bg-white w-full h-[calc(100vh-12rem)]">
        <ReportList
          reportList={reportsToShow}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange} // Pass the onPageChange handler
        />
      </div>
    </div>
  );
};

export default adminPage;
