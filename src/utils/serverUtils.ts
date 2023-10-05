import { NextApiRequest } from "next";

// TODO: Improve to be more secure, right now you can add a / to url and it will pass.
export function checkOrigin(req: NextApiRequest, allowedOrigins: string[]): boolean {
    const origin = req.headers.origin || req.headers.referer;

    if (!origin) return false;

    return allowedOrigins.some(o => origin.startsWith(o));
}

// TODO: Create spam protection function


export const wunderToUTC = (wunderTime:string) => {
return wunderTime.replace(" ", "T") + "Z";
}

export const wunderToDate = (wunderTime: string | null) => {
    console.log(wunderTime)
    if (!wunderTime) {
        return null
    }

    const parsed = new Date(wunderToUTC(wunderTime));

    if (isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
}

export const getReservationFromReservationId = async (reservationId:string) => {
    const wunderURL = process.env.WUNDER_DOMAIN;
    if (!wunderURL) {
        throw new Error("WUNDER_DOMAIN is not defined")
    }
    const wunderAuth = process.env.WUNDER_ACCESS_TOKEN;
    if (!wunderAuth) {
        throw new Error("WUNDER_ACCESS_TOKEN is not defined")
    }

    const response = await fetch(wunderURL + `/reservations/${reservationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": wunderAuth
        },
    }) 

    const responseJson = await response.json();
    if (!response.ok) {
        const wunderError = new Error(responseJson.errors[0]);
        wunderError.name = responseJson.status;
        throw wunderError;
    }

    return responseJson.data;
}

export const getCustomerFromCustomerId = async (customerId: string) => {
    const wunderURL = process.env.WUNDER_DOMAIN;
    if (!wunderURL) {
        throw new Error("WUNDER_DOMAIN is not defined")
    }
    const wunderAuth = process.env.WUNDER_ACCESS_TOKEN;
    if (!wunderAuth) {
        throw new Error("WUNDER_ACCESS_TOKEN is not defined")
    }

    const response = await fetch(wunderURL + `/customers/${customerId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": wunderAuth
        },
    }) 

    const responseJson = await response.json();
    if (!response.ok) {
        const wunderError = new Error(responseJson.errors[0]);
        wunderError.name = responseJson.status;
        throw wunderError;
    }

    return responseJson.data;
}

export const getVehicleByNumberplate = async (numberplate:string) => {
    const wunderURL = process.env.WUNDER_DOMAIN;
    if (!wunderURL) {
        throw new Error("WUNDER_DOMAIN is not defined")
    }
    const wunderAuth = process.env.WUNDER_ACCESS_TOKEN;
    if (!wunderAuth) {
        throw new Error("WUNDER_ACCESS_TOKEN is not defined")
    }

    const response = await fetch(wunderURL + `/vehicles/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": wunderAuth
        },
        body: JSON.stringify({
            "licencePlate": numberplate
        })
    }) 

    const responseJson = await response.json();
    if (!response.ok) {
        const wunderError = new Error(responseJson.errors[0]);
        wunderError.name = responseJson.status;
        throw wunderError;
    }

    return responseJson.data;
}

export const getVehicleByVehicleId = async (vehicleId:string) => {
    const wunderURL = process.env.WUNDER_DOMAIN;
    if (!wunderURL) {
        throw new Error("WUNDER_DOMAIN is not defined")
    }
    const wunderAuth = process.env.WUNDER_ACCESS_TOKEN;
    if (!wunderAuth) {
        throw new Error("WUNDER_ACCESS_TOKEN is not defined")
    }

    const response = await fetch(wunderURL + `/vehicles/${vehicleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": wunderAuth
        }
    }) 

    const responseJson = await response.json();
    if (!response.ok) {
        const wunderError = new Error(responseJson.errors[0]);
        wunderError.name = responseJson.status;
        throw wunderError;
    }

    return responseJson.data;
}