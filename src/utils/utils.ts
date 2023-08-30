import { WitnessInformation } from "@/components/otherPartys/witnessList";
import { getData, getImages, getReportIds } from "@/firebase/clientApp";
import CryptoJS from "crypto-js";
import { GetServerSidePropsContext } from "next";

export type pageProps = {
  data: {
    userEmail: string | null;
    finished: boolean;
    lastChange: string;

    driverInfo: {
      firstName: string | null;
      lastName: string | null;
      address: string | null;
      socialSecurityNumber: string | null;
      drivingLicenseNumber: string | null;
      phoneNumber: string | null;
      email: string | null;
    };

    accidentLocation: { lat: number | null; lng: number | null };
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
      location: { lat: number | null; lng: number | null };
    }[];
    vehicleInfo: {
      name: string;
      phone: string;
      email: string;
      driversLicenseNumber: string;
      insurance: string;
      numberplate: string;
      model: string;
      location: { lat: number | null; lng: number | null };
    }[];
    pedestrianInfo: {
      name: string;
      phone: string;
      email: string;
      personDamage: string;
      location: { lat: number | null; lng: number | null };
    }[];
    otherObjectInfo: {
      description: string;
      information: string;
      location: { lat: number | null; lng: number | null };
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
};

export const generateId = async () => {
  const dataList = await getReportIds();
  let validId = false;
  let id = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  /* Generates random id from chars and checks if this id is not already taken */
  while (!validId) {
    id = Array.from(crypto.getRandomValues(new Uint16Array(16)))
      .map((randomValue) => chars[randomValue % chars.length])
      .join("");

    const existingData = dataList?.find((docId: string) => docId === id);

    if (!existingData) {
      validId = true;
    }
  }

  return id;
};

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

export const encryptData = (data: reportDataType) => {
  const encryptedData = new reportDataType();
  encryptedData.updateFields({ ...data });
  const secretKey = process.env.NEXT_PUBLIC_SECRET || "";

  /* Encrypting driver info */
  Object.keys(encryptedData.driverInfo).forEach((item) => {
    if (
      typeof encryptedData.driverInfo[
        item as keyof typeof encryptedData.driverInfo
      ] === "string"
    ) {
      encryptedData.driverInfo[item as keyof typeof encryptedData.driverInfo] =
        CryptoJS.AES.encrypt(
          encryptedData.driverInfo[
            item as keyof typeof encryptedData.driverInfo
          ] as string,
          secretKey
        ).toString();
    }
  });

  /* Encrypting police journal number */
  if (encryptedData.policeReportNumber) {
    encryptedData.updateFields({
      policeReportNumber: CryptoJS.AES.encrypt(
        encryptedData.policeReportNumber,
        secretKey
      ).toString(),
    });
  }

  return encryptedData;
};

export const decryptData = (data: reportDataType) => {
  const decryptedData = new reportDataType();
  decryptedData.updateFields({ ...data });
  const secretKey = process.env.NEXT_PUBLIC_SECRET || "";

  /* Decryption driver info */
  Object.keys(decryptedData.driverInfo).forEach((item) => {
    if (
      typeof decryptedData.driverInfo[
        item as keyof typeof decryptedData.driverInfo
      ] === "string"
    ) {
      const decryptedValue = CryptoJS.AES.decrypt(
        decryptedData.driverInfo[
          item as keyof typeof decryptedData.driverInfo
        ] as string,
        secretKey
      ).toString(CryptoJS.enc.Utf8); // Convert the decrypted value to UTF-8 string
      decryptedData.driverInfo[item as keyof typeof decryptedData.driverInfo] =
        decryptedValue;
    }
  });

  /* Decrypting police journal number */
  if (decryptedData.policeReportNumber) {
    decryptedData.updateFields({
      policeReportNumber: CryptoJS.AES.decrypt(
        decryptedData.policeReportNumber,
        secretKey
      ).toString(CryptoJS.enc.Utf8),
    });
  }

  return decryptedData;
};

export const getServerSidePropsWithRedirect = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id as string;

  try {
    const data: reportDataType = await getData(id);
    const images = await getImages(id);

    if (data.finished) {
      return {
        redirect: {
          destination: "reportfinished",
          permanent: false,
        },
      };
    }

    return {
      props: {
        data: data.toPlainObject(),
        images: images || null,
        id: id,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "reportfinished",
        permanent: false,
      },
    };
  }
};

