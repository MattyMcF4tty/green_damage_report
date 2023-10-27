import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import BackButton from "@/components/buttons/back";
import { CustomerDamageReport, CustomerDamageReportSchema } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faBox,
  faCar,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { handleSendEmail } from "@/utils/logic/misc";
import { DamageReportPageProps } from "@/utils/schemas/miscSchemas/pagePropsSchema";
import { fetchDamageReportFolderFilesUrl, patchCustomerDamageReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { getDamageReport } from "@/utils/logic/damageReportLogic.ts/logic";
import { Damage } from "@/utils/schemas/incidentDetailSchemas/damageSchema";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const reportId = context.query.id as string;

  const damageReport = new CustomerDamageReport();
  damageReport.updateFields(await getDamageReport(reportId));
  
  if (damageReport.isExpired() || damageReport.isFinished()) {
    return {
      redirect: {
        destination: "/damagereport/reportfinished",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data: damageReport.crypto('decrypt'),
      id: reportId,
    },
  };
};


const confirmationPage: NextPage<DamageReportPageProps> = ({ data, id }) => {
  const Router = useRouter();
  const serverData = new CustomerDamageReport();
  serverData.updateFields(data);
  const [allowClick, setAllowClick] = useState(true);
  const [confirmVis, setConfirmVis] = useState(false);
  const [otherPartyImageUrls, setOtherPartyImageUrls] = useState<string[]>([])
  const [serverDataState, setServerDataState] = useState<CustomerDamageReportSchema>(serverData)

  const handleSend = async () => {
    setAllowClick(false);
    serverData.updateFields({ finished: true });
    try {
      await patchCustomerDamageReport(id, serverData.toPlainObject());
    } catch (error) {
      setAllowClick(true);
      return;
    }
    /* TODO: EMAIL shouldnt be null, but might be. Create the correct action if email is null */
    if (serverDataState.userEmail) {
      await handleSendEmail(
        serverDataState.userEmail,
        "GreenMobility Damage report",
        `This is a confirmation that we have received your damage report for vehicle ${serverDataState.greenCarNumberPlate}. It will now be processed by our damage department. If you have any questions, please contact damage@greenmobility.com`
      );
    }
    Router.push("thankyou");
  };

  useEffect(() => {
    const getImages = async () => {
      const loadedDamages = await Promise.all(serverData.damages.map(async (damage) => {
        const loadedDamage = await fetchDamageReportFolderFilesUrl(id, `/GreenDamage/${damage.position}/`)

        return new Damage(damage.position, damage.description, loadedDamage.map(damage => damage.downloadUrl));
      }))
      let updatedServerDataState = serverDataState;
      updatedServerDataState.damages = loadedDamages;
      setServerDataState(updatedServerDataState)

      setOtherPartyImageUrls((await fetchDamageReportFolderFilesUrl(id, '/OtherPartyDamages/')).map((image) => {
        return image.downloadUrl;
      }))
    }

    getImages()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Confirm information div, overlayed on top and only visible when clicking send */}
      {confirmVis && (
        <div className="z-50 fixed ml-[-1rem] mt-[-5rem] w-full h-[100vh] bg-black bg-opacity-25 flex justify-center items-center">
          <div className="bg-white w-80 py-6 p-4 rounded-md">
            <p>
              I hereby confirm that the information provided is true and
              accurate.
            </p>

            <div className="flex flex-row pt-4 justify-evenly">
              <button
                onClick={() => setConfirmVis(false)}
                className="bg-slate-200 p-1 w-2/5"
              >
                Cancel
              </button>

              <button
                disabled={!allowClick}
                onClick={() => handleSend()}
                className="bg-MainGreen-300 p-1 w-2/5 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver information collected */}
      <p className="font-bold text-MainGreen-300 mb-2">Driver information</p>
      {serverDataState.driverRenter ? (
        <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
          {/* First name */}
          <div className="row-start-1 col-span-2 justify-center">
            <p className="text-xs italic">Name:</p>
            <p>
              {serverDataState.driverInfo.firstName ? serverDataState.driverInfo.firstName : "-"}{" "}
              {serverDataState.driverInfo.lastName ? serverDataState.driverInfo.lastName : ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
          {/* First name */}
          <div className="row-start-1 col-span-1 justify-center">
            <p className="text-xs italic">Name:</p>
            <p>
              {serverDataState.driverInfo.firstName ? serverDataState.driverInfo.firstName : "-"}{" "}
              {serverDataState.driverInfo.lastName ? serverDataState.driverInfo.lastName : ""}
            </p>
          </div>

          {/* Driving license number */}
          <div className="row-start-1 col-start-2">
            <p className="text-xs italic">Valid drivers license:</p>
            {serverDataState.driverInfo.validDriversLicense ? <p>Yes</p> : <p>No</p>}
          </div>

          {/* Phone number */}
          <div className="row-start-2 col-start-1">
            <p className="text-xs italic">Phone number:</p>
            <p>
              {serverDataState.driverInfo.phoneNumber ? serverDataState.driverInfo.phoneNumber : "-"}
            </p>
          </div>

          {/* Address */}
          <div className="row-start-2 col-start-2">
            <p className="text-xs italic">Address:</p>
            <p>{serverDataState.driverInfo.address ? serverDataState.driverInfo.address : "-"}</p>
          </div>

          {/* Email */}
          <div className="row-start-3 col-span-2">
            <p className="text-xs italic">Email:</p>
            <p>{serverDataState.driverInfo.email ? serverDataState.driverInfo.email : "-"}</p>
          </div>

          {/* Social security number */}
          <div className="row-start-4 col-start-1">
            <p className="text-xs italic">Social Security Number:</p>
            <p>
              {serverDataState.driverInfo.socialSecurityNumber
                ? serverDataState.driverInfo.socialSecurityNumber
                : "-"}
            </p>
          </div>

          <div className="row-start-4 col-start-2">
            <p className="text-xs italic">Driving License Number:</p>
            <p>
              {serverDataState.driverInfo.drivingLicenseNumber
                ? serverDataState.driverInfo.drivingLicenseNumber
                : "-"}
            </p>
          </div>
        </div>
      )}

      {/* Information about accident */}
      <p className="font-bold text-MainGreen-300 mb-2">Accident information</p>
      <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
        {/* Date of accident */}
        <div className="row-start-1 col-start-1">
          <p className="text-xs italic">Date of accident:</p>
          <p>{serverDataState.date ? serverDataState.date : "-"}</p>
        </div>

        {/* Time of accident */}
        <div className="row-start-1 col-start-2">
          <p className="text-xs italic">Time of accident:</p>
          <p>{serverDataState.time ? serverDataState.time : "-"}</p>
        </div>

        {/* Police journal */}
        <div className="row-start-3 col-span-2">
          <p className="text-xs italic">Police journal number:</p>
          <p>
            {serverDataState.policeReportNumber
              ? serverDataState.policeReportNumber
              : "No police report was filed"}
          </p>
        </div>

        {/* Accident description */}
        <div className="row-start-4 col-span-2">
          <p className="text-xs italic">Accident description:</p>
          <span className="break-words">
            {serverDataState.accidentDescription
              ? serverDataState.accidentDescription
              : "No accident description provided"}
          </span>
        </div>
      </div>

      {/* Information about the damage done */}
      <p className="font-bold text-MainGreen-300 mb-2">Damage information</p>
      <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
        {/* Green car numberplate */}
        <div className="row-start-1 col-start-1">
          <p className="text-xs italic">Green car numberplate:</p>
          <p>{serverDataState.greenCarNumberPlate ? serverDataState.greenCarNumberPlate : "-"}</p>
        </div>

        {/* Speed */}
        <div className="row-start-1 col-start-2">
          <p className="text-xs italic">Speed:</p>
          <p>{serverDataState.speed ? serverDataState.speed : "-"} km/h</p>
        </div>

        {/* Damage description */}
        <div className="row-start-2 col-span-2">
          <p className="text-xs italic">Damage description:</p>
          <span className="break-words">
            {serverDataState.damageDescription
              ? serverDataState.damageDescription
              : "No damage description provided"}
          </span>
        </div>
      </div>

      {/* TODO: Lige nu er hver modpart type sin egen katagori, lav istedet en type og 
      gør det muligt at der kan være flere */}
      {/* Others involved information */}
      <p className="font-bold text-MainGreen-300 mb-2">
        Others involved in crash
      </p>
      <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6 flex flex-col">
        {serverDataState.bikerInfo.length == 0 &&
        serverDataState.vehicleInfo.length == 0 &&
        serverDataState.otherObjectInfo.length == 0 &&
        serverDataState.pedestrianInfo.length == 0 ? (
          <div>
            <p>No others was involved in crash</p>
          </div>
        ) : (
          <div className="">
            <div className="w-full">
              {serverDataState.bikerInfo.length > 0 &&
                serverDataState.bikerInfo.map((currentBike, index) => (
                  <div className="flex flex-row items-center">
                    <FontAwesomeIcon icon={faBicycle} />
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-y-2 pl-5 ml-[0.76rem] py-1 border-l-2 border-MainGreen-300"
                    >
                      {/* Name of biker */}
                      <div className="row-start-1 col-start-1">
                        <p className="text-xs italic">Name:</p>
                        <p>{currentBike.name}</p>
                      </div>

                      {/* Was the bike an electric bike */}
                      <div className="row-start-1 col-start-2">
                        <p className="text-xs italic">Electric bike:</p>
                        {currentBike.ebike ? <p>Yes</p> : <p>No</p>}
                      </div>

                      {/* phone of biker */}
                      <div className="row-start-2 col-start-1">
                        <p className="text-xs italic">Phone:</p>
                        <p>{currentBike.phone}</p>
                      </div>

                      {/* mail of biker */}
                      <div className="row-start-3 col-span-2">
                        <p className="text-xs italic">Email:</p>
                        <p>{currentBike.email}</p>
                      </div>

                      {/* Person damage */}
                      <div className="row-start-4 col-span-2">
                        <p className="text-xs italic">Injuries:</p>
                        {currentBike.personDamage !== "" ? (
                          <span>{currentBike.personDamage}</span>
                        ) : (
                          <p>No</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Vehicle info */}
            <div className="w-full mt-4">
              {serverDataState.vehicleInfo.length > 0 &&
                serverDataState.vehicleInfo.map((currentVehicle, index) => (
                  <div className="flex flex-row items-center">
                    <FontAwesomeIcon icon={faCar} />
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-y-2 pl-5 ml-[0.99rem] py-1 border-l-2 border-MainGreen-300"
                    >
                      {/* Name of vehicles driver */}
                      <div className="row-start-1 col-span-2">
                        <p className="text-xs italic">Name:</p>
                        <p className="break-words">{currentVehicle.name}</p>
                      </div>

                      {/* drivers license number of vehicles driver */}
                      <div className="row-start-2 col-start-2">
                        <p className="text-xs italic">Driver license number:</p>
                        <p>{currentVehicle.driversLicenseNumber}</p>
                      </div>

                      {/* Phone number of vehicle driver */}
                      <div className="row-start-2 col-start-1">
                        <p className="text-xs italic">Phone number:</p>
                        <p>{currentVehicle.phone}</p>
                      </div>

                      {/* Mail of vehicle driver */}
                      <div className="row-start-3 col-span-2">
                        <p className="text-xs italic">Email:</p>
                        <p>{currentVehicle.email}</p>
                      </div>

                      {/* numberplate of vehicle */}
                      <div className="row-start-4 col-start-1">
                        <p className="text-xs italic">Numberplate:</p>
                        <p>{currentVehicle.numberplate}</p>
                      </div>

                      {/* insurance of vehicle */}
                      <div className="row-start-4 col-start-2">
                        <p className="text-xs italic">Insurance:</p>
                        <p>{currentVehicle.insurance}</p>
                      </div>

                      {/* model of vehicle */}
                      <div className="row-start-5 col-start-1">
                        <p className="text-xs italic">Vehicle model:</p>
                        <p>{currentVehicle.model}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <div className="w-full mt-4">
                {serverDataState.pedestrianInfo.length > 0 &&
                  serverDataState.pedestrianInfo.map((currenPedestrian, index) => (
                    <div className="flex flex-row items-center">
                      <FontAwesomeIcon icon={faPerson} />
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-y-2 pl-5 ml-[1.38rem] py-1 border-l-2 border-MainGreen-300"
                      >
                        {/* Name of pedestrian */}
                        <div className="row-start-1 col-start-1">
                          <p className="text-xs italic">Name:</p>
                          <p className="break-words">{currenPedestrian.name}</p>
                        </div>

                        {/* Phone number of pedestrian */}
                        <div className="row-start-1 col-start-2">
                          <p className="text-xs italic">Phone number:</p>
                          <p>{currenPedestrian.phone}</p>
                        </div>

                        {/* Mail of pedestrian */}
                        <div className="row-start-2 col-span-2">
                          <p className="text-xs italic">Email:</p>
                          <p>{currenPedestrian.email}</p>
                        </div>

                        {/* Damage of pedestrian */}
                        <div className="row-start-3 col-span-2">
                          <p className="text-xs italic">Injuries:</p>
                          {currenPedestrian.personDamage !== "" ? (
                            <p>{currenPedestrian.personDamage}</p>
                          ) : (
                            <p>No damage</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <div className="w-full mt-4">
                {serverDataState.otherObjectInfo.length > 0 &&
                  serverDataState.otherObjectInfo.map((currentObject, index) => (
                    <div className="flex flex-row items-center">
                      <FontAwesomeIcon icon={faBox} />
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-y-2 pl-5 ml-[1.1rem] py-1 border-l-2 border-MainGreen-300"
                      >
                        {/* Description */}
                        <div className="row-start-1 col-span-2">
                          <p className="text-xs italic">
                            Description of object:
                          </p>
                          <span className="break-words">
                            {currentObject.description}
                          </span>
                        </div>

                        {/* Information */}
                        <div className="row-start-2 col-span-2">
                          <p className="text-xs italic">
                            Information about object:
                          </p>
                          <span className="break-words">
                            {currentObject.information}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Witnesses information */}
      <p className="font-bold text-MainGreen-300 mb-2">Witnesses</p>
      <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
        {serverDataState.witnesses.length > 0 ? (
          serverDataState.witnesses.map((witness, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-y-2 p-1 border-l-2 border-MainGreen-300 mb-3"
            >
              {/* Name of witness */}
              <div className="row-start-1 col-start-1">
                <p className="text-xs italic">Name:</p>
                <p className="break-words">{witness.name}</p>
              </div>

              {/* Phone number of witness */}
              <div className="row-start-1 col-start-2">
                <p className="text-xs italic">Phone:</p>
                <p>{witness.phone}</p>
              </div>

              {/* Phone number of witness */}
              <div className="row-start-2 col-span-2">
                <p className="text-xs italic">Mail:</p>
                <p className="break-words">{witness.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p>You have not declared any witnesses</p>
        )}
      </div>

      {/* Images of damages to otherparty car*/}
      <p className="font-bold text-MainGreen-300 mb-2">
        Pictures of the damages to the other Partys involved
      </p>
      <div className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
        {otherPartyImageUrls.length > 0 ? (
          otherPartyImageUrls.map((image) => (
            <img key={image} src={image} alt={image} className="w-1/2" />
          ))
        ) : (
          <p>No images</p>
        )}
      </div>

      {/* Location of accident*/}
      <div>
        <p className="font-bold text-MainGreen-300 mb-2">
          Location for where the incident occurred
        </p>
        {serverDataState.accidentAddress.length > 0 ? (
          <div className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
            {serverDataState.accidentAddress}
          </div>
        ) : (
          <div className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
            <p>No location has been given</p>
          </div>
        )}
      </div>

      <div>
        <p className="font-bold text-MainGreen-300 mb-2">
          Positions of damages
        </p>

        {serverDataState.damages.length > 0 ? (
          <div>
            {serverDataState.damages.map((damage, index) => (
              <div
                className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6"
                key={index}
              >
                <p className="break-words">Position: {damage.position}</p>
                <p className="break-words">Description: {damage.description}</p>
                <div className="">
                  <p>Images:</p>
                  <div className="flex flex-wrap">
                    {damage.images.length > 0 && damage.images.map((image, index) => (
                      <img className="h-14 w-14 m-1" key={index}
                      src={image} alt="Damage" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
            <p>No damage positions</p>
          </div>
        )}
      </div>

      <div className="w-full h-full flex flex-row justify-between rounded-full mt-4">
        <div className="w-16 h-14 ml-10">
          <BackButton pageName={`where?id=${id}`} />
        </div>
        <button
          type="button"
          onClick={() => setConfirmVis(true)}
          className="w-16 bg-MainGreen-300 rounded-full text-white mr-10"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default confirmationPage;
