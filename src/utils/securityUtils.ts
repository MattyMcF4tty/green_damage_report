import { WitnessInformation } from "@/components/otherPartys/witnessList";
import { reportDataType } from "./utils";
import * as CryptoJS from 'crypto-js';

// ENCRYPTION
export const encryptText = (text: string, key:string) => {

    console.log(CryptoJS.AES.encrypt(JSON.stringify({text}), key).toString())
    return CryptoJS.AES.encrypt(JSON.stringify({text}), key).toString()
}

export const lowEncryptText = (text: string) => {
    const key = process.env.LOW_ENCRYPTION_KEY;
    if (!key) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = 'LOW_ENCRYPTION_KEY is not defined in enviroment';
        throw newError;
    }

    return encryptText(text, key);
}

export const highEncryptText = (text: string) => {
    const key = process.env.HIGH_ENCRYPTION_KEY;
    if (!key) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = 'HIGH_ENCRYPTION_KEY is not defined in enviroment';
        throw newError;
    }

    return encryptText(text, key);
}

export const encryptReport = (reportData: reportDataType) => {
    const encryptedReport = new reportDataType();
    encryptedReport.updateFields(reportData.toPlainObject());

    // Renter is already encrypted by the highKey therefore no need here.
    // Encrypt driverInfo
    let driverInfo = encryptedReport.driverInfo;
    try {
        if (driverInfo.firstName) {
            driverInfo.firstName = lowEncryptText(driverInfo.firstName)
        }
        if (driverInfo.lastName) {
            driverInfo.lastName = lowEncryptText(driverInfo.lastName)
        }
        if (driverInfo.address) {
            driverInfo.address = lowEncryptText(driverInfo.address)
        }
        if (driverInfo.socialSecurityNumber) {
            driverInfo.socialSecurityNumber = lowEncryptText(driverInfo.socialSecurityNumber)
        }
        if (driverInfo.drivingLicenseNumber) {
            driverInfo.drivingLicenseNumber = lowEncryptText(driverInfo.drivingLicenseNumber)
        }
        if (driverInfo.phoneNumber) {
            driverInfo.phoneNumber = lowEncryptText(driverInfo.phoneNumber)
        }
        if (driverInfo.email) {
            driverInfo.email = lowEncryptText(driverInfo.email)
        }
        encryptedReport.updateFields({driverInfo: driverInfo})
    } catch (error:any) {
        throw error;
    }

    // Encrypt bikers
    let bikerInfo = encryptedReport.bikerInfo;
    try {
        if (bikerInfo.length > 0) {
            bikerInfo.map((biker, index) => {
                const newBiker = {
                    name: biker.name ? lowEncryptText(biker.name) : biker.name,
                    phone: biker.phone ? lowEncryptText(biker.phone) : biker.phone,
                    email: biker.email ? lowEncryptText(biker.email) : biker.email,
                    ebike: biker.ebike,
                    personDamage: biker.personDamage ? lowEncryptText(biker.personDamage) : biker.personDamage,
                }
                bikerInfo[index] = newBiker;
            })
            encryptedReport.updateFields({bikerInfo: bikerInfo})
        }
    } catch (error:any) {
        throw error;
    }   

    // Decrypt vehicles
    let vehicleInfo = encryptedReport.vehicleInfo;
    try {
        if (vehicleInfo.length > 0) {
            vehicleInfo.map((vehicle, index) => {
                const encryptedVehicle = {
                    name: vehicle.name ? lowEncryptText(vehicle.name) : vehicle.name,
                    phone: vehicle.phone ? lowEncryptText(vehicle.phone) : vehicle.phone,
                    email: vehicle.email ? lowEncryptText(vehicle.email) : vehicle.email,
                    driversLicenseNumber: vehicle.driversLicenseNumber ? lowEncryptText(vehicle.driversLicenseNumber) : vehicle.driversLicenseNumber,
                    insurance: vehicle.insurance ? lowEncryptText(vehicle.insurance) : vehicle.insurance,
                    numberplate: vehicle.numberplate ? lowEncryptText(vehicle.numberplate) : vehicle.numberplate,
                    model: vehicle.model ? lowEncryptText(vehicle.model) : vehicle.model,
                }
                vehicleInfo[index] = encryptedVehicle;
            })
            encryptedReport.updateFields({vehicleInfo: vehicleInfo})
        }
    } catch (error:any) {
        throw error;
    }  
    
    // Decrypt pedestrians
    let pedestrianInfo = encryptedReport.pedestrianInfo;
    try {
        if (pedestrianInfo.length > 0) {
            pedestrianInfo.map((pedestrian, index) => {
                const encryptedPedestrian = {
                    name: pedestrian.name ? lowEncryptText(pedestrian.name) : pedestrian.name,
                    phone: pedestrian.phone ? lowEncryptText(pedestrian.phone) : pedestrian.phone,
                    email: pedestrian.email ? lowEncryptText(pedestrian.email) : pedestrian.email,
                    personDamage: pedestrian.personDamage ? lowEncryptText(pedestrian.personDamage) : pedestrian.personDamage,
                }
                pedestrianInfo[index] = encryptedPedestrian;
            })
            encryptedReport.updateFields({pedestrianInfo: pedestrianInfo})
        }
    } catch (error:any) {
        throw error;
    }  

    // Decrypt otherInfo
    let otherObjectInfo = encryptedReport.otherObjectInfo;
    try {
        if (otherObjectInfo.length > 0) {
            otherObjectInfo.map((otherInfo, index) => {
                const encryptedOtherInfo = {
                    description: otherInfo.description ? lowEncryptText(otherInfo.description) : otherInfo.description,
                    information: otherInfo.information ? lowEncryptText(otherInfo.information) : otherInfo.information,
                }
                otherObjectInfo[index] = encryptedOtherInfo;
            })
            encryptedReport.updateFields({otherObjectInfo: otherObjectInfo})
        }
    } catch (error:any) {
        throw error;
    }  
    

    // Encrypt witnesses
    let witnesses = encryptedReport.witnesses;
    try {
        if (witnesses. length > 0) {
            witnesses.map((witness, index) => {
                const newWitness = {
                    name: witness.name ? lowEncryptText(witness.name) : null,
                    phone: witness.phone ? lowEncryptText(witness.phone) : null,
                    email: witness.email ? lowEncryptText(witness.email) : null
                }
                witnesses[index] = newWitness;
            })
            encryptedReport.updateFields({witnesses: witnesses})
        }
    } catch (error:any) {
        throw error;
    }  

    // Other individual variables
    try {
        encryptedReport.updateFields({
            userEmail: encryptedReport.userEmail ? lowEncryptText(encryptedReport.userEmail) : encryptedReport.userEmail,
            userPhoneNumber: encryptedReport.userPhoneNumber ? lowEncryptText(encryptedReport.userPhoneNumber) : encryptedReport.userPhoneNumber,
            policeReportNumber: encryptedReport.policeReportNumber ? lowEncryptText(encryptedReport.policeReportNumber) : encryptedReport.userPhoneNumber,
        })
    } catch (error:any) {
        throw error;
    }

    return encryptedReport;
}


