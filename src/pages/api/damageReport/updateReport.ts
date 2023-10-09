import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { updatePartialDamageReport } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";

export default async function (req: NextApiRequest, res: NextApiResponse) {

    // Check method
    if (req.method !== "POST") {
        return res.status(405).json(new ApiResponse(
            "METHOD_NOT_ALLOWED",
            [],
            ["Method is not allowed"],
            {},
        ))
    }    

    // Check for user errors
    const { reportData, reportId } = req.body;
    let report = new AdminDamageReport();
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
            throw new Error("reportData does not match CustomerDamageReport")
        }

    } catch (error:any) {
        return res.status(400).json(new ApiResponse(
            "BAD_REQUEST",
            [],
            [error.message],
            {}
        ))
    }

    const encryptedReport = report.crypto('encrypt')
    await updatePartialDamageReport(reportId, encryptedReport)

    return res.status(200).json(new ApiResponse(
        "OK",
        [],
        ["Report updated succesfully"],
        {}
    ))
}