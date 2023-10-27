import {
  AdminDamageReport,
  AdminDamageReportSchema,
} from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { ValidMimeTypes } from "@/utils/schemas/types";
import { blobToBase64, normalizeFilePath, normalizeFolderPath } from "../misc";

export const fecthCustomerDamageReport = async (reportId: string) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  try {
    const response = await fetch(
      `${appUrl}/api/damageReport/getReport?reportId=${reportId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseJson = await response.json();
    if (!response.ok) {
      throw new AppError(responseJson.status, responseJson.erros[0]);
    }

    console.log(responseJson.messages[0]);
    const damageReport = new CustomerDamageReport();
    damageReport.updateFields(responseJson.data);

    return damageReport;
  } catch (error: any) {
    throw new AppError(error.code || error.name, error.message);
  }
};

export const fetchAdminDamageReport = async (reportId: string) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  try {
    const response = await fetch(
      `${appUrl}/api/damageReport/admin/getReport?reportId=${reportId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseJson = await response.json();
    if (!response.ok) {
      console.error(`${responseJson.status}:`, responseJson.erros[0])
      throw new AppError(responseJson.status, responseJson.erros[0]);
    }

    console.log(responseJson.messages[0]);
    const damageReport = new AdminDamageReport();
    damageReport.updateFields(responseJson.data);

    return damageReport;
  } catch (error: any) {
    throw new AppError(error.code || error.name, error.message);
  }
};

export const patchCustomerDamageReport = async (
  reportId: string,
  data: Partial<AdminDamageReport>
) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  try {
    const response = await fetch(
      `${appUrl}/api/damageReport/updateReport?reportId=${reportId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      }
    );

    const responseJson = await response.json();
    if (!response.ok) {
      throw new AppError(responseJson.status, responseJson.erros[0]);
    }

    console.log(responseJson.messages[0]);
  } catch (error: any) {
    throw new AppError(error.code || error.name, error.message);
  }
};

export const requestDamageReportCreation = async (email: string) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  try {
    const response = await fetch(`${appUrl}/api/damageReport/createReport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new AppError(responseJson.status, responseJson.erros[0]);
    }

    console.log(responseJson.messages[0]);
    const reportId = responseJson.data.reportId;
    return reportId as string;
  } catch (error: any) {
    throw new AppError(error.code || error.name, error.message);
  }
};

export const requestDamageReportDeletion = async (reportId: string) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  try {
    const response = await fetch(
      `${appUrl}/api/damageReport/admin/deleteReport?reportId=${reportId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseJson = await response.json();
    if (!response.ok) {
      throw new AppError(responseJson.status, responseJson.erros[0]);
    }

    console.log(responseJson.messages[0]);
  } catch (error: any) {
    throw new AppError(error.code || error.name, error.message);
  }
};

export const fetchAllDamageReports = async () => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  try {
    const response = await fetch(
      `${appUrl}/api/damageReport/admin/getAllReports`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseJson = await response.json();
    if (!response.ok) {
      throw new AppError(responseJson.status, responseJson.erros[0]);
    }

    const responseData: {
      damageReports: { id: string; data: AdminDamageReportSchema }[];
    } = responseJson.data;
    const damageReports = responseData.damageReports.map(
      (damageReport: { id: string; data: AdminDamageReportSchema }) => {
        const newDamageReport = new AdminDamageReport();
        newDamageReport.updateFields(damageReport.data);

        return {
          id: damageReport.id as string,
          data: newDamageReport,
        };
      }
    );

    console.log(responseJson.messages[0]);
    return damageReports;
  } catch (error: any) {
    throw new AppError(error.code || error.name, error.message);
  }
};

export const uploadFileToDamageReport = async(reportId:string, filePath:string, fileBase64:string) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  const data = {
    filePath:filePath,
    fileBase64:fileBase64,
  }

  const response = await fetch(
    `${appUrl}/api/damageReport/uploadFile?reportId=${reportId}`,
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
    throw new AppError(responseJson.status, responseJson.errors[0]);
  }

  console.log(responseJson.messages[0]);
  return;
};

export const fetchDamageReportFileUrl = async (reportId:string, filePath:string) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  const query = {
    filePath: filePath,
  };

  const response = await fetch(
    `${appUrl}/api/damageReport/getFileUrl?reportId=${reportId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new AppError(responseJson.status, responseJson.errors[0]);
  }

  return responseJson.data as { fileName: string; downloadUrl: string };
};

export const requestDamageReportFileDeletion = async (
  reportId: string,
  filePath: string
) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  const response = await fetch(`${appUrl}/api/damageReport/deleteFile?reportId=${reportId}&filePath=${filePath}`, {
    method: 'DELETE',
  });

  const responseMessage = await response.text();
  if (!response.ok) {
    throw new AppError(response.statusText, responseMessage);
  }

  return;
};

