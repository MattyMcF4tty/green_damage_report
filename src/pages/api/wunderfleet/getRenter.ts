import { checkOrigin } from "@/utils/serverUtils";
import { apiResponse } from "@/utils/types";
import { getAge } from "@/utils/utils";
import { wunderToDate } from "@/utils/serverUtils";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    const debug:string[] = [];

    try {
        // Check if method is correct
        if (req.method !== "POST") {
            return res.status(405).json(new apiResponse(
                "METHOD_NOT_ALLOWED",
                [],
                ["Method is not allowed"],
                {},
                debug
            ))
        }
        debug.push("Method verified")

        const wunderUrl = process.env.WUNDER_DOMAIN;
        const accessToken = process.env.WUNDER_ACCESS_TOKEN;
        const { numberplate, date } = req.body;

        try { 
            if (!wunderUrl || typeof wunderUrl !== 'string') {
                throw new Error("Incorrect Wunderfleet api url format");
            }
            debug.push("WunderUrl verified")

            if (!accessToken || typeof accessToken !== 'string') {
                throw new Error("Incorrect accessToken format");
            }
            debug.push("accessToken verified")

            if (!numberplate || typeof numberplate !== 'string') {
                throw new Error("Incorrect numberplate format");
            }
            debug.push("numberplate verified")

            if (!date || typeof date !== 'string') {
                throw new Error("Incorrect date");
            }
            debug.push("date verified")
        } catch (error: any) {
            return res.status(400).json(new apiResponse(
                "BAD_REQUEST",
                [],
                [error.message],
                {},
                debug
            ))
        }

        const accidentDate = new Date(date)
        debug.push(`Accident date: ${accidentDate}`)

        // Get information about vehicle
        const vehicleResponse = await fetch(wunderUrl + "/api/v2/vehicles/search", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "licencePlate": {
                    "$eq": numberplate
                }
            })
        })
        const vehicleResponseData = await vehicleResponse.json();

        // Check if car exists and request returned ok
        if (vehicleResponse.ok) {
            if (!vehicleResponseData.data) {
                return res.status(404).json(new apiResponse(
                    "NOT_FOUND",
                    [],
                    ["Car not found"],
                    {},
                    debug
                ))
            }
        } else {
            //Logging actual error locally not to the client
            console.error("Error getting car using numberplate from Wunderfleet", vehicleResponseData)
            return res.status(500).json(new apiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {},
                debug
            ))
        }
        const carId = vehicleResponseData.data[0].vehicleId
        console.log(carId)


        //Get reservation information from the cars id
        const reservationResponse = await fetch(wunderUrl + "/api/v2/reservations/search?sort=-reservationId", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "carId": {
                    "$eq": carId
                }
            })
        })

        const reservationResponseData = await reservationResponse.json();
        if (vehicleResponse.ok) {
            if (!reservationResponseData.data) {
                return res.status(404).json(new apiResponse(
                    "NOT_FOUND",
                    [],
                    ["No reservations were found on carId"],
                    {},
                    debug
                ))            
            }
        } else {
            //Logging actual error locally not to the client
            console.error("Error getting reservation from Wunderfleet", reservationResponseData)
            return res.status(500).json(new apiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {},
                debug
            ))
        }
        const reservations = reservationResponseData.data;
        debug.push(`Reservations on car: ${reservations.length}`)

        // Find the correct reservation based on given date and time
        const reservation = reservations.find((reservation: any) => {

            const startTime = wunderToDate(reservation.startTime)
            debug.push(`ID: ${reservation.reservationId} startTime: ${startTime}`)

            const endTime = wunderToDate(reservation.endTime)
            debug.push(`ID: ${reservation.reservationId} startTime: ${endTime}`)

            if (accidentDate > startTime && accidentDate < endTime) {
                return reservation;
            }
        });
        if (!reservation) {
        console.log(debug)

            return res.status(404).json(new apiResponse(
                "NOT_FOUND",
                [],
                ["No reservations were found on given date"],
                {},
                debug
            ))            
        }
        // Get reservationId from reservation
        const reservationId = reservation.reservationId;
        console.log('resvervation:', reservationId);

        // Get customerId from reservation
        const customerId = reservation.customerId;
        console.log('customer:', customerId);

        // Get customer information by customerId
        const renterResponse = await fetch(wunderUrl + "/api/v2/customers/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }, 
            body: JSON.stringify(
                {
                  "customerId": {
                    "$eq": customerId
                  }
                })
        })
        const renterResponseData = await renterResponse.json();
        if (renterResponse.ok) {
            if (!renterResponseData.data) {
                return res.status(404).json(new apiResponse(
                    "NOT_FOUND",
                    [],
                    ["No customers were found with customerId"],
                    {},
                    debug
                ))            
            }
        } else {
            //Logging actual error locally not to the client
            console.error("Error getting customer by customerId from Wunderfleet", renterResponseData)
            return res.status(500).json(new apiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {},
                debug
            ))
        }
        const renterData = renterResponseData.data[0];

        // Calculating age
        const renterAge = getAge(renterData.birthDate);

        // Assigning age to renter
        let renterGender = "Unknown"
        if (renterData === 0) {
            renterGender = "Other"
        } else if (renterData === 1) {
            renterGender = "Male"
        } else if (renterData === 2) {
            renterGender === "Female"
        }

        // Collecting renter data in object
        const renterInfo = {
            customerId: customerId as number, 
            reservationId: reservationId as number,
            firstName: `${renterData.firstName}`,
            lastName: `${renterData.lastName}`,
            birthDate: `${renterData.birthDate}`,
            gender: renterGender,
            age: renterAge,
            insurance: null,
        };

        
        return res.status(200).json(new apiResponse(
            "OK",
            ["User fetched succesfully"],
            [],
            renterInfo,
            debug
        ))

    } catch (error: any) {
        console.error("Error at api/wunderfleet/getRenter.ts", error.message)
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {},
            debug
        ))
    }

}