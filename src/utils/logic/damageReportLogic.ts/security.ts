import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { decryptText, encryptText } from "@/utils/security/crypto";

export const encryptReport = (reportData: CustomerDamageReport) => {
    const encryptedReport = new CustomerDamageReport();
    encryptedReport.updateFields(reportData.toPlainObject());

  // Renter is already encrypted by the highKey therefore no need here.
  // Encrypt driverInfo
  let driverInfo = encryptedReport.driverInfo;
  try {
    if (driverInfo.firstName) {
      driverInfo.firstName = encryptText(driverInfo.firstName);
    }
    if (driverInfo.lastName) {
      driverInfo.lastName = encryptText(driverInfo.lastName);
    }
    if (driverInfo.address) {
      driverInfo.address = encryptText(driverInfo.address);
    }
    if (driverInfo.socialSecurityNumber) {
      driverInfo.socialSecurityNumber = encryptText(
        driverInfo.socialSecurityNumber
      );
    }
    if (driverInfo.drivingLicenseNumber) {
      driverInfo.drivingLicenseNumber = encryptText(
        driverInfo.drivingLicenseNumber
      );
    }
    if (driverInfo.phoneNumber) {
      driverInfo.phoneNumber = encryptText(driverInfo.phoneNumber);
    }
    if (driverInfo.email) {
      driverInfo.email = encryptText(driverInfo.email);
    }
    encryptedReport.updateFields({ driverInfo: driverInfo });
  } catch (error: any) {
    throw error;
  }

  // Encrypt bikers
  let bikerInfo = encryptedReport.bikerInfo;
  try {
    if (bikerInfo.length > 0) {
      bikerInfo.map((biker, index) => {
        const newBiker = {
          name: biker.name ? encryptText(biker.name) : biker.name,
          phone: biker.phone ? encryptText(biker.phone) : biker.phone,
          email: biker.email ? encryptText(biker.email) : biker.email,
          ebike: biker.ebike,
          personDamage: biker.personDamage
            ? encryptText(biker.personDamage)
            : biker.personDamage,
        };
        bikerInfo[index] = newBiker;
      });
      encryptedReport.updateFields({ bikerInfo: bikerInfo });
    }
  } catch (error: any) {
    throw error;
  }

  // Decrypt vehicles
  let vehicleInfo = encryptedReport.vehicleInfo;
  try {
    if (vehicleInfo.length > 0) {
      vehicleInfo.map((vehicle, index) => {
        const encryptedVehicle = {
          name: vehicle.name ? encryptText(vehicle.name) : vehicle.name,
          phone: vehicle.phone ? encryptText(vehicle.phone) : vehicle.phone,
          email: vehicle.email ? encryptText(vehicle.email) : vehicle.email,
          driversLicenseNumber: vehicle.driversLicenseNumber
            ? encryptText(vehicle.driversLicenseNumber)
            : vehicle.driversLicenseNumber,
          insurance: vehicle.insurance
            ? encryptText(vehicle.insurance)
            : vehicle.insurance,
          numberplate: vehicle.numberplate
            ? encryptText(vehicle.numberplate)
            : vehicle.numberplate,
          model: vehicle.model ? encryptText(vehicle.model) : vehicle.model,
        };
        vehicleInfo[index] = encryptedVehicle;
      });
      encryptedReport.updateFields({ vehicleInfo: vehicleInfo });
    }
  } catch (error: any) {
    throw error;
  }

  // Decrypt pedestrians
  let pedestrianInfo = encryptedReport.pedestrianInfo;
  try {
    if (pedestrianInfo.length > 0) {
      pedestrianInfo.map((pedestrian, index) => {
        const encryptedPedestrian = {
          name: pedestrian.name
            ? encryptText(pedestrian.name)
            : pedestrian.name,
          phone: pedestrian.phone
            ? encryptText(pedestrian.phone)
            : pedestrian.phone,
          email: pedestrian.email
            ? encryptText(pedestrian.email)
            : pedestrian.email,
          personDamage: pedestrian.personDamage
            ? encryptText(pedestrian.personDamage)
            : pedestrian.personDamage,
        };
        pedestrianInfo[index] = encryptedPedestrian;
      });
      encryptedReport.updateFields({ pedestrianInfo: pedestrianInfo });
    }
  } catch (error: any) {
    throw error;
  }

  // Decrypt otherInfo
  let otherObjectInfo = encryptedReport.otherObjectInfo;
  try {
    if (otherObjectInfo.length > 0) {
      otherObjectInfo.map((otherInfo, index) => {
        const encryptedOtherInfo = {
          description: otherInfo.description
            ? encryptText(otherInfo.description)
            : otherInfo.description,
          information: otherInfo.information
            ? encryptText(otherInfo.information)
            : otherInfo.information,
        };
        otherObjectInfo[index] = encryptedOtherInfo;
      });
      encryptedReport.updateFields({ otherObjectInfo: otherObjectInfo });
    }
  } catch (error: any) {
    throw error;
  }

  // Encrypt witnesses
  let witnesses = encryptedReport.witnesses;
  try {
    if (witnesses.length > 0) {
      witnesses.map((witness, index) => {
        const newWitness = {
          name: witness.name ? encryptText(witness.name) : null,
          phone: witness.phone ? encryptText(witness.phone) : null,
          email: witness.email ? encryptText(witness.email) : null,
        };
        witnesses[index] = newWitness;
      });
      encryptedReport.updateFields({ witnesses: witnesses });
    }
  } catch (error: any) {
    throw error;
  }

  // Other individual variables
  try {
    encryptedReport.updateFields({
      userEmail: encryptedReport.userEmail
        ? encryptText(encryptedReport.userEmail)
        : encryptedReport.userEmail,
      userPhoneNumber: encryptedReport.userPhoneNumber
        ? encryptText(encryptedReport.userPhoneNumber)
        : encryptedReport.userPhoneNumber,
      policeReportNumber: encryptedReport.policeReportNumber
        ? encryptText(encryptedReport.policeReportNumber)
        : encryptedReport.userPhoneNumber,
    });
  } catch (error: any) {
    throw error;
  }

  return encryptedReport;
};

