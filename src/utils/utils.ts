import { bikeInformation } from "@/components/opposite_information/bike_information_form";
import { carInformation } from "@/components/opposite_information/car_information_form";
import { OtherInformation } from "@/components/opposite_information/other_information_form";
import { PedestrianInformation } from "@/components/opposite_information/person_information_form";
import { getReportIds } from "@/firebase/clientApp";


export type pageProps = {
    data: reportDataType | null ;
    images: Record<string, string[]> | null;
    id: string;
}

export type reportDataType = {
    userEmail: string,
    finished: boolean,
    lastChange: {time: string, date: string},

    driverInfo: {
        firstName: string,
        lastName: string,
        address: string,
        socialSecurityNumber: string,
        drivingLicenseNumber: string,
        phoneNumber: string,
        email: string
    },

    accidentLocation: string
    time: string
    date: string
    accidentDescription: string

    greenCarNumberPlate: string
    speed: string
    damageDescription: string
    policeReportNumber: string

    bikerInfo: bikeInformation
    vehicleInfo: carInformation
    pedestrianInfo: PedestrianInformation
    otherObjectInfo: OtherInformation

    witnesses: {name:string, phone:string, email:string}[]

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
    const dataList = await getReportIds();
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

export const reportSearch = (reportList: {id: string; data: reportDataType;}[], status: 'all' | 'finished' | 'unfinished', filter: 'id' | 'driver' | 'numberplate' | 'date', search: string) => {
    let updatedFilteredList = [...reportList];

    switch (status) {
        case 'finished':
        updatedFilteredList = reportList.filter(report => report.data.finished === true);
        break;
        case 'unfinished':
        updatedFilteredList = reportList.filter(report => report.data.finished === false);
        break;
    }

    if (search !== "") {
        switch (filter) {
        case 'id':
            updatedFilteredList = updatedFilteredList.filter(report => report.id.includes(search));
            break;
        case 'driver':
            updatedFilteredList = updatedFilteredList.filter(report =>
            report.data.driverInfo.firstName !== undefined &&
            `${report.data.driverInfo.firstName.toLowerCase()} ${report.data.driverInfo.lastName.toLowerCase()}`.includes(search.toLowerCase())
            );
            break;
        case 'numberplate':
            updatedFilteredList = updatedFilteredList.filter(report =>
            report.data.greenCarNumberPlate.toLowerCase().includes(search.toLowerCase())
            );
            break;
        case 'date':
            updatedFilteredList = updatedFilteredList.filter(report =>
            report.data.date.toLowerCase().includes(search.toLowerCase())
            );
            break;
        };
    };

    return updatedFilteredList;
}