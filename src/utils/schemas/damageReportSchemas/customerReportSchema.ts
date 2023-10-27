import {
  cryptoText,
  decryptArray,
  decryptObject,
  decryptText,
  encryptArray,
  encryptObject,
  encryptText,
} from "@/utils/security/crypto";
import { Biker, BikerSchema } from "../incidentDetailSchemas/bikerSchema";
import { DriverSchema } from "../incidentDetailSchemas/driverSchema";
import {
  IncidentObject,
  IncidentObjectSchema,
} from "../incidentDetailSchemas/incidentObjectSchema";
import {
  Pedestrian,
  PedestrianSchema,
} from "../incidentDetailSchemas/pedestrianSchema";
import { Vehicle, VehicleSchema } from "../incidentDetailSchemas/vehicleSchema";
import { Witness, WitnessSchema } from "../incidentDetailSchemas/witnessSchema";
import { Damage, DamageSchema } from "../incidentDetailSchemas/damageSchema";

export interface CustomerDamageReportSchema {
  userEmail: string | null;
  userPhoneNumber: string | null;
  finished: boolean;
  lastChange: string;
  openedDate: string | null;
  closedDate: string | null;

  driverInfo: DriverSchema;

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

  bikerInfo: BikerSchema[];
  vehicleInfo: VehicleSchema[];
  pedestrianInfo: PedestrianSchema[];
  otherObjectInfo: IncidentObjectSchema[];

  witnesses: WitnessSchema[];

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
}

export class CustomerDamageReport implements CustomerDamageReportSchema {
  userEmail: string | null;
  userPhoneNumber: string | null;
  finished: boolean;
  lastChange: string;

  openedDate: string | null;
  closedDate: string | null;

  driverInfo: DriverSchema;

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

  bikerInfo: BikerSchema[];
  vehicleInfo: VehicleSchema[];
  pedestrianInfo: PedestrianSchema[];
  otherObjectInfo: IncidentObjectSchema[];

  witnesses: WitnessSchema[];

  damages: DamageSchema[];

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
    this.lastChange = `${new Date()}`;
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

  updateFields(fields: Partial<CustomerDamageReport>) {
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

  crypto(type: "decrypt" | "encrypt") {
    return {
      userEmail: this.userEmail,
      userPhoneNumber: cryptoText(type, this.userPhoneNumber),
      finished: this.finished,
      openedDate: this.openedDate,
      closedDate: this.closedDate,
      lastChange: this.lastChange,
      driverInfo: {
        firstName: cryptoText(type, this.driverInfo.firstName),
        lastName: cryptoText(type, this.driverInfo.lastName),
        address: cryptoText(type, this.driverInfo.address),
        socialSecurityNumber: cryptoText(
          type,
          this.driverInfo.socialSecurityNumber
        ),
        drivingLicenseNumber: cryptoText(
          type,
          this.driverInfo.drivingLicenseNumber
        ),
        phoneNumber: cryptoText(type, this.driverInfo.phoneNumber),
        email: cryptoText(type, this.driverInfo.email),
        validDriversLicense: this.driverInfo.validDriversLicense,
      },
      accidentLocation: {
        lat: this.accidentLocation.lat,
        lng: this.accidentLocation.lng,
      },
      accidentAddress: this.accidentAddress,
      time: this.time,
      date: this.date,
      accidentDescription: cryptoText(type, this.accidentDescription),
      greenCarNumberPlate: this.greenCarNumberPlate,
      greenCarType: this.greenCarType,
      speed: this.speed,
      damageDescription: cryptoText(type, this.damageDescription),
      policeReportNumber: cryptoText(type, this.policeReportNumber),
      bikerInfo: this.bikerInfo.map((bike) => {
        return new Biker(
          bike.name,
          bike.phone,
          bike.email,
          bike.ebike,
          bike.personDamage
        ).crypto(type);
      }),
      vehicleInfo: this.vehicleInfo.map((vehicle) => {
        return new Vehicle(
          vehicle.name,
          vehicle.phone,
          vehicle.email,
          vehicle.driversLicenseNumber,
          vehicle.insurance,
          vehicle.numberplate,
          vehicle.model
        ).crypto(type);
      }),
      pedestrianInfo: this.pedestrianInfo.map((pedestrian) => {
        return new Pedestrian(
          pedestrian.name,
          pedestrian.phone,
          pedestrian.email,
          pedestrian.personDamage
        ).crypto(type);
      }),
      otherObjectInfo: this.otherObjectInfo.map((otherObject) => {
        return new IncidentObject(
          otherObject.description,
          otherObject.information
        ).crypto(type);
      }),
      witnesses: this.witnesses.map((witness) => {
        return new Witness(witness.name, witness.phone, witness.email).crypto(
          type
        );
      }),
      damages: this.damages.map((damage) => {
        return new Damage(
          damage.position,
          damage.description,
          damage.images
        ).crypto(type);
      }),
      driverRenter: this.driverRenter,
      policePresent: this.policePresent,
      policeReportExist: this.policeReportExist,
      witnessesPresent: this.witnessesPresent,
      otherPartyInvolved: this.otherPartyInvolved,
      singleVehicleAccident: this.singleVehicleAccident,
    };
  }
}
