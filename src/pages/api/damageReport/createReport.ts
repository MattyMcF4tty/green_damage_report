import { createDamageReport } from "@/utils/logic/damageReportLogic.ts/damageReportHandling";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req:NextApiRequest, res:NextApiResponse) {
    const method = req.method;
    const { email } = req.body;
    const { authorization } = req.headers;

    // Check request
    if (method !== "POST") {
        return res.status(405).json(new ApiResponse(
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
        return res.status(400).json(new ApiResponse(
            "BAD_REQUEST",
            [],
            [error.message],
            {}
        ))
    }

    let reportId: string;
    try {
        reportId = await createDamageReport(email);
    } catch (error:any) {
        return res.status(500).json(new ApiResponse(
            error.name,
            [],
            [error.message],
            {}
        ))
    }

    return res.status(201).json(new ApiResponse(
        "CREATED",
        ["Damage report has succesfully been created"],
        [],
        {reportId: reportId}
    ))
}