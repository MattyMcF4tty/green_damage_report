import AppError from "@/utils/schemas/miscSchemas/errorSchema";
import { CustomerDamageReport } from "../../schemas/damageReportSchemas/customerReportSchema";
import { getAuthToken } from "@/utils/security/misc";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";

export const fetchAllDamageReports = async () => {

    const url = process.env.NEXT_PUBLIC_URL;
    if (!url) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = "NEXT_PUBLIC_URL is not defined in enviroment"
        throw newError;
    }

    const response = await fetch(url + '/api/damageReport/getAllReports', {
        method: "GET",
    })

    const responseJson = await response.json();
    if (!response.ok) {
        let newError = new Error;
        newError.name = responseJson.status;
        newError.message = responseJson.errors[0];
        throw newError
    }

    console.log(responseJson.data)

    const responseData = responseJson.data;

    const reportList = responseData.reports.map((report:any) => {
        const reportData = new CustomerDamageReport();
        reportData.updateFields(report.data)

        return {
            id: report.id as string,
            data: reportData
        }
    })


    return reportList;
}

export const fetchDamageReport = async(reportId:string) => {

    const data = {
        reportId: reportId
    }

    const url = process.env.NEXT_PUBLIC_URL;
    if (!url) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = "NEXT_PUBLIC_URL is not defined in enviroment"
        throw newError;
    }

    const response = await fetch(url + '/api/damageReport/getReport', {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        'Authorization': 'Hejas'
        },
        body: JSON.stringify(data)
    })

    const responseJson = await response.json();
    if (!response.ok) {
        let newError = new Error;
        newError.name = responseJson.status;
        newError.message = responseJson.errors[0];
        throw newError;
    }

    const reportData = new CustomerDamageReport();
    reportData.updateFields(responseJson.data)


    return reportData;
}

export const requestDamageReportCreation = async (email: string) => {
    const data = {
      email: email,
    };
  
    const url = process.env.NEXT_PUBLIC_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_URL is not defined in enviroment");
    }
  
    const response = await fetch(
      url + "/api/damageReport/createReport",
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
  

export const serverUpdateReport = async (reportId:string, reportData:CustomerDamageReport,) => {
  const data = {
    reportData: reportData.toPlainObject(), 
    reportId: reportId
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + "/api/damageReport/updateReport",
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

  return true;
}


export const getAdminDamageReport = async (reportId: string) => {
  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    console.error('NEXT_PUBLIC_URL is not defined in enviroment')
    throw new AppError('INTERNAL_ERROR', 'Something went wrong.')
  }
  const authorization = getAuthToken();
  if (!authorization) {
    throw new AppError('UNAUTHORIZED', 'No auth token available.')
  }

  const response = await fetch(`${url}/api/damageReport/admin?reportId=${reportId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorization
    }
  })

  const responseJson = await response.json();
  if (!response.ok) {
    throw new AppError(responseJson.status, responseJson.errors[0]);
  };

  const adminDamageReport = new AdminDamageReport();
  adminDamageReport.updateFields(responseJson.data)

  return adminDamageReport;
}