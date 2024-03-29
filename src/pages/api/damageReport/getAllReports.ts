import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import { getFirestoreCollection } from "@/utils/logic/firebaseLogic/firestoreLogic/logic";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  //TODO: Make verify admin
  if (req.method !== "GET") {
    return res
      .status(405)
      .json(
        new ApiResponse("METHOD_NOT_ALLOWED", [], ["Method is not allowed"], {})
      );
  }

  const reportCol = process.env.NEXT_PUBLIC_DAMAGE_REPORT_FIRESTORE_COLLECTION;
  if (!reportCol) {
    console.error(
      "DAMAGE_REPORT_FIRESTORE_COLLECTION is not defined in enviroment"
    );
    return res
      .status(500)
      .json(new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {}));
  }

  let reportList;
  try {
    reportList = await getFirestoreCollection(reportCol);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {}));
  }

  if (reportList.empty) {
    return res
      .status(404)
      .json(new ApiResponse("NOT_FOUND", [], ["No documents found"], {}));
  }

  const reports = reportList.docs.map((doc) => {
    const docData = doc.data();
    const reportData = new AdminDamageReport();
    reportData.updateFields(docData);

    return {
      id: doc.id as string,
      data: reportData.crypto("decrypt"),
    };
  });
  console.log("222d2d2d", reports);

  return res
    .status(200)
    .json(
      new ApiResponse(
        "OK",
        ["Fetching all report ids finished succesfully"],
        [],
        { reports: reports }
      )
    );
}
