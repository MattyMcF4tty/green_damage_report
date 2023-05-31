import React, {useEffect, useState} from "react";
import { NextPage } from "next";
import { DriverInformation } from "@/utils/logic";


const confirmationPage:NextPage = () => {
    const [driverInfo, setDriverInfo] = useState<DriverInformation>();

    useEffect(() => {
      const driverInfoString = sessionStorage.getItem('driverInfo');

      if (driverInfoString) {
        setDriverInfo(JSON.parse(driverInfoString))
      }
      else {console.error("driverInfo not found in sessionStorage")}

      /* I will do this for all my keys */


    }, []);


    return (
        <div>
            <div id="driverInformation">
                <p>{driverInfo ? driverInfo.firstName : "First name"}</p>
                <p>{driverInfo ? driverInfo.lastName : "First name"}</p>
            </div>
        </div>
    )
};

export default confirmationPage;