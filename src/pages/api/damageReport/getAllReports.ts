import { getFirestoreCollection } from "@/utils/firebaseUtils/firestoreUtils";
import { apiResponse } from "@/utils/types";
import { reportDataType } from "@/utils/utils";
import { collection, getDocs } from "firebase/firestore";
import { ListResult, listAll } from "firebase/storage";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req:NextApiRequest, res:NextApiResponse) {

    //TODO: Make verify admin
    if (req.method !== "GET") {
        return res.status(405).json(new apiResponse(
            "METHOD_NOT_ALLOWED",
            [],
            ["Method is not allowed"],
            {},
        ))
    }

    const reportCol = process.env.DAMAGE_REPORT_FIRESTORE_COLLECTION;
    if (!reportCol) {
        console.error('DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment')
        return res.status(500).json(new apiResponse(
            'SERVER_ERROR',
            [],
            ['Something went wrong'],
            {}
        ))
    }

    let reportList;
    try {
        reportList = await getFirestoreCollection(reportCol)
    } catch (error:any) {
        console.error(error)
        return res.status(500).json(new apiResponse(
            'SERVER_ERROR',
            [],
            ['Something went wrong'],
            {}
        ))
    }

    if (reportList.empty) {
        return res.status(404).json(new apiResponse(
            'NOT_FOUND',
            [],
            ['No documents found'],
            {}
        ))
    }

    const reports = reportList.docs.map((doc) => {
        const docData = doc.data();
        const reportData = new reportDataType();
        reportData.updateFields(docData);

        return {
            id: doc.id as string,
            data: reportData.toPlainObject()
        }
    })
    return res.status(200).json(new apiResponse(
        'OK',
        ['Fetching all report ids finished succesfully'],
        [],
        {reports: reports}
    ))
}