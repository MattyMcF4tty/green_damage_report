import { apiResponse } from "../types";
import { blobToBase64 } from "../utils";

export const handleCreateNewReport = async (email: string) => {
  const data = {
    email: email,
  };

  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_URL is not defined in enviroment");
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + "/api/damageReport/createNew",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    const newError = new Error(responseJson.errors[0]);
    newError.name = responseJson.status;

    throw newError;
  }

  const reportId: string = responseJson.data.reportId;

  return reportId;
};

export const handleUploadFile = async (
  file: Blob,
  path: string,
  id: string
) => {
  let base64File: string;
  try {
    base64File = await blobToBase64(file);
  } catch (error: any) {
    let newError = new Error();
    newError.name = "CONVERSION_ERROR";
    newError.message = "Failed to convert Blob to base64";
    throw newError;
  }

  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    let newError = new Error();
    newError.name = "SERVER_ERROR";
    newError.message = "NEXT_PUBLIC_URL is not defined in enviroment";
    throw newError;
  }

  const data = {
    fileBase64: base64File,
    fileType: file.type,
    path: path,
    id: id,
  };
  const response = await fetch(url + "/api/firebase/uploadFile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    let newError = new Error();
    newError.name = responseJson.status;
    newError.message = responseJson.errors[0];
    throw newError;
  }

  return true;
};

export const handleGetBase64FileFromStorage = async (
  fileUrl?: string,
  filePath?: string
) => {
  if (!filePath && !fileUrl) {
    throw new Error("Missing storagePage or url");
  }
  if (filePath && fileUrl) {
    throw new Error(
      "Can only fetch base64 file from either url or storagePath not both"
    );
  }

  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    let newError = new Error();
    newError.name = "SERVER_ERROR";
    newError.message = "NEXT_PUBLIC_URL is not defined in enviroment";
    throw newError;
  }

  let data: {};
  if (fileUrl) {
    data = { fileUrl: fileUrl };
  } else {
    data = { filePath: filePath };
  }

  const response = await fetch(url + "/api/firebase/uploadFile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    let newError = new Error();
    newError.name = responseJson.status;
    newError.message = responseJson.errors[0];
    throw newError;
  }

  return responseJson.data.base64File as string;
};