const checkFinished = () => {};

export const reportSearch = (
  reportList: { id: string; data: reportDataType }[],
  status: "all" | "finished" | "unfinished",
  filter: "id" | "driver" | "numberplate" | "date",
  search: string
) => {
  let updatedFilteredList = [...reportList];

  switch (status) {
    case "finished":
      updatedFilteredList = reportList.filter(
        (report) => report.data.finished === true
      );
      break;
    case "unfinished":
      updatedFilteredList = reportList.filter(
        (report) => report.data.finished === false
      );
      break;
  }

  if (search !== "") {
    switch (filter) {
      case "id":
        updatedFilteredList = updatedFilteredList.filter((report) =>
          report.id.includes(search)
        );
        break;
      case "driver":
        updatedFilteredList = updatedFilteredList.filter((report) => {
          if (
            report.data.driverInfo.firstName &&
            report.data.driverInfo.lastName
          ) {
            `${report.data.driverInfo.firstName.toLowerCase()} ${report.data.driverInfo.lastName.toLowerCase()}`.includes(
              search.toLowerCase()
            );
          }
        });
        break;
      case "numberplate":
        updatedFilteredList = updatedFilteredList.filter((report) => {
          if (report.data.greenCarNumberPlate) {
            report.data.greenCarNumberPlate
              .toLowerCase()
              .includes(search.toLowerCase());
          }
        });
        break;
      case "date":
        updatedFilteredList = updatedFilteredList.filter((report) => {
          if (report.data.date) {
            report.data.date.toLowerCase().includes(search.toLowerCase());
          }
        });
        break;
    }
  }

  return updatedFilteredList;
};

/* ---------------- classes ------------------------------ */
export class reportDataType {
  userEmail: string | null;
  finished: boolean;
  lastChange: string;

  driverInfo: {
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    socialSecurityNumber: string | null;
    drivingLicenseNumber: string | null;
    phoneNumber: string | null;
    email: string | null;
  };

  accidentLocation: { lat: number | null; lng: number | null };
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
    location: { lat: number | null; lng: number | null };
  }[];
  vehicleInfo: {
    name: string;
    phone: string;
    email: string;
    driversLicenseNumber: string;
    insurance: string;
    numberplate: string;
    model: string;
    location: { lat: number | null; lng: number | null };
  }[];
  pedestrianInfo: {
    name: string;
    phone: string;
    email: string;
    personDamage: string;
    location: { lat: number | null; lng: number | null };
  }[];
  otherObjectInfo: {
    description: string;
    information: string;
    location: { lat: number | null; lng: number | null };
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
    this.lastChange = `${new Date().getHours()}:${new Date().getMinutes()} - ${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
    this.driverInfo = {
      firstName: null,
      lastName: null,
      address: null,
      socialSecurityNumber: null,
      drivingLicenseNumber: null,
      phoneNumber: null,
      email: null,
    };
    this.accidentLocation = { lat: null, lng: null };
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
      lastChange: this.lastChange,
      driverInfo: {
        firstName: this.driverInfo.firstName,
        lastName: this.driverInfo.lastName,
        address: this.driverInfo.address,
        socialSecurityNumber: this.driverInfo.socialSecurityNumber,
        drivingLicenseNumber: this.driverInfo.drivingLicenseNumber,
        phoneNumber: this.driverInfo.phoneNumber,
        email: this.driverInfo.email,
      },
      accidentLocation: {
        lat: this.accidentLocation.lat,
        lng: this.accidentLocation.lng,
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
