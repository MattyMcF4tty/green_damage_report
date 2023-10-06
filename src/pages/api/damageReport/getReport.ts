import { FireDatabase } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { getDamageReport } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";
import { getEnvVariable } from "@/utils/logic/misc";

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
    const { Authorization } = req.headers;
    let isAdmin = false;

    if (Authorization) {
        isAdmin = true;
    }


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

    const damageCol = getEnvVariable('NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION');
  

    const documentRef = doc(FireDatabase, `${damageCol}/${reportId}`);

    // Get report
    let damageReport;
    try {
        damageReport = await getDamageReport(reportId, false)
    } catch (error:any)  {
        console.error(`Error getting report with id: ${reportId}, ${error.code}`)
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }


    // Decrypt here
    const decryptedReport = damageReport;

    return res.status(200).json(new ApiResponse(
        "OK",
        [],
        [],
        decryptedReport
    ))
}