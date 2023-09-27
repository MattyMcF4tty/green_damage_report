import admin from "@/firebase/firebaseAdminConfig";
import { FireDatabase } from "@/firebase/firebaseConfig";
import { getCustomerFromCustomerId, getReservationFromReservationId } from "@/utils/serverUtils";
import { apiResponse } from "@/utils/types";
import { generateId, getAge, reportDataType, wunderToDate, wunderToGender } from "@/utils/utils";
import { auth } from "firebase-admin";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req:NextApiRequest, res:NextApiResponse) {
    const method = req.method;
    const { email } = req.body;
    const { authorization } = req.headers;

    // Check request
    if (method !== "POST") {
        return res.status(405).json(new apiResponse(
            "METHOD_NOT_ALLOWED",
            [],
            ["Method is not allowed"],
            {},
        ))
    }

    // Check if required information is valid.
    try {
        if (!email || typeof email !== 'string') {
            throw new Error("Missing email")
        }
    } catch ( error:any ) {
        return res.status(400).json(new apiResponse(
            "BAD_REQUEST",
            [],
            [error.message],
            {}
        ))
    }


    const damageReportColName = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
    const firebaseDatabase = FireDatabase;
    if (!damageReportColName || typeof damageReportColName !== 'string') {
        console.error("FIRESTORE_DAMAGEREPORT_COLLECTION is not defined in enviroment")
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }
    if (!firebaseDatabase) {
        console.error("FireDatabase is not initialized")
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    const newDamageReport = new reportDataType();
    const currentDate = new Date();
    newDamageReport.updateFields({
        userEmail: email, 
        openedDate: currentDate.toString(),
    });

    let reportId
    try {
        reportId = await generateId();
    } catch ( error:any ) {
        console.error("Something went wrong generating report for report", error.message)
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ));
    }

    const reportRef = doc(FireDatabase, `${damageReportColName}/${reportId}`);

    try {
        await setDoc(reportRef, newDamageReport.toPlainObject())
    } catch ( error:any ) {
        console.error(
            "Something went wrong creating document with this data:", 
            {newDamageReport}, 
            "Error:", 
            error.message
        )
        return res.status(500).json(new apiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    return res.status(201).json(new apiResponse(
        "CREATED",
        ["Damage report has succesfully been created"],
        [],
        {reportId: reportId}
    ))
}