export const decryptReport = (
    reportData: CustomerDamageReport,
    authorized: boolean
  ) => {
    const decryptedReport = new CustomerDamageReport();
    decryptedReport.updateFields(reportData.toPlainObject());
  
    if (authorized) {
      // Here we decrypt all the info only available to admins.
      let renterInfo = decryptedReport.renterInfo;
  
      if (renterInfo.customerId) {
        renterInfo.customerId = decryptText(renterInfo.customerId);
      }
      if (renterInfo.reservationId) {
        renterInfo.reservationId = decryptText(renterInfo.reservationId);
      }
  
      // The name of the renter is not secret therefore is not highly encrypted
      if (renterInfo.email) {
        renterInfo.email = decryptText(renterInfo.email);
      }
      if (renterInfo.birthDate) {
        renterInfo.birthDate = decryptText(renterInfo.birthDate);
      }
      if (renterInfo.gender) {
        renterInfo.gender = decryptText(renterInfo.gender);
      }
      if (renterInfo.age) {
        renterInfo.age = decryptText(renterInfo.age);
      }
      decryptedReport.updateFields({ renterInfo: renterInfo });
    }
  
    // Everything else that need decrypting.
    let renterInfo = decryptedReport.renterInfo;
    try {
      if (renterInfo.firstName) {
        renterInfo.firstName = decryptText(renterInfo.firstName);
      }
      if (renterInfo.lastName) {
        renterInfo.lastName = decryptText(renterInfo.lastName);
      }
      decryptedReport.updateFields({ renterInfo: renterInfo });
    } catch (error: any) {
      throw error;
    }
  
    // Decrypt driverInfo
    let driverInfo = decryptedReport.driverInfo;
    try {
      if (driverInfo.firstName) {
        driverInfo.firstName = decryptText(driverInfo.firstName);
      }
      if (driverInfo.lastName) {
        driverInfo.lastName = decryptText(driverInfo.lastName);
      }
      if (driverInfo.address) {
        driverInfo.address = decryptText(driverInfo.address);
      }
      if (driverInfo.socialSecurityNumber) {
        driverInfo.socialSecurityNumber = decryptText(
          driverInfo.socialSecurityNumber
        );
      }
      if (driverInfo.drivingLicenseNumber) {
        driverInfo.drivingLicenseNumber = decryptText(
          driverInfo.drivingLicenseNumber
        );
      }
      if (driverInfo.phoneNumber) {
        driverInfo.phoneNumber = decryptText(driverInfo.phoneNumber);
      }
      if (driverInfo.email) {
        driverInfo.email = decryptText(driverInfo.email);
      }
      decryptedReport.updateFields({ driverInfo: driverInfo });
    } catch (error: any) {
      throw error;
    }
  
    // Decrypt witnesses
    let witnesses = decryptedReport.witnesses;
    try {
      if (witnesses.length > 0) {
        witnesses.map((witness, index) => {
          const newWitness = {
            name: witness.name ? decryptText(witness.name) : witness.name,
            phone: witness.phone ? decryptText(witness.phone) : witness.phone,
            email: witness.email ? decryptText(witness.email) : witness.email,
          };
          witnesses[index] = newWitness;
        });
        decryptedReport.updateFields({ witnesses: witnesses });
      }
    } catch (error: any) {
      throw error;
    }
  
    // Decrypt bikers
    let bikerInfo = decryptedReport.bikerInfo;
    try {
      if (bikerInfo.length > 0) {
        bikerInfo.map((biker, index) => {
          const newBiker = {
            name: biker.name ? decryptText(biker.name) : biker.name,
            phone: biker.phone ? decryptText(biker.phone) : biker.phone,
            email: biker.email ? decryptText(biker.email) : biker.email,
            ebike: biker.ebike,
            personDamage: biker.personDamage
              ? decryptText(biker.personDamage)
              : biker.personDamage,
          };
          bikerInfo[index] = newBiker;
        });
        decryptedReport.updateFields({ bikerInfo: bikerInfo });
      }
    } catch (error: any) {
      throw error;
    }
  
    // Decrypt vehicles
    let vehicleInfo = decryptedReport.vehicleInfo;
    try {
      if (vehicleInfo.length > 0) {
        vehicleInfo.map((vehicle, index) => {
          const decryptedVehicle = {
            name: vehicle.name ? decryptText(vehicle.name) : vehicle.name,
            phone: vehicle.phone ? decryptText(vehicle.phone) : vehicle.phone,
            email: vehicle.email ? decryptText(vehicle.email) : vehicle.email,
            driversLicenseNumber: vehicle.driversLicenseNumber
              ? decryptText(vehicle.driversLicenseNumber)
              : vehicle.driversLicenseNumber,
            insurance: vehicle.insurance
              ? decryptText(vehicle.insurance)
              : vehicle.insurance,
            numberplate: vehicle.numberplate
              ? decryptText(vehicle.numberplate)
              : vehicle.numberplate,
            model: vehicle.model ? decryptText(vehicle.model) : vehicle.model,
          };
          vehicleInfo[index] = decryptedVehicle;
        });
        decryptedReport.updateFields({ vehicleInfo: vehicleInfo });
      }
    } catch (error: any) {
      throw error;
    }
  
    // Decrypt pedestrians
    let pedestrianInfo = decryptedReport.pedestrianInfo;
    try {
      if (pedestrianInfo.length > 0) {
        pedestrianInfo.map((pedestrian, index) => {
          const decryptedPedestrian = {
            name: pedestrian.name
              ? decryptText(pedestrian.name)
              : pedestrian.name,
            phone: pedestrian.phone
              ? decryptText(pedestrian.phone)
              : pedestrian.phone,
            email: pedestrian.email
              ? decryptText(pedestrian.email)
              : pedestrian.email,
            personDamage: pedestrian.personDamage
              ? decryptText(pedestrian.personDamage)
              : pedestrian.personDamage,
          };
          pedestrianInfo[index] = decryptedPedestrian;
        });
        decryptedReport.updateFields({ pedestrianInfo: pedestrianInfo });
      }
    } catch (error: any) {
      throw error;
    }
  
    // Decrypt otherInfo
    let otherObjectInfo = decryptedReport.otherObjectInfo;
    try {
      if (otherObjectInfo.length > 0) {
        otherObjectInfo.map((otherInfo, index) => {
          const decryptedOtherInfo = {
            description: otherInfo.description
              ? decryptText(otherInfo.description)
              : otherInfo.description,
            information: otherInfo.information
              ? decryptText(otherInfo.information)
              : otherInfo.information,
          };
          otherObjectInfo[index] = decryptedOtherInfo;
        });
        decryptedReport.updateFields({ otherObjectInfo: otherObjectInfo });
      }
    } catch (error: any) {
      throw error;
    }
  
    // Other individual variables
    try {
      decryptedReport.updateFields({
        userPhoneNumber: decryptedReport.userPhoneNumber
          ? decryptText(decryptedReport.userPhoneNumber)
          : decryptedReport.userPhoneNumber,
        policeReportNumber: decryptedReport.policeReportNumber
          ? decryptText(decryptedReport.policeReportNumber)
          : decryptedReport.userPhoneNumber,
      });
    } catch (error: any) {
      throw error;
    }
  
    return decryptedReport;
  };
