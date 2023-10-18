import { patchCustomerDamageReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { getAge, isDateInRange } from "@/utils/logic/misc";
import { dateToWunder, wunderToDate } from "@/utils/logic/wunderfleetLogic/wunderUtils";
import { Renter } from "@/utils/schemas/incidentDetailSchemas/renterSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { encryptText } from "@/utils/security/crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const debug: string[] = [];

  try {
    // Check if method is correct
    if (req.method !== "POST") {
      return res
        .status(405)
        .json(
          new ApiResponse(
            "METHOD_NOT_ALLOWED",
            [],
            ["Method is not allowed"],
            {}
          )
        );
    }
    debug.push("Method verified");

    const wunderUrl = process.env.WUNDER_DOMAIN;
    const accessToken = process.env.WUNDER_ACCESS_TOKEN;
    const { numberplate, date, reportId } = req.body;

    try {
      if (!wunderUrl || typeof wunderUrl !== "string") {
        throw new Error("Incorrect Wunderfleet api url format");
      }
      debug.push("WunderUrl verified");

      if (!accessToken || typeof accessToken !== "string") {
        throw new Error("Incorrect accessToken format");
      }
      debug.push("AccessToken verified");

      if (!numberplate || typeof numberplate !== "string") {
        throw new Error("Incorrect numberplate format");
      }

      if (!numberplate || typeof numberplate !== "string") {
        throw new Error("Incorrect numberplate format");
      }
      
      debug.push("Numberplate verified");

      if (!date || typeof date !== "string") {
        throw new Error("Incorrect date");
      }
      debug.push("Date verified");
    } catch (error: any) {
      return res
        .status(400)
        .json(new ApiResponse("BAD_REQUEST", [], [error.message], {}));
    }

    const accidentDate = new Date(date);
    debug.push(`Accident date [Date]: ${accidentDate}`);
    debug.push(`Accident date [Wunder]: ${dateToWunder(accidentDate)}`);

    // Get information about vehicle
    const vehicleResponse = await fetch(wunderUrl + '/api/v2/vehicles/search', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `${accessToken}`,
      },
      body: JSON.stringify({
        licencePlate: {
          $eq: numberplate,
        },
      }),
    });
    const vehicleResponseData = await vehicleResponse.json();

    // Check if request returned not ok
    if (!vehicleResponse.ok) {
      //Logging actual error locally not to the client
      debug.push(`vehicleResponse returned ${vehicleResponse.status}`);
      console.error(
        "Error getting car using numberplate from Wunderfleet",
        vehicleResponseData
      );
      return res
        .status(500)
        .json(
          new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {})
        );
    }
    debug.push(`VehicleResponse returned ${vehicleResponse.status}`);

    const vehicleData = vehicleResponseData.data;

    if (!vehicleData) {
      debug.push("Car not found");
      return res
        .status(404)
        .json(new ApiResponse("NOT_FOUND", [], ["Car not found"], {}));
    }

    debug.push("Car found");
    const carId = vehicleData[0].vehicleId;
    debug.push(`CarId ${carId}`);

    //Get reservation that matches accidentDate.
    const reservationResponse = await fetch(
      wunderUrl + "/api/v2/reservations/search?per-page=1&sort=reservationId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${accessToken}`,
        },
        body: JSON.stringify({
          $and: [
            {
              carId: carId,
            },
            {
              endTime: {
                $gte: `${dateToWunder(accidentDate)}`,
              },
            },
          ],
        }),
      }
    );

    // Assign reservation to variable, can still be null if none exists
    const reservationResponseData = await reservationResponse.json();

    // If response is not okay, then we log error locally, not to the client.
    if (!reservationResponse.ok) {
      debug.push(`reservationResponse returned ${reservationResponse.status}`);
      console.error(
        "Error getting reservation from Wunderfleet",
        reservationResponseData
      );
      return res
        .status(500)
        .json(
          new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {})
        );
    }
    debug.push(`reservationResponse returned ${reservationResponse.status}`);
    let reservation = reservationResponseData.data;

    // If the response is ok then we check if reservation is null.
    if (!reservation) {
      debug.push(
        `No reservation ends after ${dateToWunder(accidentDate)} [Wunder]`
      );
      debug.push("Checking for active reservation");
      // If no reservation ends exists after given date, then its maybe an ongoing trip.
      // Therefore we get newest reservation, on carId.
      const activeReservationResponse = await fetch(
        wunderUrl +
          "/api/v2/reservations/search?per-page=1&sort=-reservationId",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `${accessToken}`,
          },
          body: JSON.stringify({
            carId: carId,
          }),
        }
      );

      if (!activeReservationResponse.ok) {
        debug.push(
          `activeReservationResponse returned ${activeReservationResponse.status}`
        );
        console.error(
          "Error getting newest reservation from Wunderfleet",
          reservationResponseData
        );
        return res
          .status(500)
          .json(
            new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {})
          );
      }
      const activeReservationResponseData =
        await activeReservationResponse.json();

      // We assign the new reservation as reservation.
      reservation = activeReservationResponseData.data;
    }

    // If no reservation exist on car, then we throw an error.
    // Else we check if the date is in range of current reservation start- and endTime.
    if (!reservation) {
      debug.push(`No reservation exist on carId ${carId}`);
      console.error(`No reservation found on carId: ${carId}`);
      return res
        .status(500)
        .json(
          new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {})
        );
    }
    debug.push(`ReservationId: ${reservation[0].reservationId}`);

    let endTime = wunderToDate(reservation[0].endTime);

    // We check if endTime is null, and therefore an ongoing trip.
    if (!endTime) {
      endTime = new Date();
    }
    debug.push(`Reservation endTime: ${endTime}`);

    // There should always be a startTime on a reservation.
    // But its wunder so we check to be safe.
    const startTime = wunderToDate(reservation[0].startTime);
    if (!startTime) {
      debug.push(`Reservation has no startTime: ${startTime}`);
      console.error(
        "Reservation does not have a startTime",
        reservationResponseData
      );
      return res
        .status(500)
        .json(
          new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {})
        );
    }
    debug.push(`Reservation startTime: ${startTime}`);

    // If date is not in range.
    // Then return error, that no reservation was ongoing at accidentDate.
    debug.push(
      `Checking if date is in range:\n${accidentDate}\n${startTime}\n${endTime}`
    );
    if (!isDateInRange(startTime, accidentDate, endTime)) {
      debug.push("Date is not in range");
      return res
        .status(404)
        .json(
          new ApiResponse(
            "NOT_FOUND",
            [],
            ["No reservations were ongoing at that point in time"],
            {}
          )
        );
    }
    debug.push("Date in range");

    // Get reservationId from reservation
    const reservationId = reservation[0].reservationId;

    // Get customerId from reservation
    const customerId = reservation[0].customerId;

    // Get customer information by customerId
    const renterResponse = await fetch(wunderUrl + "/api/v2/customers/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `${accessToken}`,
      },
      body: JSON.stringify({
        customerId: {
          $eq: customerId,
        },
      }),
    });
    const renterResponseData = await renterResponse.json();
    if (renterResponse.ok) {
      if (!renterResponseData.data) {
        return res
          .status(404)
          .json(
            new ApiResponse(
              "NOT_FOUND",
              [],
              ["No customers were found with customerId"],
              {}
            )
          );
      }
    } else {
      //Logging actual error locally not to the client
      console.error(
        "Error getting customer by customerId from Wunderfleet",
        renterResponseData
      );
      return res
        .status(500)
        .json(
          new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {})
        );
    }
    const renterData = renterResponseData.data[0];

    // Calculate age if we got a birthdate
    const renterBirthDate = wunderToDate(renterData.birthDate);
    let renterAge = null;
    if (renterBirthDate) {
      renterAge = getAge(renterBirthDate);
    }

    // Assigning age to renter
    let renterGender = "Unknown";
    if (renterData === 0) {
      renterGender = "Other";
    } else if (renterData === 1) {
      renterGender = "Male";
    } else if (renterData === 2) {
      renterGender === "Female";
    }

    const renterInfo = new Renter(
      customerId ? `${customerId}` : null,
      reservationId ? `${reservationId}` : null,
      renterData.firstName ? encryptText(`${renterData.firstName}`) : null,
      renterData.lastName ? encryptText(`${renterData.lastName}`) : null,
      renterData.email ? encryptText(`${renterData.email}`) : null,
      renterData.mobilePhone ? encryptText(`${renterData.mobilePhone}`) : null,
      renterData.birthDate ? encryptText(`${renterData.birthDate}`) : null,
      encryptText(renterGender),
      renterAge ? encryptText(`${renterAge}`) : null,
      null
    )

    // Collecting renter data in object
    try {
      await patchCustomerDamageReport(reportId, {renterInfo: renterInfo.toPlainObject()})
    } catch (error:any) {
      console.error(error);
      return res.status(500).json(new ApiResponse(
        'INTERNAL_ERROR',
        [],
        ['Something went wrong.'],
        {}
      ))
    }

    return res
      .status(200)
      .json(
        new ApiResponse("OK", ["Renter fetched succesfully"], [], {})
      );
  } catch (error: any) {
    console.error("Error at api/wunderfleet/getRenter.ts", error.message);
    return res
      .status(500)
      .json(new ApiResponse("SERVER_ERROR", [], ["Something went wrong"], {}));
  }
}
