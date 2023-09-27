import { FireDatabase } from "@/firebase/firebaseConfig";
import { apiResponse } from "@/utils/types";
import { reportDataType } from "@/utils/utils";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req: NextApiRequest, res: NextApiResponse) {

        // Check request
    if (req.method !== "POST") {
        return res.status(405).json(new apiResponse(
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
        return res.status(400).json(new apiResponse(
            "BAD_REQUEST",
            [],
            [error.message],
            {}
        ))
    }

    const damageCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
    if (!damageCol || typeof damageCol !== 'string') {
        console.error("DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment")
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    const database = FireDatabase;
    if (!database) {
        console.error("FireDatabase is not initialized");
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    const documentRef = doc(database, `${damageCol}/${reportId}`);

    // Get report
    let document;
    try {
        document = await getDoc(documentRef)
    } catch ( error:any)  {
        console.error(`Error getting report with id: ${reportId}, ${error.code}`)
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    // Check if report exists
    if (!document.exists()) {
        return res.status(404).json(new apiResponse(
            "NOT_FOUND",
            [],
            ["Report not found"],
            {}
        ))
    }

    const documentData = document.data();

    if (!documentData) {
        return res.status(404).json(new apiResponse(
            "NOT_FOUND",
            [],
            ["Report data not found"],
            {}
        ))
    }

    const report = new reportDataType();
    report.updateFields(documentData);

    const reportObject = report.toPlainObject();
    // Decrypt here
    

    return res.status(200).json(new apiResponse(
        "OK",
        [],
        [],
        reportObject
    ))
}