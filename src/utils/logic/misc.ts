import AppError from "../schemas/miscSchemas/errorSchema";
import axios from "axios";
import { AdminDamageReport } from "../schemas/damageReportSchemas/adminReportSchema";
import { base64Regex } from "./formattingLogic/regexs";
import { ValidMimeTypes } from "../schemas/types";


export const getEnvVariable = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new AppError('INTERNAL_ERROR', `${key} is not defined in environment.`);
    }
    return value;
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


export const blobToBuffer = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
};


export const normalizeFolderPath = (folderPath: string) => {
  // Ensure the path ends with a '/'
  let normalizedFolderPath = folderPath.endsWith('/') ? folderPath : folderPath + '/';
  
  // Ensure the path does not start with a '/'
  normalizedFolderPath = normalizedFolderPath.startsWith('/') ? normalizedFolderPath.substring(1) : normalizedFolderPath;

  // Replace double slashes with a single slash
  normalizedFolderPath = normalizedFolderPath.replace(/\/+/g, '/');

  return normalizedFolderPath;
}


export const normalizeFilePath = (filePath: string) => {
  // Ensure the path does not end with a '/'
  let normalizedFilePath = filePath.endsWith('/') ? filePath.slice(0, -1) : filePath;

  // Ensure the path does not start with a '/'
  normalizedFilePath = normalizedFilePath.startsWith('/') ? normalizedFilePath.substring(1) : normalizedFilePath;
  
  // Replace double slashes with a single slash
  normalizedFilePath = normalizedFilePath.replace(/\/+/g, '/');

  return normalizedFilePath;
}


export const base64ToBuffer = (base64String: string): Buffer => {
  try {
/*     if (!verifyBase64String(base64String)) {
      throw new Error('The provided string is not a valid Base64 string.');
    } */

    const base64Data = base64String.split(',')[1];  // Split the base64 string at the comma and take the part after it.
    const buffer = Buffer.from(base64Data || base64String, 'base64');  // Use the actual data part for conversion.
    
    console.log('Successfully converted Base64 to Buffer.');
    return buffer;
  } catch (error: any) {
    console.error('Error converting Base64 to Buffer:', error.message || error);
    throw new AppError('BASE64_CONVERSION_ERROR', 'Failed to convert base64 string to Buffer');
  }
};


export const bufferToBase64 = (buffer: Buffer): string => {
  try {
      const base64 = buffer.toString('base64');
      return base64;
  } catch (error: any) {
      console.error('Error converting Buffer to Base64:', error.message || error);
      throw new AppError('BUFFER_CONVERSION_ERROR', 'Failed to convert Buffer to Base64.');
  }
};


export const verifyBase64String = (base64string:string) => {
  return base64Regex.test(base64string);
}


export const isValidFileData = (data: any): data is { name: string; mimeType: ValidMimeTypes; fileBase64: string }[] => {
  if (!Array.isArray(data)) return false;

  return data.every(file => 
      typeof file.name === 'string' &&
      typeof file.mimeType === 'string' && // You might have additional checks for valid mime types
      Buffer.isBuffer(file.buffer)
  );
}

export const base64ToBlob = (base64String:string) => {
  // Split the base64 string into data and MIME type
  const parts = base64String.split(';');
  const mime = parts[0].split(':')[1];
  const data = parts[1].split(',')[1];

  // Decode the base64 string
  const byteCharacters = atob(data);

  // Create a numeric byte array from the decoded string
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
  }

  // Create and return the blob using the MIME type and byte array
  return new Blob([byteArray], { type: mime });
}


export const readAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
          if (typeof reader.result === "string") {
              resolve(reader.result);
          } else {
              reject(new Error('Expected result to be a string, but got an ArrayBuffer.'));
          }
      };

      reader.onerror = error => reject(error);

      reader.readAsDataURL(file);
  });
};

export const fileToBase64 = async (file: File): Promise<string> => {
  try {
    const base64 = await readAsDataURL(file);
      return base64;
  } catch (error:any) {
      throw new Error(`Failed to convert file to base64: ${error.message}`);
  }
}

export const fileToBuffer = (file: File): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      resolve(Buffer.from(reader.result as ArrayBuffer));
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};


export const fileListToFileArray = (fileList:FileList | null) => {
  try {
    const fileArray: File[] = [];

    if (!fileList || fileList.length <= 0) {
      return fileArray
    }
  
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList.item(index);
      if (!file) {
        continue;
      }
  
      fileArray.push(file);
    }
  
    return fileArray;
  } catch (error:any) {
    throw new AppError('INTERNAL_ERROR', `Error converting FileList to file Array ${error.message}`)
  }
}