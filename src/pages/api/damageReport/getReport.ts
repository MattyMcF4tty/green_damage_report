import { FireDatabase } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { getEnvVariable } from "@/utils/logic/misc";
import { getCustomerDamageReport } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";

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

    const { reportId } = req.body;

    try {
        if (!reportId || typeof reportId !== 'string') {
            throw new Error("Missing id")
        }
    } catch ( error:any ) {
        return res.status(400).json(new ApiResponse(
            "BAD_REQUEST",
            [],
            [error.message],
            {}
        ))
    }
  
    // Get report
    let damageReport;
    try {
        damageReport = await getCustomerDamageReport(reportId)
    } catch (error:any)  {
        if (error.name === 'NOT_FOUND') {
            return res.status(204).json(new ApiResponse(
                'OK',
                ['Report not found'],
                [],
                {}
            ))
        }

        console.error(`Error getting report with id: ${reportId}, ${error.code}`)
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    return res.status(200).json(new ApiResponse(
        "OK",
        [],
        [],
        damageReport.crypto('decrypt')
    ))
}