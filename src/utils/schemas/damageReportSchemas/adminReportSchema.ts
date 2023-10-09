import { decryptText, encryptText } from "@/utils/security/crypto";
import { Renter, RenterSchema } from "../incidentDetailSchemas/renterSchema";
import { CustomerDamageReport } from "./customerReportSchema";

export class AdminDamageReport extends CustomerDamageReport {

    renterInfo: RenterSchema

    constructor() {
        super();
        this.renterInfo = {
            customerId: null,
            reservationId: null,
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: null,
            birthDate: null,
            gender: null,
            age: null,
            insurance: null
        }
    }
    
    toPlainObject() {
        // Getting plain object from parent class
        const parentData = super.toPlainObject();

        // Adding additional property
        return {
            ...parentData,
            renterInfo: this.renterInfo
        };
    }

    crypto(type: 'decrypt' | 'encrypt') {
        //Encrypt / decrypt other data
        const parentData = super.crypto(type)

        const cryptoText = (text: string | null) => {
            if (!text) {
              return text
            }
      
            return type === 'encrypt' ? encryptText(text) : decryptText(text);
        }

        return {
            ...parentData,
            renterInfo: {
                customerId: this.renterInfo.customerId,
                reservationId: this.renterInfo.reservationId,
                firstName: cryptoText(this.renterInfo.firstName),
                lastName: cryptoText(this.renterInfo.lastName),
                email: cryptoText(this.renterInfo.email),
                phoneNumber: cryptoText(this.renterInfo.phoneNumber),
                birthDate: cryptoText(this.renterInfo.birthDate),
                gender: cryptoText(this.renterInfo.gender),
                age: cryptoText(this.renterInfo.age),
                insurance: this.renterInfo.insurance
            }
        }
    }
}