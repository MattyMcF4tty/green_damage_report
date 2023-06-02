
export class AccidentInformation {
    firstName:string | undefined;
    lastName:string | undefined;
    address:string | undefined;
    socialSecurityNumber:string | undefined;
    drivingLicenseNumber:string | undefined;
    phoneNumber:string | undefined;
    email:string | undefined;

    location: {address:string, position:{lat: number, lng: number}} | undefined; 
    greenCarNumberPlate: string | undefined;
    time: string | undefined;
    date: string | undefined;
    speed: string | undefined;
    crashDescription: string | undefined;
    damageDescription: string | undefined;

    witnesses: WitnessInformation[] | undefined;
};

/* Witness class: The class with all the information we need about a witness */
export class WitnessInformation {
    name: string | undefined;
    phone: string | undefined;
    email: string | undefined;
};



