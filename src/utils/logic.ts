import { useJsApiLoader } from "@react-google-maps/api";

/* Driver Information Class: The class with all the information we need about the driver of the GreenMobility Car */
export class DriverInformation {
    firstName:string;
    lastName:string;
    address:string;
    socialSecurityNumber:string;
    drivingLicenseNumber:string;
    phoneNumber:string;
    email:string;
};

/* Accident Information Class: The class with all the information we need about the accident */
export class AccidentInformation {
    location: {address:string, position:{lat: number, lng: number}};    
    greenCarNumberPlate: string;
    time: string;
    date: string;
    speed: string | undefined;
    crashDescription: string | undefined;
    damageDescription: string | undefined;
    
    constructor(location, greenCarNumberPlate, time, date) {
        this.location = location;
        this.greenCarNumberPlate = greenCarNumberPlate;
        this.time = time;
        this.date = date;
    }
};


/* Witness class: The class with all the information we need about a witness */
export class WitnessInformation {
    name: string;
    phone: string;
    email: string;
};