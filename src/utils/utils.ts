import { WitnessInformation } from "@/components/otherPartys/witnessList";
import {
  collectionName,
  getImages,
  getReportIds,
  updateData,
} from "@/firebase/clientApp";
import CryptoJS from "crypto-js";
import { GetServerSidePropsContext } from "next";
import axios from "axios";
import Cookies from "js-cookie";
import app, { FireDatabase, FireStorage } from "@/firebase/firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import createReportPDF from "./reportPdfTemplate";
import jsPDF from "jspdf";
import { getReportDoc } from "./firebaseUtils/firestoreUtils";
import { getReportFile, getReportFolder } from "./firebaseUtils/storageUtils";

/* ------- utils config ----- */
const firebaseCollectionName = collectionName;

export const generateId = async () => {
  let dataList: string[];
  try {
    dataList = await getReportIds();
  } catch ( error: any ) {
    throw new Error(error.message);
  }

  let id: string | null = null;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  /* Generates random id from chars and checks if this id is not already taken */
  while (!id) {
    const newId =Array.from(crypto.getRandomValues(new Uint16Array(16)))
    .map((randomValue) => chars[randomValue % chars.length])
    .join("");

    const existingId = dataList.find((docId: string) => docId === newId);

    if (!existingId) {
      id = newId;
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
  const secretKey = process.env.DATA_ENCRYPTION_KEY || "";

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
  const secretKey = process.env.DATA_ENCRYPTION_KEY || "";

  console.log("Before Decryption", decryptedData);

  /* Decrypting police journal number */
  if (decryptedData.policeReportNumber) {
    decryptedData.updateFields({
      policeReportNumber: CryptoJS.AES.decrypt(
        decryptedData.policeReportNumber,
        secretKey
      ).toString(CryptoJS.enc.Utf8),
    });
  }

  console.log("After Decryption", decryptedData);
  return decryptedData;
};

export const getServerSidePropsWithRedirect = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id as string;

  const reportData = await getReportDoc(id, false);
  console.log(reportData)
  const GreenMobilityImages = await handleDownloadImages(
    `${id}/GreenMobility`,
    "url"
  );
  const otherPartyImages = (await getReportFolder(id, 'OtherPartyDamages/')).map((file, index) => {
    return file.url
  });
  const images: Record<string, string[]> = {
    GreenMobility: GreenMobilityImages,
    OtherParty: otherPartyImages,
  };

  reportData.isExpired();

  if (reportData.isFinished()) {
    return {
      redirect: {
        destination: "/damagereport/reportfinished",
        permanent: false,
      },
    };
  }


  return {
    props: {
      data: reportData.toPlainObject(),
      images: images || null,
      id: id,
    },
  };
};

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

export const handleSendEmail = async (
  toEmail: string,
  subject: string,
  text: string
) => {
  const data = {
    toEmail: toEmail,
    subject: subject,
    text: text,
  };

  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_URL is not defined")
  }

  const response = await fetch(url + '/api/sendEmail', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json()
  if (response.ok) {
    console.log(responseData.messages);
    return true;
  } else {
    console.error(responseData.errors)
    return false;
  }
};

export const downloadToPc = async (file: Blob, fileName: string) => {
  const url: string = window.URL.createObjectURL(file);

  // Create a 'download' anchor tag
  const downloadLink: HTMLAnchorElement = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName;

  // This will download the PDF upon click
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Cleanup
  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(url);
};

export const handleSignUp = async (email: string, password: string) => {
  const data = {
    email: email,
    password: password,
  };

  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + "/api/auth/signUp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json();
  if (response.ok) {
    console.log(responseData.messages);
    Cookies.set("AuthToken", responseData.data.userToken, {
      expires: 365 * 100,
      secure: true,
    });
    return true;
  } else {
    return false;
  }
};

export const handleVerifyUser = async (userToken: string | undefined) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + "/api/auth/verifyAdmin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToken: userToken }),
    }
  );

  const responseData = await response.json();
  if (response.ok) {
    console.log(responseData.messages);
    return true;
  } else {
    console.error(responseData.errors);
    return false;
  }
};

