import Cookies from "js-cookie";
import { blobToBase64 } from "../misc";


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

  const response = await fetch(url + "/api/firebase/downloadFileBase64", {
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