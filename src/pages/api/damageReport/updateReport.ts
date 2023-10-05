import { updateReportDoc } from "@/utils/firebaseUtils/firestoreUtils";
import { apiResponse } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { reportDataType } from "@/utils/schemas/damageReportSchemas";


export default async function (req: NextApiRequest, res: NextApiResponse) {

    // Check method
    if (req.method !== "POST") {
        return res.status(405).json(new apiResponse(
            "METHOD_NOT_ALLOWED",
            [],
            ["Method is not allowed"],
            {},
        ))
    }    

    // Check for user errors
    const { reportData, reportId } = req.body;
    let report = new reportDataType();
    try {
        if (!reportData) {
            throw new Error("reportData is null")
        }
        if (!reportId || typeof reportId !== 'string') {
            throw new Error("ReportId is not correct type string")
        }

        try {
            report.updateFields(reportData);
        } catch (error:any) {
            throw new Error("reportData does not math reportDataType")
        }

    } catch (error:any) {
        return res.status(400).json(new apiResponse(
            "BAD_REQUEST",
            [],
            [error.message],
            {}
        ))
    }

    await updateReportDoc(reportId, report)

    return res.status(200).json(new apiResponse(
        "OK",
        [],
        ["Report updated succesfully"],
        {}
    ))
}