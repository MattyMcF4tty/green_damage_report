import React, {useEffect, useState} from "react";
import { NextPage } from "next";


const confirmationPage:NextPage = () => {
  
  /* TODO: This is placeholder data, get the data from the server */
  const data = {
    firstName: "John",
    lastName: "Doe",
    homeAddress: "Landgreven 3, 4. sal, 1301 København K",
    socialSecurityNumber: "42694325748",
    drivingLicenseNumber: "234232434",
    phoneNumber: "45+ 70 77 88 88",
    email: "JohnDoe@gmail.com",

    location: {address: "Niels Brocks Gade 11574 København", position:{lat: "55.672685", lng: "12.573920"}},
    greenCarNumberPlate: "DC 11 534",
    time: "12:45",
    date: "02/04/2023",
    speed: "50",
    crashDescription: "I drove and then i hit a wall",
    damageDescription: "Car is missing roof",
  }

    return (
      <div className="flex flex-col">

        {/* Driver information collected */}
        <div className="rounded-lg bg-MainGreen-100 w-full p-2">
          <div className="flex flex-row">
            {/* First name */}
            <div>
              <p className="text-xs">First name:</p>
              <p>{data.firstName}</p>
            </div>

            {/* Last name */}
            <div>
              <p className="text-xs">Last name:</p>
              <p>{data.lastName}</p>
            </div>
          </div>


        </div>
      </div>
    )
};

export default confirmationPage;