export const handleSignIn = async (email: string, password: string) => {
  try {
    const data = {
      email: email,
      password: password,
    };

    const response = await fetch(
      process.env.NEXT_PUBLIC_URL + "/api/auth/signIn",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();
    if (response.ok) {
      console.log(responseData.messages);
      Cookies.set("AuthToken", responseData.data.userToken, {
        expires: 365 * 100,
      });
      return true;
    } else {
      throw new Error(responseData.messages);
    }
  } catch (error: any) {
    console.error("Something went wrong signing in:\n", error.message);
    return false;
  }
};

export const handleSignOut = () => {
  Cookies.remove("AuthToken");
};

export const handleDownloadImages = async (
  path: string,
  type: "url" | "base64"
) => {
  const data = {
    path: path,
    type: type,
  };

  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + "/api/downloadImages",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  // Handling non-ok responses
  const responseData = await response.json();

  if (!response.ok) {
    console.error(`${responseData.status}:`, responseData.errors);
  }

  console.log(responseData.messages);
  const images: string[] = responseData.data.images;

  return images;
};

export const handleGeneratePdf = async (id: string) => {
  try {
    let Images: Record<string, string[]> = {
      GreenMobility: [],
      OtherParty: [],
    };

    let map: string[] = []; // Assuming handleDownloadImages returns an array of strings for maps

    try {
      Images = {
        GreenMobility: await handleDownloadImages(
          `${id}/GreenMobility`,
          "base64"
        ),
        OtherParty: await handleDownloadImages(`${id}/OtherParty`, "base64"),
      };
      map = await handleDownloadImages(`${id}/admin`, "base64");
    } catch (error) {
      console.error("Error getting images");
    }
    const data: reportDataType = new reportDataType();
    console.log(map);

    try {
      data.updateFields(await getReportDoc(id, true));
    } catch (error) {
      console.error("Error getting data");
    }
    let pdfBlob: Blob = new Blob();
    try {
      pdfBlob = await createReportPDF(data, Images, map);
    } catch (error) {
      console.error("Error creating pdf:\n", error);
    }

    try {
      await downloadToPc(pdfBlob, `DamageReport_${id}`);
    } catch (error) {
      console.error("Error downloading pdf:\n", error);
    }

    console.log(`PDF of ${id} generated and uploaded successfully.`);
  } catch (error: any) {
    console.error(error.message);
  }
};

export const handleDownloadPdf = async (id: string) => {
  try {
    const data = { id: id };
    await handleGeneratePdf(id);

    const response = await axios.post<ArrayBuffer>("/api/downloadpdf", data, {
      responseType: "arraybuffer", // Important: specify the response type as 'arraybuffer'
    });

    if (!(response.status === 200)) {
      throw new Error(`${response.status}`);
    }

    /* Convert pdfbuffer to blob and download to pc */
    const pdfBlob: Blob = new Blob([response.data], {
      type: "application/pdf",
    });

    console.log(`PDF of ${id} downloaded from server successfully.`);
    await downloadToPc(pdfBlob, `DamageReport_${id}`);
  } catch (error: any) {
    console.error("An error occurred:", error);
    return new Error(`${Response}`);
  }
};

export const getReportsByEmail = async (email: string) => {
  const collectionRef = collection(FireDatabase, firebaseCollectionName);
  const reportIDs: string[] = [];
  const q = query(
    collectionRef,
    where("userEmail", "==", email.toLowerCase()),
    where("finished", "==", false)
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map(async (doc) => {
      reportIDs.push(doc.id);
    });

    return reportIDs;
  } catch (error: any) {
    throw Error(
      `Something went wrong checking for ongoing reports:\n`,
      error.message
    );
  }
};

export const handleGetRenter = async (numberplate: string, date: Date) => {
  const data = {
    numberplate: numberplate.toUpperCase(),
    date: date,
  };

  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + "/api/wunderfleet/getRenter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.errors[0]);
  }

  return responseData.data as {
    customerId: string | null;
    reservationId: string | null;
    firstName: string | null;
    lastName: string | null;
    birthDate: string | null;
    email: string | null;
    phoneNumber: string |null;
    gender: string | null;
    age: string | null;
    insurance: boolean | null;
  };
};