export const uploadFolderToDamageReport = async (reportId:string, folderPath:string, fileData:{
  name: string;
  fileBase64: string;
}[]) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  const normalizedFolderPath = normalizeFolderPath(folderPath)
  const errors: string[] = [];

  for (let i = 0; i < fileData.length; i++) {
    const file = fileData[i];
    
    try {
      await uploadFileToDamageReport(reportId, normalizedFolderPath+file.name, file.fileBase64)    
    } catch (error:any) {
      errors.push(error.message)
    }
  }

  if (errors.length > 0) {
    throw new AppError('UPLOAD_ERROR', `${errors.length} errors when uploading: ${errors}`)
  }

}


export const fetchDamageReportFolderFilesUrl = async (reportId:string, folderPath:string) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  const query = {
    folderPath: folderPath,
  };

  const response = await fetch(
    `${appUrl}/api/damageReport/getFolderUrls?reportId=${reportId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new AppError(responseJson.status, responseJson.errors[0]);
  }

  console.log(responseJson.messages[0]);
  return responseJson.data as {
    fileName: string;
    downloadUrl: string;
  }[];
};

export const requestDamageReportFolderDeletion = async (
  reportId: string,
  folderPath: string
) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  const response = await fetch(`${appUrl}/api/damageReport/deleteFolder?reportId=${reportId}&folderPath=${folderPath}`, {
    method: 'DELETE',
  });

  const responseMesage = await response.text();
  if (!response.ok) {
    throw new AppError(response.statusText, responseMesage);
  }

  console.log(responseMesage);
  return
}


export const requestQueryDamageReports = async (
  variable: string,
  operation: FirebaseFirestore.WhereFilterOp,
  value: string
) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }

  const query = {
    qVar: variable,
    qOperation: operation,
    qValue: value,
  };

  const response = await fetch(`${appUrl}/api/damageReport/queryReports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new AppError(responseJson.status, responseJson.errors[0]);
  }

  console.log(responseJson.messages[0]);
  return responseJson.data.docIds as string[];
};

//TODO: Handle the bad responses, first need to fix the api route
export const requestDamageReportFileDownload = async (reportId: string, filePath: string) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError('INTERNAL_ERROR', 'NEXT_PUBLIC_URL is not defined in environment.');
  }

  const normalizedFilePath = normalizeFilePath(filePath);
  const response = await fetch(`${appUrl}/api/damageReport/admin/downloadFile?reportId=${reportId}&filePath=${normalizedFilePath}`, {
    method: 'GET',
  });

  // You can use response.blob() if you want to directly obtain the binary data for the report
  const blobData = await response.blob();

  const contentDisposition = response.headers.get("Content-Disposition");
  let fileName = '';
  
  if (contentDisposition) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) { 
      fileName = matches[1].replace(/['"]/g, '');
    }
  }

  if (!response.ok) {
    const responseJson = await response.json()
    throw new AppError(responseJson.status, responseJson.errors[0]);
  }

  const fileData = {
    name: fileName,
    fileBase64: await blobToBase64(blobData)
  }

  return fileData;
}

/** 
 * @param reportId The report which files you need to download.
 * @param folderPath Folder from which the files you want to download is from.
 * @returns An object with name and fileBase64
*/
export const requestDamageReportFolderDownload = async (
  reportId: string,
  folderPath: string
) => {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    throw new AppError(
      "INTERNAL_ERROR",
      "NEXT_PUBLIC_URL is not defined in enviroment."
    );
  }
  const normalizedFolderPath = normalizeFolderPath(folderPath);
  console.log(`Requesting download of ${normalizedFolderPath}`)

  const query = {
    reportId: reportId,
    folderPath: normalizedFolderPath,
  };

  const response = await fetch(
    `${appUrl}/api/damageReport/getFolderFileNames`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new AppError(responseJson.status, responseJson.errors[0]);
  }

  const fileNames = responseJson.data.fileNames as string[];
  const fileData: {
    name: string;
    fileBase64: string;
  }[] = []

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const filePath = normalizeFilePath(normalizedFolderPath+fileName)
    
    const normalizedFilePath = normalizeFilePath(filePath);
    const data = await requestDamageReportFileDownload(reportId, normalizedFilePath);
    fileData.push(data)
  }

  console.log(fileData.map(file => file.name))

  return fileData;
};
