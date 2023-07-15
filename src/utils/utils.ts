import { getData, getDocIds } from "@/firebase/clientApp";

export type reportDataType = {
    driverName: string
    driverAddress: string
    driverSocialSecurityNumber: string
    driverDrivingLicenseNumber: string
    driverPhoneNumber: string
    driverEmail: string

    accidentLocation: {address: string, position: {lat: string, lng: string}}
    time: string
    date: string
    crashDescription: string

    greenCarNumberPlate: string
    speed: string
    damageDescription: string
    policeReport: string

    bikerInfo: {name: string, phone: string, email: string, ebike: boolean, personDamage: string}
    vehicleInfo: {name: string, phone: string, email: string, driversLicenseNumber: string, insurance: string, numberplate: string, color: string, model: string}
    pedestrianInfo: {name: string, phone: string, email: string, personDamage: string}
    otherObjectInfo: {description: string, information: string}

    witnesses: [{name: string, phone: string, email: string}]
}


export const nextPage = () => {

}

export const startReport = () => {

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