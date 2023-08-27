import { bikeInformation } from "@/components/opposite_information/bike_information_form";
import { carInformation } from "@/components/opposite_information/car_information_form";
import { OtherInformation } from "@/components/opposite_information/other_information_form";
import { PedestrianInformation } from "@/components/opposite_information/person_information_form";
import { WitnessInformation } from "@/components/otherPartys/witnessList";
import { getReportIds } from "@/firebase/clientApp";
import { stringify } from "postcss";


export type pageProps = {
    data: {    userEmail: string | null;
        finished: boolean;
    
        driverInfo: {
            firstName: string | null;
            lastName: string | null;
            address: string | null;
            socialSecurityNumber: string | null;
            drivingLicenseNumber: string | null;
            phoneNumber: string | null;
            email: string | null;
        };
    
        accidentLocation: {lat: number | null, lng: number | null};
        time: string | null;
        date: string | null;
        accidentDescription: string | null;
    
        greenCarNumberPlate: string | null;
        speed: string | null;
        damageDescription: string | null;
        policeReportNumber: string | null;
    
        bikerInfo: {  
            name: string;
            phone: string;
            email: string;
            ebike: boolean | null;
            personDamage: string;
            location: {lat: number | null, lng: number | null};
        }[];
        vehicleInfo: {  
            name: string;
            phone: string;
            email: string;
            driversLicenseNumber: string;
            insurance: string;
            numberplate: string;
            model: string;
            location: {lat: number | null, lng: number | null};
        }[];
        pedestrianInfo: {  
            name: string;
            phone: string;
            email: string;
            personDamage: string;
            location: {lat: number | null, lng: number | null};
        }[];
        otherObjectInfo: {  
            description: string;
            information: string;
            location: {lat: number | null, lng: number | null};
        }[];
    
        witnesses: WitnessInformation[];
    
        /* SITE LOGIC */
        /* What */
        driverRenter: boolean | null;
    
        /* How */
        policePresent: boolean | null;
        policeReportExist: boolean | null;
        witnessesPresent: boolean | null;
    
        /* Where */
        otherPartyInvolved: boolean | null;
        singleVehicleAccident: boolean | null;
    };
    images: Record<string, string[]> | null;
    id: string;
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

export const reportSearch = (reportList: {id: string; data: reportDataType}[], status: 'all' | 'finished' | 'unfinished', filter: 'id' | 'driver' | 'numberplate' | 'date', search: string) => {
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


/* ---------------- classes ------------------------------ */
export class reportDataType {
    userEmail: string | null;
    finished: boolean;

    driverInfo: {
        firstName: string | null;
        lastName: string | null;
        address: string | null;
        socialSecurityNumber: string | null;
        drivingLicenseNumber: string | null;
        phoneNumber: string | null;
        email: string | null;
    };

    accidentLocation: {lat: number | null, lng: number | null};
    time: string | null;
    date: string | null;
    accidentDescription: string | null;

    greenCarNumberPlate: string | null;
    speed: string | null;
    damageDescription: string | null;
    policeReportNumber: string | null;

    bikerInfo: {  
        name: string;
        phone: string;
        email: string;
        ebike: boolean | null;
        personDamage: string;
        location: {lat: number | null, lng: number | null};
    }[];
    vehicleInfo: {  
        name: string;
        phone: string;
        email: string;
        driversLicenseNumber: string;
        insurance: string;
        numberplate: string;
        model: string;
        location: {lat: number | null, lng: number | null};
    }[];
    pedestrianInfo: {  
        name: string;
        phone: string;
        email: string;
        personDamage: string;
        location: {lat: number | null, lng: number | null};
    }[];
    otherObjectInfo: {  
        description: string;
        information: string;
        location: {lat: number | null, lng: number | null};
    }[];

    witnesses: WitnessInformation[];

    /* SITE LOGIC */
    /* What */
    driverRenter: boolean | null;

    /* How */
    policePresent: boolean | null;
    policeReportExist: boolean | null;
    witnessesPresent: boolean | null;

    /* Where */
    otherPartyInvolved: boolean | null;
    singleVehicleAccident: boolean | null;

    constructor() {
        this.userEmail = "";
        this.finished = false;
        this.driverInfo = {
            firstName: null,
            lastName: null,
            address: null,
            socialSecurityNumber: null,
            drivingLicenseNumber: null,
            phoneNumber: null,
            email: null,
        };
        this.accidentLocation = {lat: null, lng: null};
        this.time = null;
        this.date = null;
        this.accidentDescription = null;
        this.greenCarNumberPlate = null;
        this.speed = null;
        this.damageDescription = null;
        this.policeReportNumber = null;
        this.bikerInfo = [];
        this.vehicleInfo = [];
        this.pedestrianInfo = [];
        this.otherObjectInfo = [];
        this.witnesses = [];
        this.driverRenter = null;
        this.policePresent = null;
        this.policeReportExist = null;
        this.witnessesPresent = null;
        this.otherPartyInvolved = null;
        this.singleVehicleAccident = null;
    }

    updateFields(fields: Partial<reportDataType>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            userEmail: this.userEmail,
            finished: this.finished,
            driverInfo: {
                firstName: this.driverInfo.firstName,
                lastName: this.driverInfo.lastName,
                address: this.driverInfo.address,
                socialSecurityNumber: this.driverInfo.socialSecurityNumber,
                drivingLicenseNumber: this.driverInfo.drivingLicenseNumber,
                phoneNumber: this.driverInfo.phoneNumber,
                email: this.driverInfo.email
            },
            accidentLocation: {
                lat: this.accidentLocation.lat,
                lng: this.accidentLocation.lng
            },
            time: this.time,
            date: this.date,
            accidentDescription: this.accidentDescription,
            greenCarNumberPlate: this.greenCarNumberPlate,
            speed: this.speed,
            damageDescription: this.damageDescription,
            policeReportNumber: this.policeReportNumber,
            bikerInfo: this.bikerInfo,
            vehicleInfo: this.vehicleInfo,
            pedestrianInfo: this.pedestrianInfo,
            otherObjectInfo: this.otherObjectInfo,
            witnesses: this.witnesses,
            driverRenter: this.driverRenter,
            policePresent: this.policePresent,
            policeReportExist: this.policeReportExist,
            witnessesPresent: this.witnessesPresent,
            otherPartyInvolved: this.otherPartyInvolved,
            singleVehicleAccident: this.singleVehicleAccident,
        };
    }
}