import React from "react";
import { reportDataType } from "@/utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface reportListProps {
  reportList: (reportDataType | null)[];
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void; // Add this line
}

const ReportList = ({
  reportList,
  currentPage,
  totalPages,
  onPageChange,
}: reportListProps) => {
  const reportsPerPage = 20;
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = Math.min(startIndex + reportsPerPage, reportList.length);

  return (
    <div className="w-full px-6">
      <div className="rounded-t-md w-full shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-MainGreen-300 text-white">
            <tr className="text-center">
              <th className="w-1/5">ID</th>
              <th className="w-1/5">Name</th>
              <th className="w-1/5">Numberplate</th>
              <th className="w-1/5">Status</th>
              <th className="w-1/5">Date</th>
            </tr>
          </thead>
        </table>
      </div>
      {/* Table body container with fixed height */}
      <div className="max-h-[calc(100vh-14rem)] overflow-y-auto">
        <div className="w-full">
          <table className="w-full">
            <tbody>
              {reportList.slice(startIndex, endIndex).map((report, index) => (
                <tr
                  className="even:bg-blue-50 odd:bg-white text-center"
                  key={index}
                >
                  <td className="w-1/5">dQvpvpXS1m6zZQU6</td>
                  <td className="w-1/5">
                    {index} {report?.driverInfo.firstName}{" "}
                    {report?.driverInfo.lastName}
                  </td>
                  <td className="w-1/5">{report?.greenCarNumberPlate}</td>
                  <td className="w-1/5">{`${report?.finished}`}</td>
                  <td className="w-1/5">{report?.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination buttons */}
          <div className="flex justify-center mt-2">
            <button
              className="mr-2 px-4 py-2 bg-MainGreen-300 rounded-md w-20 flex items-center justify-center text-white"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1} // Disable the button when on the first page
            >
              Previous
            </button>
            <span className="flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="ml-2 px-4 py-2 bg-MainGreen-300 rounded-md w-20 flex items-center justify-center text-white"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages} // Disable the button when on the last page
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
