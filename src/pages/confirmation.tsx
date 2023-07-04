import React, {useEffect, useState} from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";


const confirmationPage:NextPage = () => {
  const Router = useRouter()
  
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

    greenCarNumberPlate: "DC 11 534",
    speed: "50",
    damageDescription: "Car is missing roof",

    policeReport: "",
  }

  return (
    <div className="flex flex-col">

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
        
        {/* Accident description */}
        <div className="row-start-3 col-span-2">
          <p className="text-xs italic">Accident description:</p>
          <p className="break-words">{data.crashDescription}</p>
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
          <p className="break-words">{data.damageDescription}</p>
        </div>
        
      </div>

      {/* Police report information */}
      <p className="font-bold">Police report</p>
      <div className="rounded-lg bg-MainGreen-100 py-2 px-5 w-full grid grid-cols-2 gap-y-4 mb-6">
        
        {/* Has police report been filed */}
        <div className="row-start-1 col-start-1">
          <p className="text-xs italic">Journal number:</p>
          {data.policeReport !== "" ? (
            <p>{data.policeReport}</p>
          ) : (
            <p>Not filed</p>
          )}
        </div>

        {/* Speed */}
        <div className="row-start-1 col-start-2">
          <p className="text-xs italic">Speed:</p>
          <p>{data.speed} km/h</p>
        </div>

        {/* Damage description */}
        <div className="row-start-2 col-span-2">
          <p className="text-xs italic">Damage description:</p>
          <p className="break-words">{data.damageDescription}</p>
        </div>
        
      </div>
    </div>
  )
};

export default confirmationPage;