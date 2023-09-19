import { apiResponse } from "@/utils/types";
import { getAge } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json(new apiResponse(
                "METHOD_NOT_ALLOWED",
                [],
                ["Method is not allowed"],
                {}
            ))
        }

        const wunderUrl = process.env.WUNDER_DOMAIN;
        const accessToken = process.env.WUNDER_ACCESS_TOKEN;
        const { numberplate, date } = req.body;
        
        try { 
            if (!wunderUrl || typeof wunderUrl !== 'string') {
                throw new Error("Incorrect Wunderfleet api url format");
            }
            if (!accessToken || typeof accessToken !== 'string') {
                throw new Error("Incorrect accessToken format");
            }
            if (!numberplate || typeof numberplate !== 'string') {
                throw new Error("Incorrect numberplate format");
            }
            if (!date || typeof date !== 'string') {
                throw new Error("Incorrect date");
            }
        } catch (error: any) {
            return res.status(400).json(new apiResponse(
                "BAD_REQUEST",
                [],
                [error.message],
                {}
            ))
        }
        const accidentDate = new Date(date)
        console.log(accidentDate)

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
                    {}
                ))
            }
        } else {
            //Logging actual error locally not to the client
            console.error("Error getting car using numberplate from Wunderfleet", vehicleResponseData)
            return res.status(500).json(new apiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {}
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
                    {}
                ))            
            }
        } else {
            //Logging actual error locally not to the client
            console.error("Error getting reservation from Wunderfleet", reservationResponseData)
            return res.status(500).json(new apiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {}
            ))
        }
        const reservations = reservationResponseData.data;

        // Find the correct reservation based on given date and time
        const reservation = reservations.find((reservation: any) => {
            const startTime: Date = new Date(reservation.startTime);
            const endTime: Date = new Date(reservation.endTime);
            if (accidentDate > startTime && accidentDate < endTime) {
                return reservation;
            }
        });
        if (!reservation) {
            return res.status(404).json(new apiResponse(
                "NOT_FOUND",
                [],
                ["No reservations were found on given date"],
                {}
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
                    {}
                ))            
            }
        } else {
            //Logging actual error locally not to the client
            console.error("Error getting customer by customerId from Wunderfleet", renterResponseData)
            return res.status(500).json(new apiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {}
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
            gender: `${renterData.gender}`,
            age: renterAge,
            insurance: null,
        };

        
        return res.status(200).json(new apiResponse(
            "OK",
            ["User fetched succesfully"],
            [],
            renterInfo
        ))

    } catch (error: any) {
        console.error("Error contacting Wunderfleet", error.message)
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

}