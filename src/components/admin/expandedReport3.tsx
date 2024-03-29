import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import { fetchDamageReportFolderFilesUrl } from "@/utils/logic/damageReportLogic.ts/apiRoutes";

interface ExpandedReport3Props {
  setVisible: (visibility: boolean) => void;
  reports: { id: string; data: AdminDamageReport }[];
}

const ExpandedReport3 = ({ setVisible, reports }: ExpandedReport3Props) => {
  const [currentReport, setCurrentReport] = useState<{
    id: string;
    data: AdminDamageReport;
  }>(reports[0]);
  const [currentImages, setCurrentImages] = useState<
  {fileName: string; downloadUrl: string;}[]
  >([]);

  useEffect(() => {
    const fetchImages = async () => {
      setCurrentImages(
        await fetchDamageReportFolderFilesUrl(currentReport.id, "/OtherPartyDamages/")
      );
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
      <div className="grid grid-cols-4 gap-x-8  gap-y-4 w-full px-10 py-6 bg-gray-100">
        {/* Displays current reports info */}
        <div className="row-start-1 row-span-1 col-span-1">
          <h1 className="text-xs ">Report Info</h1>
          <div className="p-4 bg-white grid grid-cols-1 grid-rows-3 gap-4 shadow-md h-[20rem]">
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

        {/* Displays current reports renter info */}
        <div className="row-start-1 col-start-2 row-span-1 col-span-2">
          <h1 className="text-xs">Renter Info</h1>
          <div className="p-4 bg-white grid grid-cols-2 grid-rows-2 gap-4 shadow-md h-[20rem]">
            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.renterInfo.firstName
                      ? `${currentReport.data.renterInfo.firstName}`
                      : "Unknown"
                  } ${
                    currentReport.data.renterInfo.lastName
                      ? `${currentReport.data.renterInfo.lastName}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Name</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.renterInfo.firstName
                  ? `${currentReport.data.renterInfo.firstName}`
                  : "-"}{" "}
                {currentReport.data.renterInfo.lastName
                  ? `${currentReport.data.renterInfo.lastName}`
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
                    currentReport.data.renterInfo.phoneNumber
                      ? `${currentReport.data.renterInfo.phoneNumber}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-2 col-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Phonenumber</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.renterInfo.phoneNumber
                  ? `${currentReport.data.renterInfo.phoneNumber}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.renterInfo.birthDate
                      ? `${currentReport.data.renterInfo.birthDate}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-2 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Birthday</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.renterInfo.birthDate
                  ? `${currentReport.data.renterInfo.birthDate}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.renterInfo.customerId
                      ? `${currentReport.data.renterInfo.customerId}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-3 col-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Customer id</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.renterInfo.customerId
                  ? `${currentReport.data.renterInfo.customerId}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.renterInfo.reservationId
                      ? `${currentReport.data.renterInfo.reservationId}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-3 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Reservations id</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.renterInfo.reservationId
                  ? `${currentReport.data.renterInfo.reservationId}`
                  : "-"}
              </span>
            </div>

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.renterInfo.email
                      ? `${currentReport.data.renterInfo.email}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-4 col-start-1 col-span-2 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Email</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.renterInfo.email
                  ? `${currentReport.data.renterInfo.email}`
                  : "-"}
              </span>
            </div>
            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `${
                    currentReport.data.renterInfo.insurance
                      ? `${currentReport.data.renterInfo.insurance}`
                      : "Unknown"
                  }`
                )
              }
              className="row-start-4 col-start-2 col-span-2 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <p className="text-sm">Insurance</p>
              <span className={`${dataTextStyle}`}>
                {currentReport.data.renterInfo.insurance
                  ? `${currentReport.data.renterInfo.insurance}`
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Displays current reports police info */}
        <div className="row-start-1 col-start-4 row-span-1">
          <h1 className="text-xs">Police Info</h1>
          <div className="p-4 bg-white grid grid-cols-1 grid-rows-4 gap-4 shadow-md h-[20rem]">
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

        {/* Displays current reports Driver info  */}
        {currentReport.data.driverInfo.firstName && (
          <div className="row-start-2 col-start-1 col-span-2 row-span-1 h-[25rem] min-w-full">
            <h1 className="text-xs">Driver Info</h1>
            <div className="p-4 bg-white grid grid-cols-2 grid-rows-5 gap-4 shadow-md h-full">
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
                      currentReport.data.driverInfo.validDriversLicense
                        ? `${currentReport.data.driverInfo.validDriversLicense}`
                        : "Unknown"
                    }`
                  )
                }
                className="row-start-1 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
              >
                <p className="text-sm">Valid drivers license?</p>
                <span className={`${dataTextStyle}`}>
                  {currentReport.data.driverInfo.validDriversLicense
                    ? `Yes`
                    : "No"}
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
                className="row-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
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
                className="row-start-4 col-start-1 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
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
        )}

        {/* Displays current reports accident info  */}
        <div className="row-start-3 col-start-1 col-span-2 row-span-1 h-[20rem] mt-4">
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

            <div
              onClick={() =>
                navigator.clipboard.writeText(
                  `lat: ${
                    currentReport.data.accidentLocation.lat
                      ? `${currentReport.data.accidentLocation.lat}`
                      : "-"
                  } lng: ${
                    currentReport.data.accidentLocation.lat
                      ? `${currentReport.data.accidentLocation.lat}`
                      : "-"
                  }`
                )
              }
              className="row-start-1 col-start-2 col-span-1 hover:bg-gray-50 hover:shadow-md flex flex-col justify-center hover:cursor-pointer"
            >
              <h1 className="text-sm">Accident location</h1>
              <span className={`${dataTextStyle}`}>
                {`lat: ${
                  currentReport.data.accidentLocation.lat
                    ? `${currentReport.data.accidentLocation.lat}`
                    : "-"
                } lng: ${
                  currentReport.data.accidentLocation.lat
                    ? `${currentReport.data.accidentLocation.lat}`
                    : "-"
                }`}
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

        {/* Displays current reports witness list */}
        <div className="row-start-3 col-start-3 col-span-2 row-span-1 max-h-[20rem] mt-4">
          <h1 className="text-xs">Witnesses</h1>
          <div className="bg-white grid grid-cols-1 gap-1 shadow-md overflow-y-auto no-scrollbar h-full">
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
                          <td
                            onClick={() =>
                              navigator.clipboard.writeText(
                                currentWitness.name ? currentWitness.name : "-"
                              )
                            }
                            className={`text-lg hover:cursor-pointer hover:bg-MainGreen-100 hover:shadow-md`}
                          >
                            {currentWitness.name}
                          </td>
                          <td
                            onClick={() =>
                              navigator.clipboard.writeText(
                                currentWitness.phone
                                  ? currentWitness.phone
                                  : "-"
                              )
                            }
                            className={`text-lg hover:cursor-pointer hover:bg-MainGreen-100 hover:shadow-md`}
                          >
                            {currentWitness.phone}
                          </td>
                          <td
                            onClick={() =>
                              navigator.clipboard.writeText(
                                currentWitness.email
                                  ? currentWitness.email
                                  : "-"
                              )
                            }
                            className={`text-lg hover:cursor-pointer hover:bg-MainGreen-100 hover:shadow-md`}
                          >
                            {currentWitness.email}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="p-4">No witnesses</p>
            )}
          </div>
        </div>

        {/* Displays current report pictures of green car */}
        <div className="p-4 row-start-5 col-start-1 col-span-2 row-span-4">
          <p className="text-xs mt-4">Positions of damages</p>
          <div className="p-4 bg-white shadow-md">
            {currentReport.data.damages.length > 0 ? (
              <div className="flex flex-col">
                {" "}
                {/* Wrap content in a flex container */}
                {currentReport.data.damages.map((damage, index) => (
                  <div
                    className="flex flex-col py-2 px-5 w-full mb-6"
                    key={index}
                  >
                    <p className="break-words">Position: {damage.position}</p>
                    <p className="break-words">
                      Description: {damage.description}
                    </p>
                    <div className="">
                      <p>Images:</p>
                      <div className="flex flex-wrap">
                        {damage.images.length > 0 &&
                          damage.images.map((image, index) => (
                            <img
                              className="h-[15rem] w-[15rem] m-1"
                              key={index}
                              src={image}
                              alt="Damage"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No damage positions</p>
            )}
          </div>
        </div>
        {/* Images of damages to other party car */}
        <div className="p-4 row-start-5 col-start-3 col-span-2 row-span-4">
          <p className="text-xs mt-4">
            Pictures of the damages to the other Party involved
          </p>

          <div className="p-4 bg-white shadow-md">
            {currentImages.length > 0 ? (
              currentImages.map((image, index) => (
                <img
                  key={index}
                  src={image.downloadUrl}
                  alt="DamageImage"
                  className="w-[15rem] h-[15rem]"
                />
              ))
            ) : (
              <p>No images</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExpandedReport3;
