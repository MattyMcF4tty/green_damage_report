import { createReportDoc } from "@/utils/firebaseUtils/firestoreUtils";
import { apiResponse } from "@/utils/types";

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

    console.log("Creating new report")
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

    let reportId: string;
    try {
        reportId = await createReportDoc(email);
    } catch (error:any) {
        return res.status(500).json(new apiResponse(
            error.name,
            [],
            [error.message],
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