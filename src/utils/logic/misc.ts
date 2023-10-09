import { GetServerSidePropsContext } from "next";
import AppError from "../schemas/miscSchemas/errorSchema";
import { getCustomerDamageReport, getDamageReportIds, getReportFolder } from "./damageReportLogic.ts/damageReportHandling";
import { CustomerDamageReport } from "../schemas/damageReportSchemas/customerReportSchema";
import axios from "axios";
import { AdminDamageReport } from "../schemas/damageReportSchemas/adminReportSchema";

//TODO: Does not work on client side for some reason;s
export const getEnvVariable = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new AppError('INTERNAL_ERROR', `${key} is not defined in environment.`);
    }
    return value;
};


export const generateId = async () => {
    const dataList = await getDamageReportIds();
  
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    /* Generates random id from chars and checks if this id is not already taken */
    let id: string | null = null;
    while (!id) {
      const newId = Array.from(crypto.getRandomValues(new Uint16Array(16)))
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

  export const isJSONSerializable = (data: any) => {
    try {
      JSON.stringify(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  export const getServerSidePropsWithRedirect = async (
    context: GetServerSidePropsContext
  ) => {
    const id = context.query.id as string;
  
    const damageReport = await getCustomerDamageReport(id);
    const GreenMobilityImages: string[] = [];
  
    const otherPartyImages = (
      await getReportFolder(id, "OtherPartyDamages/")
    ).map((file, index) => {
      return file.url;
    });
    const images: Record<string, string[]> = {
      GreenMobility: GreenMobilityImages,
      OtherParty: otherPartyImages,
    };
  
    damageReport.isExpired();
  
    if (damageReport.isFinished()) {
      return {
        redirect: {
          destination: "/damagereport/reportfinished",
          permanent: false,
        },
      };
    }

    return {
      props: {
        data: damageReport.toPlainObject(),
        images: images || null,
        id: id,
      },
    };
  };

export const reportSearch = (
    reportList: { id: string; data: AdminDamageReport }[],
    status: "all" | "finished" | "unfinished",
    filter: "id" | "customerId" | "numberplate" | "date",
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

        case "customerId":
          updatedFilteredList = updatedFilteredList.filter((report) => {
            const customerId = report.data.renterInfo.customerId;
            if (customerId)
            customerId.toLowerCase().includes(search.toLowerCase())
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
      throw new Error("NEXT_PUBLIC_URL is not defined");
    }
  
    const response = await fetch(url + "/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    const responseData = await response.json();
    if (response.ok) {
      console.log(responseData.messages);
      return true;
    } else {
      console.error(responseData.errors);
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

  export const trimArrayToLimit = (limit: number, array: any[]) => {
    if (array.length > limit) {
      return array.slice(0, limit);
    }
    return array;
  };
  
  export const blobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };


  export const base64ToBuffer = (base64: string, contentType: string = "") => {
    const base64Regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,(.*)$/;
    const matches = base64.match(base64Regex);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid input string format");
    }
    contentType = matches[1];
    base64 = matches[2];
    return Buffer.from(base64, "base64");
  };
  
  export const arrayBufferToBlob = (
    arrayBuffer: ArrayBuffer,
    contentType: string
  ) => {
    return new Blob([arrayBuffer], { type: contentType });
  };
  
  export const replaceLastSlash = (path: string, replacement: string) => {
    return path.replace(/\/([^\/]*)$/, replacement + "$1");
  };
  
  export const urlToBase64 = async (url: string) => {
    let base64: string;
    let mimeType: string;
    try {
      // Fetch the image as an ArrayBuffer
      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });
  
      // Convert the ArrayBuffer to a Base64 string
      base64 = Buffer.from(response.data, "binary").toString("base64");
  
      // Get the MIME type
      mimeType = response.headers["content-type"];
    } catch (error: any) {
      // Log or handle any error occurred during the axios call
      console.error("Error fetching the image: ", error.message);
  
      // Re-throw the error after logging it (or handle it in another way if desired)
      throw error;
    }
  
    // Return the Base64 encoded string with the MIME type
    return `data:${mimeType};base64,${base64}`;
  };


  export const dateToString = (date:Date) => {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`
  }