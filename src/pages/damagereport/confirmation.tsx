import React, { useState, useEffect } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import BackButton from "@/components/buttons/back";
import { updateData } from "@/firebase/clientApp";
import {
  getServerSidePropsWithRedirect,
  handleSendEmail,
  handleUpdateReport,
  pageProps,
  reportDataType,
} from "@/utils/utils";
import { getDownloadURL, ref } from "firebase/storage";
import { FireStorage } from "@/firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faBox,
  faCar,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getServerSidePropsWithRedirect(context);
};

const confirmationPage: NextPage<pageProps> = ({ data, images, id }) => {
  const Router = useRouter();
  const serverData = new reportDataType();
  serverData.updateFields(data);
  const [map, setMap] = useState<string | null>();
  const [allowClick, setAllowClick] = useState(true);

  useEffect(() => {
    const getMap = async () => {
      const storageRef = ref(FireStorage, `${id}/admin/map`);
      let serverMap: string | null = null;
      try {
        serverMap = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("No map");
      }
      if (serverMap) {
        setMap(serverMap);
      }
    };
    getMap();
  }, []);

  let [confirmVis, setConfirmVis] = useState(false);

  const handleSend = async () => {
    setAllowClick(false);
    serverData.updateFields({ finished: true });
    try {
      await handleUpdateReport(id, serverData);
    } catch (error) {
      setAllowClick(true);
      return;
    }
    /* TODO: EMAIL shouldnt be null, but might be. Create the correct action if email is null */
    if (data.userEmail) {
      await handleSendEmail(
        data.userEmail,
        "GreenMobility Damage report",
        `This is a confirmation that we have received your damage report for vehicle ${data.greenCarNumberPlate}. It will now be processed by our damage department. If you have any questions, please contact damage@greenmobility.com`
      );
    }
    Router.push("thankyou");
  };

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
      {data.driverRenter ? (
        <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
          {/* First name */}
          <div className="row-start-1 col-span-2 justify-center">
            <p className="text-xs italic">Name:</p>
            <p>
              {data.renterInfo.firstName ? data.renterInfo.firstName : "-"}{" "}
              {data.renterInfo.lastName ? data.renterInfo.lastName : ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
          {/* First name */}
          <div className="row-start-1 col-span-1 justify-center">
            <p className="text-xs italic">Name:</p>
            <p>
              {data.driverInfo.firstName ? data.driverInfo.firstName : "-"}
              {data.driverInfo.lastName ? data.driverInfo.firstName : ""}
            </p>
          </div>

          {/* Driving license number */}
          <div className="row-start-1 col-start-2">
            <p className="text-xs italic">Valid drivers license:</p>
            {data.driverInfo.validDriversLicense ? <p>Yes</p> : <p>No</p>}
          </div>

          {/* Phone number */}
          <div className="row-start-2 col-start-1">
            <p className="text-xs italic">Phone number:</p>
            <p>
              {data.driverInfo.phoneNumber ? data.driverInfo.phoneNumber : "-"}
            </p>
          </div>

          {/* Address */}
          <div className="row-start-2 col-start-2">
            <p className="text-xs italic">Address:</p>
            <p>{data.driverInfo.address ? data.driverInfo.address : "-"}</p>
          </div>

          {/* Email */}
          <div className="row-start-3 col-span-2">
            <p className="text-xs italic">Email:</p>
            <p>{data.driverInfo.email ? data.driverInfo.email : "-"}</p>
          </div>

          {/* Social security number */}
          <div className="row-start-4 col-start-1">
            <p className="text-xs italic">Social Security Number:</p>
            <p>
              {data.driverInfo.socialSecurityNumber
                ? data.driverInfo.socialSecurityNumber
                : "-"}
            </p>
          </div>

          <div className="row-start-4 col-start-2">
            <p className="text-xs italic">Driving License Number:</p>
            <p>
              {data.driverInfo.drivingLicenseNumber
                ? data.driverInfo.drivingLicenseNumber
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
          <p>{data.date ? data.date : "-"}</p>
        </div>

        {/* Time of accident */}
        <div className="row-start-1 col-start-2">
          <p className="text-xs italic">Time of accident:</p>
          <p>{data.time ? data.time : "-"}</p>
        </div>

        {/* Police journal */}
        <div className="row-start-3 col-span-2">
          <p className="text-xs italic">Police journal number:</p>
          <p>
            {data.policeReportNumber
              ? data.policeReportNumber
              : "No police report was filed"}
          </p>
        </div>

        {/* Accident description */}
        <div className="row-start-4 col-span-2">
          <p className="text-xs italic">Accident description:</p>
          <span className="break-words">
            {data.accidentDescription
              ? data.accidentDescription
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
          <p>{data.greenCarNumberPlate ? data.greenCarNumberPlate : "-"}</p>
        </div>

        {/* Speed */}
        <div className="row-start-1 col-start-2">
          <p className="text-xs italic">Speed:</p>
          <p>{data.speed ? data.speed : "-"} km/h</p>
        </div>

        {/* Damage description */}
        <div className="row-start-2 col-span-2">
          <p className="text-xs italic">Damage description:</p>
          <span className="break-words">
            {data.damageDescription
              ? data.damageDescription
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
        {data.bikerInfo.length == 0 &&
        data.vehicleInfo.length == 0 &&
        data.otherObjectInfo.length == 0 &&
        data.pedestrianInfo.length == 0 ? (
          <div>
            <p>No others was involved in crash</p>
          </div>
        ) : (
          <div className="">
            <div className="w-full">
              {data.bikerInfo.length > 0 &&
                data.bikerInfo.map((currentBike, index) => (
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
              {data.vehicleInfo.length > 0 &&
                data.vehicleInfo.map((currentVehicle, index) => (
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
                {data.pedestrianInfo.length > 0 &&
                  data.pedestrianInfo.map((currenPedestrian, index) => (
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
                {data.otherObjectInfo.length > 0 &&
                  data.otherObjectInfo.map((currentObject, index) => (
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
        {data.witnesses.length > 0 ? (
          data.witnesses.map((witness, index) => (
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

      {/* Images of damages to GreenMobility car*/}
      <p className="font-bold text-MainGreen-300 mb-2">
        Pictures of the damages to the GreenMobility car
      </p>
      <div className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
        {images &&
        images["GreenMobility"] &&
        images["GreenMobility"].length > 0 ? (
          images["GreenMobility"].map((image) => (
            <img key={image} src={image} alt={image} className="w-1/2" />
          ))
        ) : (
          <p>No images</p>
        )}
      </div>
      {/* Images of damages to otherparty car*/}
      <p className="font-bold text-MainGreen-300 mb-2">
        Pictures of the damages to the other Party involved
      </p>
      <div className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
        {images && images["OtherParty"] && images["OtherParty"].length > 0 ? (
          images["OtherParty"].map((image) => (
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
        {data.accidentAddress.length > 0 ? (
          <div className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
            {data.accidentAddress}
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

        {serverData.damages.length > 0 ? (
          <div>
            {serverData.damages.map((damage, index) => (
              <div
                className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6"
                key={index}
              >
                <p className="break-words">Position: {damage.position}</p>
                <p className="break-words">Description: {damage.description}</p>
                <p className="break-words">
                  Images: {damage.images.join(", ")}
                </p>
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
