import React, {useState} from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import BackButton from "@/components/buttons/back";
import { getData, getImages, updateData } from "@/firebase/clientApp";
import { pageProps, reportDataType } from "@/utils/utils";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = context.query.id as string;

  const data = await getData(id);
  const images = await getImages(id);

  return {
    props: {
      data: data || null,
      images: images || null,
      id: id
    }
  }
}

const confirmationPage:NextPage<pageProps> = ({ data, images, id }) => {
  const Router = useRouter()
  let [confirmVis, setConfirmVis] = useState(false);

  const handleSend = async () => {
    console.log("Damage Report done")
    await updateData(id, {finished: true})

    /* TODO: Send videre til en ny side */
  }
  if (data !== null) {
    return (
      <div className="flex flex-col">
  
        {/* Confirm information div, overlayed on top and only visible when clicking send */}
        { confirmVis && 
          <div className="z-50 fixed ml-[-1rem] mt-[-5rem] w-full h-[100vh] bg-black bg-opacity-25 flex justify-center items-center">
            <div className="bg-white w-80 py-6 p-4 rounded-md">
              <p>I hereby confirm that the information provided is true and accurate.</p>
  
              <div className="flex flex-row pt-4 justify-evenly">
  
                <button onClick={() => setConfirmVis(false)}
                className="bg-slate-200 p-1 w-2/5">
                  Cancel
                </button>
  
                <button onClick={() => handleSend()}
                className="bg-MainGreen-300 p-1 w-2/5 text-white">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        }
  
        {/* Driver information collected */}
        <p className="font-bold">Driver information</p>
        <div 
        className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6"
        onClick={() => Router.push("/what")}
        >
  
            {/* First name */}
            <div className="row-start-1 col-span-2 justify-center">
              <p className="text-xs italic">Name:</p>
              <p>{data.driverInfo.firstName} {data.driverInfo.lastName}</p>
            </div>
  
            {/* Phone number */}
            <div className="row-start-2 col-start-1">
              <p className="text-xs italic">Phone number:</p>
              <p>{data.driverInfo.phoneNumber}</p>
            </div>
  
            {/* Address */}
            <div className="row-start-2 col-start-2">
              <p className="text-xs italic">Address:</p>
              <p>{data.driverInfo.address}</p>
            </div>
  
            {/* Email */}
            <div className="row-start-3 col-span-2">
              <p className="text-xs italic">Email:</p>
              <p>{data.driverInfo.email}</p>
            </div>
  
            {/* Social security number */}
            <div className="row-start-4 col-start-1">
              <p className="text-xs italic">Social Security Number:</p>
              <p>{data.driverInfo.socialSecurityNumber}</p>
            </div>
  
            {/* Driving license number */}
            <div className="row-start-4 col-start-2">
              <p className="text-xs italic">Driving License Number:</p>
              <p>{data.driverInfo.drivingLicenseNumber}</p>
            </div>
        </div>
  
        {/* Information about accident */}
        <p className="font-bold">Accident information</p>
        <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
  
          {/* Date of accident */}
          <div className="row-start-1 col-start-1">
            <p className="text-xs italic">Date of accident:</p>
            <p>{data.date}</p>
          </div>
  
          {/* Time of accident */}
          <div className="row-start-1 col-start-2">
            <p className="text-xs italic">Time of accident:</p>
            <p>{data.time}</p>
          </div>
  
          {/* Location */}
          <div className="row-start-2 col-span-2">
            <p className="text-xs italic">Location:</p>
            <p>{data.accidentLocation}</p>
          </div>
  
          {/* Police journal */}
          <div className="row-start-3 col-span-2">
            <p className="text-xs italic">Police journal number:</p>
            { data.policeReportNumber !== "" ? (
              <p>{data.policeReportNumber}</p>
            ) : (
              <p>No police report was filed</p>
            )
            }
          </div>
  
          {/* Accident description */}
          <div className="row-start-4 col-span-2">
            <p className="text-xs italic">Accident description:</p>
            <span className="break-words">{data.accidentDescription}</span>
          </div>
        </div>
  
        {/* Information about the damage done */}
        <p className="font-bold">Damage information</p>
        <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
          
          {/* Green car numberplate */}
          <div className="row-start-1 col-start-1">
            <p className="text-xs italic">Green car numberplate:</p>
            <p>{data.greenCarNumberPlate}</p>
          </div>
  
          {/* Speed */}
          <div className="row-start-1 col-start-2">
            <p className="text-xs italic">Speed:</p>
            <p>{data.speed} km/h</p>
          </div>
  
          {/* Damage description */}
          <div className="row-start-2 col-span-2">
            <p className="text-xs italic">Damage description:</p>
            <span className="break-words">{data.damageDescription}</span>
          </div>
        </div>
  
        {/* TODO: Lige nu er hver modpart type sin egen katagori, lav istedet en type og 
        gør det muligt at der kan være flere */}
        {/* Others involved information */}
        <p className="font-bold">Others involved in crash</p>
        <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
  
          {/* Bike information */}
          <div className="w-full">
            <p className="text-sm font-semibold">Biker information:</p>
            {data.bikerInfo.name !== "" ? (
              <div className="grid grid-cols-2 gap-y-2 pl-4 py-1">
  
                {/* Name of biker */}
                <div className="row-start-1 col-start-1">
                  <p className="text-xs italic">Name:</p>
                  <p>{data.bikerInfo.name}</p>
                </div>
  
                {/* Was the bike an electric bike */}
                <div className="row-start-1 col-start-2">
                  <p className="text-xs italic">Electric bike:</p>
                  { data.bikerInfo.ebike ? (
                    <p>Yes</p>
                  ) : (
                    <p>No</p>
                  )}
                </div>
  
                {/* phone of biker */}
                <div className="row-start-2 col-start-1">
                  <p className="text-xs italic">Phone:</p>
                  <p>{data.bikerInfo.phone}</p>
                </div>
  
                {/* mail of biker */}
                <div className="row-start-3 col-span-2">
                  <p className="text-xs italic">Email:</p>
                  <p>{data.bikerInfo.email}</p>
                </div>
  
                {/* Person damage */}
                <div className="row-start-4 col-span-2">
                  <p className="text-xs italic">Injuries:</p>
                  {data.bikerInfo.personDamage !== "" ? (
                    <span>{data.bikerInfo.personDamage}</span>
                  ) : (
                    <p>No</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="ml-4">No biker was hit</p>
            )}
          </div>
  
          {/* Other vechicle information */}
          <div className="w-full mt-4">
            <p className="text-sm font-semibold">Other vehicle information:</p>
            {data.vehicleInfo.name !== "" ? (
              <div className="grid grid-cols-2 gap-y-2 pl-4 py-1">
  
                {/* Name of vehicles driver */}
                <div className="row-start-1 col-span-2">
                  <p className="text-xs italic">Name:</p>
                  <p className="break-words">{data.vehicleInfo.name}</p>
                </div>
  
                {/* drivers license number of vehicles driver */}
                <div className="row-start-2 col-start-2">
                  <p className="text-xs italic">Driver license number:</p>
                  <p>{data.vehicleInfo.driversLicenseNumber}</p>
                </div>
  
                {/* Phone number of vehicle driver */}
                <div className="row-start-2 col-start-1">
                  <p className="text-xs italic">Phone number:</p>
                  <p>{data.vehicleInfo.phone}</p>
                </div>
  
                {/* Mail of vehicle driver */}
                <div className="row-start-3 col-span-2">
                  <p className="text-xs italic">Email:</p>
                  <p>{data.vehicleInfo.email}</p>
                </div>
  
                {/* numberplate of vehicle */}
                <div className="row-start-4 col-start-1">
                  <p className="text-xs italic">Numberplate:</p>
                  <p>{data.vehicleInfo.numberplate}</p>
                </div>
  
                {/* insurance of vehicle */}
                <div className="row-start-4 col-start-2">
                  <p className="text-xs italic">Insurance:</p>
                  <p>{data.vehicleInfo.insurance}</p>
                </div>
  
                {/* model of vehicle */}
                <div className="row-start-5 col-start-1">
                  <p className="text-xs italic">Vehicle model:</p>
                  <p>{data.vehicleInfo.model}</p>
                </div>
  
                {/* color of vehicle */}
                <div className="row-start-5 col-start-2">
                  <p className="text-xs italic">Vehicle color:</p>
                  <p>{data.vehicleInfo.color}</p>
                </div>
              </div>
            ) : (
              <p className="ml-4">No other vehicles involved</p>
            )}
          </div>
  
          {/* Pedestrian information */}
          <div className="w-full mt-4">
            <p className="text-sm font-semibold">Pedestrian information:</p>
            {data.pedestrianInfo.name !== "" ? (
              <div className="grid grid-cols-2 gap-y-2 pl-4 py-1">
  
                {/* Name of pedestrian */}
                <div className="row-start-1 col-start-1">
                  <p className="text-xs italic">Name:</p>
                  <p className="break-words">{data.pedestrianInfo.name}</p>
                </div>
  
                {/* Phone number of pedestrian */}
                <div className="row-start-1 col-start-2">
                  <p className="text-xs italic">Phone number:</p>
                  <p>{data.pedestrianInfo.phone}</p>
                </div>
  
                {/* Mail of pedestrian */}
                <div className="row-start-2 col-span-2">
                  <p className="text-xs italic">Email:</p>
                  <p>{data.pedestrianInfo.email}</p>
                </div>
  
                {/* Damage of pedestrian */}
                <div className="row-start-3 col-span-2">
                  <p className="text-xs italic">Injuries:</p>
                  { data.pedestrianInfo.personDamage !== "" ? (
                    <p>{data.pedestrianInfo.personDamage}</p>
                  ) : (
                    <p>No damage</p>
                  )}
                </div>
  
              </div>
            ) : (
              <p className="ml-4">No pedestrian was harmed</p>
            )}
          </div>
  
          {/* Pedestrian information */}
          <div className="w-full mt-4">
            <p className="text-sm font-semibold">Other object information:</p>
            {data.otherObjectInfo.description !== "" ? (
              <div className="grid grid-cols-2 gap-y-2 pl-4 py-1">
  
                {/* Description */}
                <div className="row-start-1 col-span-2">
                  <p className="text-xs italic">Description of object:</p>
                  <span className="break-words">{data.damageDescription}</span>
                </div>
  
                {/* Information */}
                <div className="row-start-2 col-span-2">
                  <p className="text-xs italic">Information about object:</p>
                  <span className="break-words">{data.damageDescription}</span>
                </div>
  
              </div>
            ) : (
              <p className="ml-4">No collision with other object</p>
            )}
          </div>
        </div>
  
        {/* Witnesses information */}
        <p className="font-bold">Witnesses</p>
        <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
          {data.witnesses.length > 0 ? (
            data.witnesses.map((witness, index) => (
              <div key={index} className="grid grid-cols-2 gap-y-2 p-1 border-l-2 border-MainGreen-300 mb-3">
  
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

        {/* Images */}
        <p className="font-bold">Images of damages</p>
        <div className="flex flex-col rounded-lg bg-MainGreen-100 py-2 px-5 w-full mb-6">
          {images && (
            <div>
            <div className="flex flex-row">
              <img src={images['FRONT']} alt="FrontImage" 
              className="w-1/2"/>
              <img src={images['RIGHT']} alt="RightImage" 
              className="w-1/2"/>
            </div>
            <div className="flex flex-row">
              <img src={images['BACK']} alt="BackImage" 
              className="w-1/2"/>
              <img src={images['LEFT']} alt="LeftImage" 
              className="w-1/2"/>
            </div>
          </div>
          )}
        </div>

  
        <div className="w-full flex flex-row">
          <BackButton pageName={`where?id=${id}`}/>
  
          <button type="button" onClick={() => setConfirmVis(true)}
          className="w-1/2"
          >Send</button>
        </div>
      </div>
    )
  } else {
    return (
      <div>Something went wrong with fetching data from server</div>
    )
  }

};

export default confirmationPage;