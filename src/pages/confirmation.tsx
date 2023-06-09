import React, {useState} from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import BackButton from "@/components/buttons/back";
import { handleRequest } from "@/utils/serverUtils";


const confirmationPage:NextPage = () => {
  const Router = useRouter()
  let [confirmVis, setConfirmVis] = useState(false)
  
  /* TODO: This is placeholder data, get the data from the server */
  const data = {
    firstName: "John",
    lastName: "Doe",
    homeAddress: "Landgreven 3, 4. sal, 1301 København K",
    socialSecurityNumber: "42694325748",
    drivingLicenseNumber: "234232434",
    phoneNumber: "+45 70 77 88 88",
    email: "JohnDoe@gmail.com",

    location: {address: "Niels Brocks Gade 11574 København", position:{lat: "55.672685", lng: "12.573920"}},
    time: "12:45",
    date: "02/04/2023",
    crashDescription: "I drove and then i hit a wall.",
    policeReport: "",

    greenCarNumberPlate: "DC 11 534",
    speed: "50",
    damageDescription: "Car is missing roof",

    bikerInfo: {name: "Jonas Hansen", phone: "+45 56 12 89 67", mail: "jonashansen@gmail.com", ebike: false, personDamage: ""},
    vehicleInfo: {name: "Kirsten Fredriksen", phone: "+45 12 56 89 66", mail: "kirstenfredriksen@gmail.com", driversLicenseNumber: "872346287", insurance: "Tryg", numberplate: "CW 89 671", color:"blue", model: "Ford"},
    pedestrianInfo: {name: "Fredrik Knudsen", phone: "+45 67 23 87 93", mail: "fredrikknudsen@gmail.com", personDamage: ""},
    otherObjectInfo : {description: "", information: ""},

    witnesses: [
      {name: "Jens Jensen", phone: "+45 89 43 23 09", mail: "jensjensen@gmail.com"},
      {name: "Martin Johansen", phone: "+45 45 23 87 46", mail: "martinjohansen@gmail.com"},
      {name: "Martin Johansen", phone: "+45 45 23 87 46", mail: "martinjohansen@gmail.com"},
      {name: "Martin Johansen", phone: "+45 45 23 87 46", mail: "martinjohansen@gmail.com"},
    ],
  }

  const handleSend = async () => {
    console.log("Damage Report done")
    await handleRequest({finished: true})

    /* TODO: Send videre til en ny side */
  }

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
          <div className="row-start-1 col-start-1 justify-center">
            <p className="text-xs italic">First name:</p>
            <p>{data.firstName}</p>
          </div>

          {/* Last name */}
          <div className="row-start-1 col-start-2">
            <p className="text-xs italic">Last name:</p>
            <p>{data.lastName}</p>
          </div>

          {/* Phone number */}
          <div className="row-start-2 col-start-1">
            <p className="text-xs italic">Phone number:</p>
            <p>{data.phoneNumber}</p>
          </div>

          {/* Email */}
          <div className="row-start-2 col-start-2">
            <p className="text-xs italic">Email:</p>
            <p>{data.email}</p>
          </div>

          {/* Address */}
          <div className="row-start-3 col-span-2">
            <p className="text-xs italic">Address:</p>
            <p>{data.homeAddress}</p>
          </div>

          {/* Social security number */}
          <div className="row-start-4 col-start-1">
            <p className="text-xs italic">Social Security Number:</p>
            <p>{data.socialSecurityNumber}</p>
          </div>

          {/* Driving license number */}
          <div className="row-start-4 col-start-2">
            <p className="text-xs italic">Driving License Number:</p>
            <p>{data.drivingLicenseNumber}</p>
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
          <p>{data.location.address}</p>
        </div>

        {/* Police journal */}
        <div className="row-start-3 col-span-2">
          <p className="text-xs italic">Police journal number:</p>
          { data.policeReport !== "" ? (
            <p>{data.policeReport}</p>
          ) : (
            <p>No police report was filed</p>
          )
          }
        </div>

        {/* Accident description */}
        <div className="row-start-4 col-span-2">
          <p className="text-xs italic">Accident description:</p>
          <span className="break-words">{data.crashDescription}</span>
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
                <p className="text-xs italic">phone:</p>
                <p>{data.bikerInfo.phone}</p>
              </div>

              {/* mail of biker */}
              <div className="row-start-3 col-span-2">
                <p className="text-xs italic">mail:</p>
                <p>{data.bikerInfo.mail}</p>
              </div>

              {/* Person damage */}
              <div className="row-start-4 col-span-2">
                <p className="text-xs italic">Person damage:</p>
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
                <p className="text-xs italic">mail:</p>
                <p>{data.vehicleInfo.mail}</p>
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
                <p className="text-xs italic">Mail:</p>
                <p>{data.pedestrianInfo.mail}</p>
              </div>

              {/* Damage of pedestrian */}
              <div className="row-start-3 col-span-2">
                <p className="text-xs italic">Damage:</p>
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
                <p className="break-words">{witness.mail}</p>
              </div>
            </div>
          ))
        ) : (
          <p>You have not declared any witnesses</p>
        )}
      </div>

      <div className="w-full flex flex-row">
        <BackButton pageName="/where"/>

        <button type="button" onClick={() => setConfirmVis(true)}
        className="w-1/2"
        >Send</button>
      </div>
    </div>
  )
};

export default confirmationPage;