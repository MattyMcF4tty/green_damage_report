import { getData, getReports } from "@/firebase/clientApp";
import { reportDataType, reportSearch } from "@/utils/utils";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import Loading from "../loading";

interface reportListProps {
  status: "all" | "finished" | "unfinished";
  filter: "id" | "driver" | "numberplate" | "date";
  search: string;
  itemsPerPage: number;
}

const ReportList2 = ({
  status,
  filter,
  search,
  itemsPerPage,
}: reportListProps) => {
  const [reportList, setReportList] =
    useState<{ id: string; data: reportDataType }[]>(); // Initialize with null
  const [filteredReportList, setFilteredReportList] =
    useState<{ id: string; data: reportDataType }[]>(); // Initialize with null
  const [currentPage, setCurrentPage] = useState<number>(1);

  /* Load server data */
  useEffect(() => {
    const fetchReportList = async () => {
      try {
        const data = await getReports();
        setReportList(data);
        setFilteredReportList(data);
      } catch (error) {
        console.error(
          `Something went wrong fetching data for reportList:\n${error}\n`
        );
      }
    };

    fetchReportList();
  }, []);

  useEffect(() => {
    if (reportList) {
      const filteredList = reportSearch(reportList, status, filter, search);
      setFilteredReportList(filteredList);
    }
  }, [status, filter, search, reportList]);

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full px-6 h-full">
      <div className="rounded-t-md w-full shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-MainGreen-300 text-white">
            <tr className="text-center">
              <th className="w-1/5 font-normal">ID</th>
              <th className="w-1/5 font-normal">Name</th>
              <th className="w-1/5 font-normal">Numberplate</th>
              <th className="w-1/5 font-normal">Status</th>
              <th className="w-1/5 font-normal">Date</th>
            </tr>
          </thead>
        </table>
      </div>
      {/* Table body container with fixed height */}
      <div className="max-h-[calc(100vh-15rem)] overflow-y-auto rounded-t-md">
        <div className="w-full">
          <table className="w-full">
            <tbody>
              {!filteredReportList ? (
                /* LOADING  */
                <tr className="flex justify-center">
                  <td>
                    <Loading />
                  </td>
                </tr>
              ) : filteredReportList.length > 0 ? (
                filteredReportList.map((report, index) => (
                  <tr
                    key={index}
                    className="even:bg-blue-50 odd:bg-white text-center"
                  >
                    <td className="w-1/5 py-2">{report.id}</td>
                    <td className="w-1/5">
                      {report.data.driverInfo.firstName !== ""
                        ? `${report.data.driverInfo.firstName} ${report.data.driverInfo.lastName}`
                        : "-"}
                    </td>
                    <td className="w-1/5">
                      {report.data.greenCarNumberPlate !== ""
                        ? `${report.data?.greenCarNumberPlate.toUpperCase()}`
                        : "-"}
                    </td>
                    <td className="w-1/5">{`${report.data.finished}`}</td>
                    <td className="w-1/5">
                      {report.data.date !== "" ? `${report.data.date}` : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                filteredReportList.length <= 0 && (
                  /* No matches  */
                  <tr className="flex justify-center">
                    <td>No Matches</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <div className="flex flex-row text-sm">
            <p>/{filteredReportList ? `${filteredReportList.length}` : "0"}</p>
          </div>

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
              Page {currentPage} of
              {Math.ceil((filteredReportList?.length || 0) / itemsPerPage)}
            </span>
            <button
              className="ml-2 px-4 py-2 bg-MainGreen-300 rounded-md w-20 flex items-center justify-center text-white"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil((filteredReportList?.length || 0) / itemsPerPage)
              } // Disable the button when on the last page
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportList2;
