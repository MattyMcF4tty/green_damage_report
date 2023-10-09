import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { getEnvVariable } from "../misc";

export const dateToWunder = (date: Date) => {
    const yyyy = date.getUTCFullYear();
    const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const HH = String(date.getUTCHours()).padStart(2, "0");
    const mm = String(date.getUTCMinutes()).padStart(2, "0");
    const ss = String(date.getUTCSeconds()).padStart(2, "0");
  
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  };
  
  export const wunderToUTC = (wunderTime: string) => {
    return wunderTime.replace(" ", "T") + "Z";
  };
  
  export const wunderToDate = (wunderTime: string | null) => {
    console.log(wunderTime);
    if (!wunderTime) {
      return null;
    }
  
    const parsed = new Date(wunderToUTC(wunderTime));
  
    if (isNaN(parsed.getTime())) {
      return null;
    }
  
    return parsed;
  };
  
  export const wunderToGender = (gender: number | null) => {
    if (!gender) {
      return "Unknown";
    }
  
    switch (gender) {
      case 1:
        return "Male";
      case 2:
        return "Female";
    }
  
    return "Other";
  };
  
export const getReservationFromReservationId = async (reservationId:string) => {
    const wunderURL = getEnvVariable('WUNDER_DOMAIN');
    const wunderAuth = getEnvVariable('WUNDER_ACCESS_TOKEN');

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

    return responseJson.data ? responseJson.data[0] : null;
}

export const getCustomerFromCustomerId = async (customerId: string) => {
    const wunderURL = getEnvVariable('WUNDER_DOMAIN');
    const wunderAuth = getEnvVariable('WUNDER_ACCESS_TOKEN');

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

    return responseJson.data ? responseJson.data[0] : null;
}

export const getVehicleByNumberplate = async (numberplate:string) => {
    const wunderURL = getEnvVariable('WUNDER_DOMAIN');
    const wunderAuth = getEnvVariable('WUNDER_ACCESS_TOKEN');

    const response = await fetch(wunderURL + `/vehicles/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": wunderAuth
        },
        body: JSON.stringify({
            "licencePlate": {
                "$eq": numberplate
            }
        })
    }) 
    console.log(response)

    const responseJson = await response.json();
    if (!response.ok) {
        throw new AppError(responseJson.status, responseJson.errors[0]);
    }

    return responseJson.data ? responseJson.data[0] : null;
}

export const getVehicleByVehicleId = async (vehicleId:string) => {
    const wunderURL = getEnvVariable('WUNDER_DOMAIN');
    const wunderAuth = getEnvVariable('WUNDER_ACCESS_TOKEN');

    const response = await fetch(wunderURL + `/vehicles/${vehicleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": wunderAuth
        }
    }) 

    const responseJson = await response.json();
    if (!response.ok) {
        throw new AppError(responseJson.status, responseJson.errors[0]);
    }

    return responseJson.data ? responseJson.data[0] : null;
}




export const getWunderVehicle = async () => {
    const wunderUrl = getEnvVariable('WUNDER_DOMAIN');

/*     const response = fecth (wunderUrl + '/')
 */}