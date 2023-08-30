import { reportDataType } from "@/utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getImages } from "@/firebase/clientApp";
import Loading from "../loading";
import ImageCarousel from "./imageCarousel";

interface ExpandedReportProps {
  setVisible: (visibility: boolean) => void;
  reports: { id: string; data: reportDataType }[];
}

const ExpandedReport = ({ setVisible, reports }: ExpandedReportProps) => {
  const [currentReport, setCurrentReport] = useState<{
    id: string;
    data: reportDataType;
  }>(reports[0]);
  const [currentImages, setCurrentImages] = useState<Record<string, string[]>>(
    {}
  );

  useEffect(() => {
    const fetchImages = async () => {
      setCurrentImages(await getImages(currentReport.id));
    };

    fetchImages();
  }, [currentReport]);

  const dataTextStyle = "text-xl break-words";

  return (
    <div className="absolute flex flex-col min-h-[100vh] w-full z-40 bg-white left-0 top-0">
      <div className="flex flex-row w-full h-14 bg-MainGreen-300 items-start overflow-x-auto overflow-y-hidden no-scrollbar">
        <button
          onClick={() => setVisible(false)}
          className={`border-b-[1px] border-gray-200 mt-auto h-3/4 bg-white hover:bg-red-400 duration-100 
        ${reports.length > 1 ? "rounded-tl-lg" : "rounded-t-lg"}`}
        >
          <FontAwesomeIcon
            icon={faX}
            className="text-lg flex justify-center items-center w-16"
          />
        </button>

        {reports.length > 1 && (
          <div className="flex flex-row mt-auto h-3/4">
            {reports.map((report, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setCurrentReport(report)}
                className={`w-52 hover:bg-gray-100 duration-100 border-b-[1px] flex justify-center items-center
              ${
                report.id === currentReport.id
                  ? "bg-gray-100 font-semibold drop-shadow-lg border-gray-100"
                  : "bg-white border-gray-200"
              }
              ${reports.length - 1 === index && "rounded-tr-lg mr-2"}`}
              >
                {report.id}
                <button
                  type="button"
                  onClick={() => setCurrentReport(reports[index - 1])}
                  className="ml-1 hover:bg-MainGreen-200 w-6 h-6 flex justify-center items-center rounded-md duration-100"
                >
                  <FontAwesomeIcon icon={faX} className="text-sm" />
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current report data */}
      <div className="grid grid-cols-4 gap-x-8 gap-y-4 w-full px-10 py-6 bg-gray-100">
        {/* Displays current reports info */}
        <div className="row-start-1 row-span-1 col-span-1">
          <h1 className="text-xs ">Report Info</h1>
          <div className="p-4 bg-white grid grid-cols-1 grid-rows-3 gap-4 shadow-md">
            <div
              onClick={() => navigator.clipboard.writeText(currentReport.id)}
              className="row-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Report ID</h1>
              <span className={`${dataTextStyle}`}>{currentReport.id}</span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  currentReport.data.finished ? "Finished" : "Unfinished"
                )
              }
              className="row-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Report status</h1>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.finished ? "Finished" : "Unfinished"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.userEmail
                      ? `${currentReport.data.userEmail}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-3 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">User Email</h1>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.userEmail
                  ? `${currentReport.data.userEmail}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${currentReport.data.lastChange}`
                )
              }
              className="row-start-4 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Updated</h1>
              <span className={`${dataTextStyle}`}>
                {`${currentReport.data.lastChange}`}
              </span>
            </div>
          </div>
        </div>

        {/* Displays current reports driver info */}
        <div className="row-start-1 col-start-2 row-span-1 col-span-2">
          <h1 className="text-xs">Driver Info</h1>
          <div className="p-4 bg-white grid grid-cols-2 grid-rows-3 gap-4 shadow-md">
            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.driverInfo.firstName
                      ? `${currentReport.data.driverInfo.firstName}`
                      : "Unknown"
                  } ${
                    currentReport.data.driverInfo.lastName
                      ? `${currentReport.data.driverInfo.lastName}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Name</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.driverInfo.firstName
                  ? `${currentReport.data.driverInfo.firstName}`
                  : "-"}{" "}
                {currentReport.data.driverInfo.lastName
                  ? `${currentReport.data.driverInfo.lastName}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.driverRenter === null
                      ? `Unknown`
                      : currentReport.data.driverRenter
                      ? "Driver was renter"
                      : "Driver was not renter"
                  }`
                )
              }
              className="row-start-1 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Driver</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.driverRenter === null
                  ? `-`
                  : currentReport.data.driverRenter
                  ? "Driver was renter"
                  : "Driver was not renter"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.driverInfo.phoneNumber
                      ? `${currentReport.data.driverInfo.phoneNumber}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-2 col-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Phonenumber</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.driverInfo.phoneNumber
                  ? `${currentReport.data.driverInfo.phoneNumber}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.driverInfo.drivingLicenseNumber
                      ? `${currentReport.data.driverInfo.drivingLicenseNumber}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-2 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Driving license nubmer</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.driverInfo.drivingLicenseNumber
                  ? `${currentReport.data.driverInfo.drivingLicenseNumber}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.driverInfo.socialSecurityNumber
                      ? `${currentReport.data.driverInfo.socialSecurityNumber}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-3 col-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Social security number</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.driverInfo.socialSecurityNumber
                  ? `${currentReport.data.driverInfo.socialSecurityNumber}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.driverInfo.address
                      ? `${currentReport.data.driverInfo.address}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-3 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Address</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.driverInfo.address
                  ? `${currentReport.data.driverInfo.address}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.driverInfo.email
                      ? `${currentReport.data.driverInfo.email}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-4 col-start-1 col-span-2 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Email</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.driverInfo.email
                  ? `${currentReport.data.driverInfo.email}`
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Displays current reports police info */}
        <div className="row-start-1 col-start-4 row-span-1">
          <h1 className="text-xs">Police Info</h1>
          <div className="p-4 bg-white grid grid-cols-1 grid-rows-4 gap-4 shadow-md">
            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  currentReport.data.policePresent === null
                    ? "Unknown"
                    : currentReport.data.policePresent
                    ? "Police were present"
                    : "Police were not present"
                )
              }
              className="row-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Police present</h1>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.policePresent === null
                  ? "-"
                  : currentReport.data.policePresent
                  ? "Yes"
                  : "No"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  currentReport.data.policeReportExist === null
                    ? "Unknown"
                    : currentReport.data.policeReportExist
                    ? "Police report exists"
                    : "Police report does not exist"
                )
              }
              className="row-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Police report exist</h1>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.policeReportExist === null
                  ? "-"
                  : currentReport.data.policeReportExist
                  ? "Yes"
                  : "No"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.policeReportNumber
                      ? `${currentReport.data.policeReportNumber}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-3 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Police report number</h1>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.policeReportNumber
                  ? `${currentReport.data.policeReportNumber}`
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Displays current reports accident info  */}
        <div className="row-start-2 col-start-1 col-span-2 row-span-1 h-[25rem]">
          <h1 className="text-xs">Accident Info</h1>
          <div className="p-4 bg-white grid grid-cols-2 grid-rows-5 gap-4 shadow-md h-full">
            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  currentReport.data.greenCarNumberPlate
                    ? currentReport.data.greenCarNumberPlate
                    : "Unknown"
                )
              }
              className="row-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">GreenMobility numberplate</h1>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.greenCarNumberPlate
                  ? currentReport.data.greenCarNumberPlate
                  : "-"}
              </span>
            </div>

            <div onClick={() => navigator.clipboard.writeText(`lat: ${currentReport.data.accidentLocation.lat ? `${currentReport.data.accidentLocation.lat}` : "-"} lng: ${currentReport.data.accidentLocation.lat ? `${currentReport.data.accidentLocation.lat}` : "-"}`)}
            className="row-start-1 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer">
              <h1 className="text-sm">Accident location</h1>
              <span className="text-2xl">
                {`lat: ${currentReport.data.accidentLocation.lat ? `${currentReport.data.accidentLocation.lat}` : "-"} lng: ${currentReport.data.accidentLocation.lat ? `${currentReport.data.accidentLocation.lat}` : "-"}`}              
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  currentReport.data.speed
                    ? `${currentReport.data.speed} km/h`
                    : "Unknown"
                )
              }
              className="row-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Accident speed</h1>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.speed
                  ? `${currentReport.data.speed} km/h`
                  : "- km/h"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.time
                      ? `${currentReport.data.time}`
                      : "Unknown"
                  } - ${
                    currentReport.data.date
                      ? `${currentReport.data.date}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-2 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Time and date of accident</h1>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.time ? `${currentReport.data.time}` : ""}
                {" - "}
                {currentReport.data.date ? `${currentReport.data.date}` : ""}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  currentReport.data.accidentDescription
                    ? currentReport.data.accidentDescription
                    : "No description"
                )
              }
              className="row-start-3 row-span-3 col-span-2 hover:bg-gray-50 hover:shadow-md flex flex-col justify-start hover:cursor-pointer"
            >
              <h1 className="text-sm">Accident description</h1>
              <span className={`${dataTextStyle} break-words`}>
                {currentReport.data.accidentDescription
                  ? currentReport.data.accidentDescription
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Displays current reports witness list  */}
        <div className="row-start-2 col-start-3 col-span-2 row-span-1 max-h-[25rem]">
          <h1 className="text-xs">Witnesses</h1>
          <div className=" bg-white grid grid-cols-1 gap-1 shadow-md overflow-y-auto no-scrollbar h-full">
            {currentReport.data.witnesses.length > 0 ? (
              <div className="p-4">
                <table className="w-full">
                  <thead className="text-center sticky top-0 bg-MainGreen-300 text-white font-semibold h-8">
                    <tr className="">
                      <th className="font-normal text-sm w-1/3">Name</th>
                      <th className="font-normal text-sm">Phone number</th>
                      <th className="font-normal text-sm">Email</th>
                    </tr>
                  </thead>
                  <tbody className="text-center ">
                    {currentReport.data.witnesses.map(
                      (currentWitness, index) => (
                        <tr
                          key={index}
                          className="h-10 odd:bg-white even:bg-blue-50 "
                        >
                          <td onClick={() => navigator.clipboard.writeText(currentWitness.name)}
                          className={`text-lg hover:cursor-pointer hover:bg-MainGreen-100 hover:shadow-md`}>{currentWitness.name}</td>
                          <td onClick={() => navigator.clipboard.writeText(currentWitness.phone)}
                          className={`text-lg hover:cursor-pointer hover:bg-MainGreen-100 hover:shadow-md`}>{currentWitness.phone}</td>
                          <td onClick={() => navigator.clipboard.writeText(currentWitness.email)}
                          className={`text-lg hover:cursor-pointer hover:bg-MainGreen-100 hover:shadow-md`}>{currentWitness.email}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No witnesses</p>
            )}
          </div>
        </div>

        {/* Displays current report pictures of green car */}
        <div className="row-start-3 col-start-1 row-span-1">
          <h1 className="text-xs mt-4">Pictures of green car</h1>
          <div className="p-4 bg-white shadow-md w-full">
            {(currentImages["GreenMobility"] && currentImages["GreenMobility"].length > 0) ? (
              <ImageCarousel
                allowPopUp={true}
                images={currentImages["GreenMobility"]}
              />
            ) : (
              <div>
                No Images
              </div>
            )}
          </div>
        </div>

        {/* Displays current report pictures of other partys */}
        <div className="row-start-3 col-start-2 row-span-1">
          <h1 className="text-xs mt-4">Pictures of other partys</h1>
          <div className="p-4 bg-white shadow-md w-full">
            {(currentImages["OtherParty"] && currentImages["OtherParty"].length > 0) ? (
              <ImageCarousel
                allowPopUp={true}
                images={currentImages["OtherParty"]}
              />
            ) : (
              <div>
                No Images
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedReport;
