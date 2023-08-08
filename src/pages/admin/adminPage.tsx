import React, { useState } from "react";

const adminPage = () => {
  const [activeSection, setActiveSection] = useState("All");

  return (
    <div className="w-full h-[calc(100vh-6rem)] bg-white rounded-md">
      <div className="flex flex-row w-full justify-start items-center mb-10">
        <button
          className={`h-20 flex flex-col items-center justify-center text-lg cursor-pointer relative w-24 ${
            activeSection === "All" ? "text-green-700" : ""
          }`}
          onClick={() => setActiveSection("All")}
        >
          <span>All</span>
          {activeSection === "All" && (
            <div className="absolute bottom-0 w-full h-1 bg-green-700"></div>
          )}
        </button>
        <button
          className={`h-20 w-32 flex flex-col items-center justify-center text-lg cursor-pointer relative ${
            activeSection === "Unfinished" ? "text-green-700" : ""
          }`}
          onClick={() => setActiveSection("Unfinished")}
        >
          <span>Unfinished</span>
          {activeSection === "Unfinished" && (
            <div className="absolute bottom-0 w-full h-1 bg-green-700"></div>
          )}
        </button>
        <button
          className={`h-20 w-32 flex flex-col items-center justify-center text-lg cursor-pointer relative ${
            activeSection === "Finished" ? "text-green-700" : ""
          }`}
          onClick={() => setActiveSection("Finished")}
        >
          <span>Finished</span>
          {activeSection === "Finished" && (
            <div className="absolute bottom-0 w-full h-1 bg-green-700"></div>
          )}
        </button>
      </div>
      <div className="flex flex-row items-center justify-between mb-8">
        <div className="flex flex-row w-1/6 justify-between">
          <button
            type="button"
            className="bg-white border-gray-300 border-[1px] rounded-lg w-1/3"
          >
            Delete
          </button>
          <button
            type="button"
            className="bg-white border-gray-300 border-[1px] rounded-lg w-1/3"
          >
            Print
          </button>
        </div>
        <div className="relative flex flex-row items-center">
          <input
            type="search"
            className="relative h-10 m-0 block w-[400px] rounded border border-solid border-green-500 bg-transparent bg-clip-padding pl-10 pr-[0.75rem] py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-green-500 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-green-500"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon2"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
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
      <div className="bg-gray-200 h-[calc(100vh-15rem)]">
        <p>liste</p>
        {/* Other list items */}
      </div>
    </div>
  );
};

export default adminPage;
