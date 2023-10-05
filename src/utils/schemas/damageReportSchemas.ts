export class reportDataType {
    userEmail: string | null;
    userPhoneNumber: string | null;
    finished: boolean;
    lastChange: string;
  
    openedDate: string | null;
    closedDate: string | null;
  
    driverInfo: {
      firstName: string | null;
      lastName: string | null;
      address: string | null;
      socialSecurityNumber: string | null;
      drivingLicenseNumber: string | null;
      phoneNumber: string | null;
      email: string | null;
      validDriversLicense: null | boolean;
    };
  
    renterInfo: {
      customerId: string | null;
      reservationId: string | null;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      phoneNumber: string | null;
      birthDate: string | null;
      gender: string | null;
      age: string | null;
      insurance: boolean | null;
    };
  
    accidentLocation: { lat: number | null; lng: number | null };
    accidentAddress: string;
    time: string | null;
    date: string | null;
    accidentDescription: string | null;
  
    greenCarNumberPlate: string | null;
    greenCarType: "zoe" | "van" | null;
    speed: string | null;
    damageDescription: string | null;
    policeReportNumber: string | null;
  
    bikerInfo: {
      name: string;
      phone: string;
      email: string;
      ebike: boolean | null;
      personDamage: string;
    }[];
    vehicleInfo: {
      name: string;
      phone: string;
      email: string;
      driversLicenseNumber: string;
      insurance: string;
      numberplate: string;
      model: string;
    }[];
    pedestrianInfo: {
      name: string;
      phone: string;
      email: string;
      personDamage: string;
    }[];
    otherObjectInfo: {
      description: string;
      information: string;
    }[];
  
    witnesses: {
      name: string | null;
      phone: string | null;
      email: string | null;
    }[];
  
    damages: {
      position: string | null;
      description: string | null;
      images: string[];
    }[];
  
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
      this.userEmail = null;
      this.userPhoneNumber = null;
      this.finished = false;
  
      this.openedDate = null;
      this.closedDate = null;
      this.lastChange = `${new Date().getHours()}:${new Date().getMinutes()} - ${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
      this.driverInfo = {
        firstName: null,
        lastName: null,
        address: null,
        socialSecurityNumber: null,
        drivingLicenseNumber: null,
        phoneNumber: null,
        email: null,
        validDriversLicense: null,
      };
      this.renterInfo = {
        customerId: null,
        reservationId: null,
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        birthDate: null,
        gender: null,
        age: null,
        insurance: null,
      };
      this.accidentLocation = { lat: null, lng: null };
      this.accidentAddress = "";
      this.time = null;
      this.date = null;
      this.accidentDescription = null;
      this.greenCarNumberPlate = null;
      this.greenCarType = null;
      this.speed = null;
      this.damageDescription = null;
      this.policeReportNumber = null;
      this.bikerInfo = [];
      this.vehicleInfo = [];
      this.pedestrianInfo = [];
      this.otherObjectInfo = [];
      this.witnesses = [];
      this.damages = [];
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
  
    isFinished() {
      return this.finished;
    }
  
    isExpired() {
      const ExpiredTime = 72 * 60 * 60 * 1000; // 72 hours
  
      if (this.openedDate) {
        const openedDate = new Date(this.openedDate);
        const currentDate = new Date();
  
        // If the difference between the current date and the opened date is more than 72 hours
        if (currentDate.getTime() - openedDate.getTime() > ExpiredTime) {
          this.finished = true;
          this.closedDate = `${new Date()}`;
          return true;
        }
        return false;
      }
      return false;
    }
  
    toPlainObject() {
      return {
        userEmail: this.userEmail,
        userPhoneNumber: this.userPhoneNumber,
        finished: this.finished,
        openedDate: this.openedDate,
        closedDate: this.closedDate,
        lastChange: this.lastChange,
        driverInfo: {
          firstName: this.driverInfo.firstName,
          lastName: this.driverInfo.lastName,
          address: this.driverInfo.address,
          socialSecurityNumber: this.driverInfo.socialSecurityNumber,
          drivingLicenseNumber: this.driverInfo.drivingLicenseNumber,
          phoneNumber: this.driverInfo.phoneNumber,
          email: this.driverInfo.email,
          validDriversLicense: this.driverInfo.validDriversLicense,
        },
        renterInfo: {
          customerId: this.renterInfo.customerId,
          reservationId: this.renterInfo.reservationId,
          firstName: this.renterInfo.firstName,
          lastName: this.renterInfo.lastName,
          email: this.renterInfo.email,
          phoneNumber: this.renterInfo.phoneNumber,
          birthDate: this.renterInfo.birthDate,
          gender: this.renterInfo.gender,
          age: this.renterInfo.age,
          insurance: this.renterInfo.insurance,
        },
        accidentLocation: {
          lat: this.accidentLocation.lat,
          lng: this.accidentLocation.lng,
        },
        accidentAddress: this.accidentAddress,
        time: this.time,
        date: this.date,
        accidentDescription: this.accidentDescription,
        greenCarNumberPlate: this.greenCarNumberPlate,
        greenCarType: this.greenCarType,
        speed: this.speed,
        damageDescription: this.damageDescription,
        policeReportNumber: this.policeReportNumber,
        bikerInfo: this.bikerInfo,
        vehicleInfo: this.vehicleInfo,
        pedestrianInfo: this.pedestrianInfo,
        otherObjectInfo: this.otherObjectInfo,
        witnesses: this.witnesses,
        damages: this.damages,
        driverRenter: this.driverRenter,
        policePresent: this.policePresent,
        policeReportExist: this.policeReportExist,
        witnessesPresent: this.witnessesPresent,
        otherPartyInvolved: this.otherPartyInvolved,
        singleVehicleAccident: this.singleVehicleAccident,
      };
    }
}
  