// DECRYPTION
export const decryptText = (text: string, key:string) => {
    return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
}

export const lowDecryptText = (text: string) => {
    const key = process.env.LOW_ENCRYPTION_KEY;
    if (!key) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = 'LOW_ENCRYPTION_KEY is not defined in enviroment';
        throw newError;
    }

    return decryptText(text, key);
}

export const highDecryptText = (text: string) => {
    const key = process.env.HIGH_ENCRYPTION_KEY;
    if (!key) {
        let newError = new Error;
        newError.name = "SERVER_ERROR";
        newError.message = 'HIGH_ENCRYPTION_KEY is not defined in enviroment';
        throw newError;
    }

    return decryptText(text, key);
}

export const decryptReport = (reportData: reportDataType, authorized: boolean) => {
    const decryptedReport = new reportDataType();
    decryptedReport.updateFields(reportData.toPlainObject());

    if (authorized) {
        // Here we decrypt all the info only available to admins.
        let renterInfo = decryptedReport.renterInfo;

        if (renterInfo.customerId) {
            renterInfo.customerId = highDecryptText(renterInfo.customerId)
        }
        if (renterInfo.reservationId) {
            renterInfo.reservationId = highDecryptText(renterInfo.reservationId)
        }

        // The name of the renter is not secret therefore is not highly encrypted
        if (renterInfo.email) {
            renterInfo.email = highDecryptText(renterInfo.email)
        }
        if (renterInfo.birthDate) {
            renterInfo.birthDate = highDecryptText(renterInfo.birthDate)
        }
        if (renterInfo.gender) {
            renterInfo.gender = highDecryptText(renterInfo.gender)
        }
        if (renterInfo.age) {
            renterInfo.age = highDecryptText(renterInfo.age)
        }
        decryptedReport.updateFields({renterInfo: renterInfo})
    }

    // Everything else that need decrypting.
    let renterInfo = decryptedReport.renterInfo;
    try {
        if (renterInfo.firstName) {
            renterInfo.firstName = lowDecryptText(renterInfo.firstName)
        }
        if (renterInfo.lastName) {
            renterInfo.lastName = lowDecryptText(renterInfo.lastName)
        }
        decryptedReport.updateFields({renterInfo: renterInfo})
    } catch (error:any) {
        throw error;
    }

    // Decrypt driverInfo
    let driverInfo = decryptedReport.driverInfo;
    try {
        if (driverInfo.firstName) {
            driverInfo.firstName = lowDecryptText(driverInfo.firstName)
        }
        if (driverInfo.lastName) {
            driverInfo.lastName = lowDecryptText(driverInfo.lastName)
        }
        if (driverInfo.address) {
            driverInfo.address = lowDecryptText(driverInfo.address)
        }
        if (driverInfo.socialSecurityNumber) {
            driverInfo.socialSecurityNumber = lowDecryptText(driverInfo.socialSecurityNumber)
        }
        if (driverInfo.drivingLicenseNumber) {
            driverInfo.drivingLicenseNumber = lowDecryptText(driverInfo.drivingLicenseNumber)
        }
        if (driverInfo.phoneNumber) {
            driverInfo.phoneNumber = lowDecryptText(driverInfo.phoneNumber)
        }
        if (driverInfo.email) {
            driverInfo.email = lowDecryptText(driverInfo.email)
        }
        decryptedReport.updateFields({driverInfo: driverInfo})
    } catch (error:any) {
        throw error;
    }

    // Decrypt witnesses
    let witnesses = decryptedReport.witnesses;
    try {
        if (witnesses. length > 0) {
            witnesses.map((witness, index) => {
                const newWitness = {
                    name: witness.name ? lowDecryptText(witness.name) : witness.name,
                    phone: witness.phone ? lowDecryptText(witness.phone) : witness.phone,
                    email: witness.email ? lowDecryptText(witness.email) : witness.email
                }
                witnesses[index] = newWitness;
            })
            decryptedReport.updateFields({witnesses: witnesses})
        }
    } catch (error:any) {
        throw error;
    }    

    // Decrypt bikers
    let bikerInfo = decryptedReport.bikerInfo;
    try {
        if (bikerInfo.length > 0) {
            bikerInfo.map((biker, index) => {
                const newBiker = {
                    name: biker.name ? lowDecryptText(biker.name) : biker.name,
                    phone: biker.phone ? lowDecryptText(biker.phone) : biker.phone,
                    email: biker.email ? lowDecryptText(biker.email) : biker.email,
                    ebike: biker.ebike,
                    personDamage: biker.personDamage ? lowDecryptText(biker.personDamage) : biker.personDamage,
                }
                bikerInfo[index] = newBiker;
            })
            decryptedReport.updateFields({bikerInfo: bikerInfo})
        }
    } catch (error:any) {
        throw error;
    }   

    // Decrypt vehicles
    let vehicleInfo = decryptedReport.vehicleInfo;
    try {
        if (vehicleInfo.length > 0) {
            vehicleInfo.map((vehicle, index) => {
                const decryptedVehicle = {
                    name: vehicle.name ? lowDecryptText(vehicle.name) : vehicle.name,
                    phone: vehicle.phone ? lowDecryptText(vehicle.phone) : vehicle.phone,
                    email: vehicle.email ? lowDecryptText(vehicle.email) : vehicle.email,
                    driversLicenseNumber: vehicle.driversLicenseNumber ? lowDecryptText(vehicle.driversLicenseNumber) : vehicle.driversLicenseNumber,
                    insurance: vehicle.insurance ? lowDecryptText(vehicle.insurance) : vehicle.insurance,
                    numberplate: vehicle.numberplate ? lowDecryptText(vehicle.numberplate) : vehicle.numberplate,
                    model: vehicle.model ? lowDecryptText(vehicle.model) : vehicle.model,
                }
                vehicleInfo[index] = decryptedVehicle;
            })
            decryptedReport.updateFields({vehicleInfo: vehicleInfo})
        }
    } catch (error:any) {
        throw error;
    }   

    // Decrypt pedestrians
    let pedestrianInfo = decryptedReport.pedestrianInfo;
    try {
        if (pedestrianInfo.length > 0) {
            pedestrianInfo.map((pedestrian, index) => {
                const decryptedPedestrian = {
                    name: pedestrian.name ? lowDecryptText(pedestrian.name) : pedestrian.name,
                    phone: pedestrian.phone ? lowDecryptText(pedestrian.phone) : pedestrian.phone,
                    email: pedestrian.email ? lowDecryptText(pedestrian.email) : pedestrian.email,
                    personDamage: pedestrian.personDamage ? lowDecryptText(pedestrian.personDamage) : pedestrian.personDamage,
                }
                pedestrianInfo[index] = decryptedPedestrian;
            })
            decryptedReport.updateFields({pedestrianInfo: pedestrianInfo})
        }
    } catch (error:any) {
        throw error;
    }   

    // Decrypt otherInfo
    let otherObjectInfo = decryptedReport.otherObjectInfo;
    try {
        if (otherObjectInfo.length > 0) {
            otherObjectInfo.map((otherInfo, index) => {
                const decryptedOtherInfo = {
                    description: otherInfo.description ? lowDecryptText(otherInfo.description) : otherInfo.description,
                    information: otherInfo.information ? lowDecryptText(otherInfo.information) : otherInfo.information,
                }
                otherObjectInfo[index] = decryptedOtherInfo;
            })
            decryptedReport.updateFields({otherObjectInfo: otherObjectInfo})
        }
    } catch (error:any) {
        throw error;
    }  

    // Other individual variables
    try {
        decryptedReport.updateFields({
            userEmail: decryptedReport.userEmail ? lowDecryptText(decryptedReport.userEmail) : decryptedReport.userEmail,
            userPhoneNumber: decryptedReport.userPhoneNumber ? lowDecryptText(decryptedReport.userPhoneNumber) : decryptedReport.userPhoneNumber,
            policeReportNumber: decryptedReport.policeReportNumber ? lowDecryptText(decryptedReport.policeReportNumber) : decryptedReport.userPhoneNumber,
        })
    } catch (error:any) {
        throw error;
    }

    return decryptedReport
}