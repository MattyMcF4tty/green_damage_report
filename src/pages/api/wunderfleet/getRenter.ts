import { getAge } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const { numberplate } = req.body;
        const wunderUrl = process.env.WUNDER_DOMAIN as string;
        const accessToken = process.env.WUNDER_ACCESS_TOKEN as string;

        if (!wunderUrl) {
            return res.status(400).json({ message: "Missing wunderfleet api url" })
        }
        if (!accessToken) {
            return res.status(400).json({ message: "Missing wunderfleet access token" })
        }
        if (numberplate === null) {
            return res.status(400).json({ message: "Missing numberplate" })
        }

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
        if (!vehicleResponse.ok) {
            return res.status(500).json({ message: `Something went wrong fetching vehicle info by numberplate`, error: vehicleResponseData.errors})
        }
        const carId = vehicleResponseData.data[0].vehicleId

        //Get reservation information from the cars id
        const reservationResponse = await fetch(wunderUrl + "/api/v2/reservations/search", {
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
        if (!vehicleResponse.ok) {
            return res.status(500).json({ message: `Something went wrong fetching reservation info by carId`, error: reservationResponseData.errors})
        }
        const reservations = reservationResponseData.data.length-1 as number;
        const newestReservation = reservationResponseData.data[reservations];
        const reservationId =  newestReservation.reservationId;
        const customerId = newestReservation.customerId;

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
        if (!renterResponse.ok) {
            return res.status(500).json({ message: `Something went wrong fetching reservation info by carId`, error: reservationResponseData.errors})
        }

        const renterData = renterResponseData.data[0];


        const renterAge = getAge(renterData.birthDate)

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

        
        return res.status(200).json({ message: "Renter fecthing from wunderfleet completed succesfully", data: renterInfo})
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong getting renter:\n${error}`})
    }

}