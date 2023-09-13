import { NextApiRequest, NextApiResponse } from "next";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const { numberplate } = req.body;
        const wunderUrl = process.env.WUNDER_STAGING_DOMAIN as string;
        const accessToken = process.env.WUNDER_ACCESS_TOKEN as string;
        const testNumberplate = "CX 86 711"

        if (!wunderUrl) {
            return res.status(400).json({ message: "Missing wunderfleet api url" })
        }
        if (!accessToken) {
            return res.status(400).json({ message: "Missing wunderfleet access token" })
        }
        if (!numberplate) {
            return res.status(400).json({ message: "Missing numberplate" })
        }

        const response = await fetch(wunderUrl + "/api/v2/vehicles/search", {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': accessToken,
            },
            body: JSON.stringify({
                "licencePlate": {
                    "$gte": testNumberplate
                }
            })
        })

        const responseData = await response.json();
        console.log(responseData.errors)
        if (!response.ok) {
            return res.status(500).json({ message: `Something went wrong contacting wunderfleet:`})
        }
        const renter = {davs: "sdgrg"}

        
        return res.status(200).json({ message: "Renter fecthing from wunderfleet completed succesfully", data: renter})
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong getting renter:\n${error}`})
    }

}