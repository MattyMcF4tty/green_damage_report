import { bikeInformation } from "@/components/opposite_information/bike_information_form";
import { carInformation } from "@/components/opposite_information/car_information_form";
import { OtherInformation } from "@/components/opposite_information/other_information_form";
import { PedestrianInformation } from "@/components/opposite_information/person_information_form";
import { WitnessInformation } from "@/components/otherPartys/witnessList";
import { getDocIds } from "@/firebase/clientApp";

export type pageProps = {
    data: reportDataType | null ;
    images: Record<string, string[]> | null;
    id: string;
}

export type reportDataType = {
    userEmail: string,
    finished: boolean,

    driverInfo: {
        firstName: string,
        lastName: string,
        address: string,
        socialSecurityNumber: string,
        drivingLicenseNumber: string,
        phoneNumber: string,
        email: string
    },

    accidentLocation: {lat: 0, lng: 0}
    time: string
    date: string
    accidentDescription: string

    greenCarNumberPlate: string
    speed: string
    damageDescription: string
    policeReportNumber: string

    bikerInfo: bikeInformation[]
    vehicleInfo: carInformation[]
    pedestrianInfo: PedestrianInformation[]
    otherObjectInfo: OtherInformation[]

    witnesses: WitnessInformation[]

    /* SITE LOGIC */
    /* What */
    driverRenter: boolean | null

    /* How */
    policePresent: boolean | null
    policeReportExist: boolean | null
    witnessesPresent: boolean | null

    /* Where */
    collisionPersonVehicle: boolean | null
    singleVehicleAccident: boolean | null
    collisionOther: boolean | null
    collisionCar: boolean
    collisionBike: boolean
    collisionPedestrian: boolean
}

export const generateId = async () => {
    const dataList = await getDocIds();
    let validId = false;
    let id = ""
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    /* Generates random id from chars and checks if this id is not already taken */
    while (!validId) {
        id = Array.from(crypto.getRandomValues(new Uint16Array(16)))
        .map((randomValue) => chars[randomValue % chars.length])
        .join('');

        const existingData = dataList?.find((docId) => docId === id);

        if (!existingData) {
          validId = true;
        }
    }

    return id;
}


export const GetUserPosition = () => {
    return new Promise<{ lat: number; lng: number } | undefined>((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLocation = { lat: latitude, lng: longitude };
                    resolve(userLocation);
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                    resolve(undefined);
                }
            );
        } else {
            console.error("Geolocation is not available.");
            resolve(undefined);
        }
    });
};