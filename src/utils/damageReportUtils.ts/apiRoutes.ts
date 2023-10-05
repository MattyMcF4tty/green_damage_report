import { CustomerDamageReport } from "../schemas/damageReportSchemas/customerReportSchema";

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

    const reportData = new CustomerDamageReport();
    reportData.updateFields(responseJson.data)


    return reportData;
}

export const handleDeleteReport = async (id:string) => {

}