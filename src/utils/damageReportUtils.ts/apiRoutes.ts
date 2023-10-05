import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { reportDataType } from "../utils";

export const handleGetAllReports = async () => {

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

    const reportList = responseData.reports.map((reportsData:any) => {
        const reportData = new reportDataType();
        reportData.updateFields(reportsData.data)

        return {
            id: reportsData.id as string,
            data: reportData
        }
    })


    return reportList;
}

export const handleGetReport = async(reportId:string) => {

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

    const reportData = new reportDataType();
    reportData.updateFields(responseJson.data)


    return reportData;
}