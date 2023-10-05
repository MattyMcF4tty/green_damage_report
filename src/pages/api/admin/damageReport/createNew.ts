import admin from "@/firebase/firebaseAdminConfig";
import { FireDatabase } from "@/firebase/firebaseConfig";
import { getCustomerFromCustomerId, getReservationFromReservationId } from "@/utils/serverUtils";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { generateId, getAge, wunderToDate, wunderToGender } from "@/utils/utils";
import { doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";

export default async function (req:NextApiRequest, res:NextApiResponse) {
    const method = req.method;
    const { phoneNumber, email, reservationId } = req.body;
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
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            throw new Error("Missing phone number")
        }
        if (!email || typeof email !== 'string') {
            throw new Error("Missing email")
        }
        if (!reservationId || typeof reservationId !== 'string') {
            throw new Error("Missing reservation id")
        }
    } catch ( error:any ) {
        return res.status(400).json(new ApiResponse(
            "BAD_REQUEST",
            [],
            [error.message],
            {}
        ))
    }


    // Verify that user has permission
    if (!authorization || typeof authorization !== 'string') {
        return res.status(401).json(new ApiResponse(
            "UNAUTHORIZED",
            [],
            ["Invalid authentication"],
            {}
        ))
    }

    let authCred;
    
    try {
        authCred = await admin.auth().verifyIdToken(authorization);
    } catch (error: any) {
        if (error.code === 'auth/id-token-expired') {
            // Handle token expired error
            return res.status(401).json(new ApiResponse(
                "TOKEN_EXPIRED",
                [],
                ["Token has expired"],
                {}
            ));
        } else if (error.code === 'auth/id-token-revoked') {
            // Handle token revoked error
            return res.status(401).json(new ApiResponse(
                "TOKEN_REVOKED",
                [],
                ["Token has been revoked"],
                {}
            ));
        } else if (error.code === 'auth/argument-error') {
            // Handle invalid argument error
            return res.status(400).json(new ApiResponse(
                "BAD_REQUEST",
                [],
                ["Invalid argument supplied"],
                {}
            ));
        } else {
            console.log("Error verifying users authentication", error);
            return res.status(500).json(new ApiResponse(
                "SERVER_ERROR",
                [],
                ["Something went wrong"],
                {}
            ));
        }
    }

    const damageReportColName = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
    const firebaseDatabase = FireDatabase;
    if (!damageReportColName || typeof damageReportColName !== 'string') {
        console.error("FIRESTORE_DAMAGEREPORT_COLLECTION is not defined in enviroment")
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }
    if (!firebaseDatabase) {
        console.error("FireDatabase is not initialized")
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }

    let reservation;
    try {
        reservation = await getReservationFromReservationId(reservationId);
    } catch ( error:any ) {
        console.error(error)
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }
    if (!reservation) {
        return res.status(404).json(new ApiResponse(
            "NOT_FOUND",
            [],
            ["Reservation not found"],
            {}
        ))
    }

    let renter;
    try {
        renter = await getCustomerFromCustomerId(reservation.customerId)
    } catch ( error:any ) {
        console.error(error)
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
            {}
        ))
    }
    if (!renter) {
        return res.status(404).json(new ApiResponse(
            "NOT_FOUND",
            [],
            ["Customer not found"],
            {}
        ))
    }

    // Calculate age if we got a birthdate
    const renterBirthDate = wunderToDate(renter.birthDate);
    let renterAge = null;
    if (renterBirthDate) {
       renterAge = getAge(renterBirthDate)
    }

    const newDamageReport = new CustomerDamageReport();
    const currentDate = new Date();
    newDamageReport.updateFields({
        userEmail: email, 
        userPhoneNumber: phoneNumber, 
        openedDate: currentDate.toString(),
        renterInfo: {
            customerId: reservation.customerId,
            reservationId: reservationId,
            firstName: renter.firstName,
            lastName: renter.lastName,
            birthDate: renter.birthDate,
            gender: wunderToGender(renter.gender),
            age: `${renterAge}`,
            insurance: null,
            email: null,
            phoneNumber: null,
        }
    });

    let reportId
    try {
        reportId = await generateId();
    } catch ( error:any ) {
        console.error("Something went wrong generating report for report", error.message)
        return res.status(500).json(new ApiResponse(
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
        return res.status(500).json(new ApiResponse(
            "SERVER_ERROR",
            [],
            ["Something went wrong"],
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