import { getReports } from "@/firebase/clientApp";
import { reportDataType, reportSearch } from "@/utils/utils";
import { useEffect, useState } from "react";
import Loading from "../loading";

interface reportListProps {
  status: "all" | "finished" | "unfinished";
  filter: "id" | "driver" | "numberplate" | "date";
  search: string;
  itemsPerPage: number;
  currentPage: number; // Add currentPage to the interface
  currentSelectedReports: (selected: {id: string, data: reportDataType}[]) => void;
}

const ReportList = ({
  status,
  filter,
  search,
  itemsPerPage,
  currentSelectedReports,
}: reportListProps) => {
  const [reportList, setReportList] =
    useState<{ id: string; data: reportDataType }[]>([]);
  const [filteredReportList, setFilteredReportList] =
    useState<{ id: string; data: reportDataType }[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedReports, setSelectedReports] = useState<{id: string, data: reportDataType}[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    currentSelectedReports(selectedReports)
  }, [selectedReports])

  /* Load server data */
  useEffect(() => {
    const fetchReportList = async () => {
      try {
        const data = await getReports();
        setReportList(data);
        setFilteredReportList(data);
        setLoaded(true);
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
    if (filteredReportList) {
      newPage = Math.max(
        1,
        Math.min(newPage, Math.ceil(filteredReportList.length / itemsPerPage))
      );
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = filteredReportList
    ? Math.min(startIndex + itemsPerPage, filteredReportList.length)
    : 0;
  return (
    <div className="w-full px-6 h-full">
      <div className="rounded-t-md w-full shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-MainGreen-300 text-white">
            <tr className="text-center">
              <th className="w-1/12 font-normal">
                <input type="checkbox" className="scale-150"
                  onChange={(e) => {
                      const isChecked = e.target.checked;

                      if (isChecked) {
                        setSelectedReports(filteredReportList);
                      } else {
                        setSelectedReports([]);
                      }
                    }}
                  />
              </th>
              <th className="w-2/12 font-normal">ID</th>
              <th className="w-2/12 font-normal">Name</th>
              <th className="w-2/12 font-normal">Numberplate</th>
              <th className="w-1/12 font-normal">Status</th>
              <th className="w-2/12 font-normal">Date</th>
            </tr>
          </thead>
        </table>
      </div>
      {/* Table body container with fixed height */}
      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto rounded-t-md">
        <div className="w-full">
          <table className="w-full">
            <tbody>
              {!loaded ? (
                /* LOADING  */
                <tr className="flex justify-center">
                  <td>
                    <Loading />
                  </td>
                </tr>
              ) : filteredReportList.length > 0 ? (
                filteredReportList
                  .slice(startIndex, endIndex)
                  .map((report, index) => (
                    <tr
                      key={index}
                      className="even:bg-blue-50 odd:bg-white text-center"
                    >
                      <td className="w-1/12 py-2">
                        <input type="checkbox" name={`${index}check`} id={`${index}check`} className="scale-150" 
                          checked={selectedReports.some(selected => selected.id === report.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;

                            if (isChecked) {
                              setSelectedReports((prevReports) => [
                                ...prevReports,
                                { id: report.id, data: report.data },
                              ]);
                            } else {
                              setSelectedReports((prevReports) =>
                                prevReports.filter((prevReport) => prevReport.id !== report.id)
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="w-2/12">{report.id}</td>
                      <td className="w-2/12">
                        {report.data.driverInfo.firstName !== ""
                          ? `${report.data.driverInfo.firstName} ${report.data.driverInfo.lastName}`
                          : "-"}
                      </td>
                      <td  className="w-2/12">
                        {report.data.greenCarNumberPlate !== ""
                          ? `${report.data?.greenCarNumberPlate.toUpperCase()}`
                          : "-"}
                      </td>
                      <td className="w-1/12">
                        {report.data.finished ? ("Finished") : 
                        ("Unfinished")}
                      </td>
                      <td className="w-2/12">
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

          {/* Pagination buttons */}
          <div className="flex justify-center mt-2">
            <button
              className="mr-2 px-4 py-2 bg-MainGreen-300 rounded-md w-20 flex items-center justify-center text-white"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1} // Disable the button when on the first page
            >
              Previous
            </button>
            <span className="flex items-center justify-between">
              Page {currentPage} of
              <span className="ml-1">
                {Math.ceil((filteredReportList?.length || 0) / itemsPerPage)}
              </span>
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

export default ReportList;