export const getAge = (birthDate: Date): number => {
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const m = currentDate.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const isDateInRange = (
  startDate: Date,
  targetDate: Date,
  endDate: Date
): boolean => {
  return targetDate > startDate && targetDate < endDate;
};

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
}


export const wunderToGender = (gender: number | null) => {

  if (!gender) {
    return "Unknown"
  } 

  switch (gender) {
    case 1:
      return "Male"
    case 2:
      return "Female"
  }

  return "Other"
}

export const handleGetReportData = async (reportId: string) => {
  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_URL not defined")
  }

  const data = {reportId: reportId}

  const response = await fetch(url + "/api/damageReport/getReport", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })


  const responseJson = await response.json();
  console.log(responseJson)
  if (!response.ok) {
    const newError = new Error(responseJson.errors[0]);
    newError.name = responseJson.status;
    throw newError;
  }

  const report = new reportDataType();
  report.updateFields(responseJson.data)

  return report;
}

export const handleUpdateReport = async (reportId:string, reportData:reportDataType) => {

  const data = {
    reportId: reportId,
    reportData: reportData.toPlainObject(),
  }

  const url = process.env.NEXT_PUBLIC_URL;
  if (!url || typeof url !== 'string') {
    throw new Error("NEXT_PUBLIC_URL is not defined in enviroment")
  }

  const response = await fetch(url + '/api/damageReport/updateReport', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })

  const responseJson = await response.json();
  if (!response.ok) {
    const newError = new Error(responseJson.errors[0]);
    newError.name = responseJson.status;
    throw newError;
  }

  return;
}

export const isJSONSerializable = (data:any) => {
  try {
    JSON.stringify(data);
    return true;
  } catch (error) {
    return false;
  }
}

export const trimArrayToLimit = (limit: number, array: any[]) => {
  if (array.length > limit) {
      return array.slice(0, limit);
  }
  return array;
}

export const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const base64ToBuffer = (base64: string, contentType: string = '') => {
  const base64Regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,(.*)$/;
  const matches = base64.match(base64Regex);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid input string format');
  }
  contentType = matches[1];
  base64 = matches[2];
  return Buffer.from(base64, 'base64');
}

export const arrayBufferToBlob = (arrayBuffer: ArrayBuffer, contentType: string) => {
  return new Blob([arrayBuffer], { type: contentType });
}

export const replaceLastSlash = (path:string, replacement:string) => {
  return path.replace(/\/([^\/]*)$/, replacement + '$1');
}


export const urlToBase64 = async (url: string) => {
  let base64: string;
  try {
    // Fetch the image as an ArrayBuffer
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    // Convert the ArrayBuffer to a Base64 string
    base64 = Buffer.from(response.data, 'binary').toString('base64');

  } catch (error:any) {
    // Log or handle any error occurred during the axios call
    console.error("Error fetching the image: ", error.message);

    // Re-throw the error after logging it (or handle it in another way if desired)
    throw error;
  }

  return base64
};


/* ---------------- classes and types ------------------------------ */
export type pageProps = {
  data: {
    userEmail: string | null;
    userPhoneNumber: string | null;
    finished: boolean;
    lastChange: string;

    creationDate: string;

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
    name: string | null,
    phone: string | null,
    email: string | null,
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
    const ExpiredTime = 72 * 60 * 60 * 1000 // 72 hours

    if (this.openedDate) {
      const openedDate = new Date(this.openedDate);
      const currentDate = new Date();
  
      // If the difference between the current date and the opened date is more than 72 hours
      if (currentDate.getTime() - openedDate.getTime() > ExpiredTime) {
        this.finished = true;
        this.closedDate = `${new Date}`
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
