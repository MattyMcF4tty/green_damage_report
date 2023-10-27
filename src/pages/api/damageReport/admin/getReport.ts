import { getDamageReport } from "@/utils/logic/damageReportLogic.ts/logic";
import { getSession, verifySessionToken } from "@/utils/logic/firebaseLogic/authenticationLogic/serverLogic";
import { AdminUser } from "@/utils/schemas/adminUserSchema";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req: NextApiRequest, res: NextApiResponse) {

    // Verify method
    if (!verifyMethod(req, 'GET')) {
      return res.status(405).json(new ApiResponse(
          'METHOD_NOT_ALLOWED',
          [],
          [`Api route only accepts GET and got ${req.method}.`],
          {}
      ))
  } 

  const Authorization = getSession(req);
  if (!Authorization) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          "UNAUTHORIZED",
          [],
          ["Missing authorization token."],
          {}
        )
      );
  } else if (typeof Authorization !== "string") {
    return res
      .status(400)
      .json(
        new ApiResponse(
          "BAD_REQUEST",
          [],
          ["Authorization token is not valid type."],
          {}
        )
      );
  }

  const { reportId } = req.query;
  if (!reportId || typeof reportId !== "string") {
    return res
      .status(400)
      .json(
        new ApiResponse(
          "BAD_REQUEST",
          [],
          ["Report is null or not a string."],
          {}
        )
      );
  }

  try {
    await verifySessionToken(Authorization);
  } catch (error: any) {
    if (error.name === "UNEXPECTED") {
      return res
        .status(500)
        .json(
          new ApiResponse("INTERNAL_ERROR", [], ["Something went wrong."], {})
        );
    } else if (error.name === "TOO_MANY_REQUESTS") {
      return res
        .status(429)
        .json(new ApiResponse(error.name, [], [error.message], {}));
    }

    return res
      .status(401)
      .json(new ApiResponse(error.name, [], [error.message], {}));
  }

  // Get report
  try { 
    const damageReport = new AdminDamageReport();
    damageReport.updateFields(await getDamageReport(reportId));

    return res
    .status(200)
    .json(
      new ApiResponse(
        "OK",
        [`Damage report ${reportId} fetched succesfully.`],
        [],
        damageReport.crypto("decrypt")
      )
    );
  } catch (error: any) {
    if (error.name === "NOT_FOUND") {
      return res
        .status(200)
        .json(new ApiResponse("OK", [`Report: ${reportId} not found`], [], {}));
    }

    console.error(`Error getting report with id: ${reportId}, ${error.code}`);
    return res
      .status(500)
      .json(new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {}));
  }
}
