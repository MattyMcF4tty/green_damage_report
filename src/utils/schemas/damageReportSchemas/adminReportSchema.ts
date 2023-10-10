import { cryptoText, decryptText, encryptText } from "@/utils/security/crypto";
import { RenterSchema } from "../incidentDetailSchemas/renterSchema";
import { CustomerDamageReport } from "./customerReportSchema";
import { EventLog, EventLogSchema } from "../miscSchemas/eventLogSchema";

export class AdminDamageReport extends CustomerDamageReport {

    renterInfo: RenterSchema;
    eventLogs: EventLogSchema[];
    reportId: number | null;


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
        this.eventLogs = [];
        this.reportId = null;
    }
    
    updateFields(fields: Partial<AdminDamageReport>): void {
        Object.assign(this, fields);
    }

    toPlainObject() {
        // Getting plain object from parent class
        const parentData = super.toPlainObject();

        // Adding additional property
        return {
            ...parentData,
            renterInfo: this.renterInfo,
            eventLogs: this.eventLogs,
            reportId: this.reportId,
        };
    }

    crypto(type: 'decrypt' | 'encrypt') {
        //Encrypt / decrypt other data
        const parentData = super.crypto(type)

        return {
            ...parentData,
            renterInfo: {
                customerId: this.renterInfo.customerId,
                reservationId: this.renterInfo.reservationId,
                firstName: cryptoText(type, this.renterInfo.firstName),
                lastName: cryptoText(type, this.renterInfo.lastName),
                email: cryptoText(type, this.renterInfo.email),
                phoneNumber: cryptoText(type, this.renterInfo.phoneNumber),
                birthDate: cryptoText(type, this.renterInfo.birthDate),
                gender: cryptoText(type, this.renterInfo.gender),
                age: cryptoText(type, this.renterInfo.age),
                insurance: this.renterInfo.insurance
            },
            eventLogs: this.eventLogs.map((event) => {
                return new EventLog(event.user, event.date, event.action, event.description).crypto(type)
            }),
            reportId: this.reportId,
        }
    }

    addEvent(event: EventLog) {
        this.eventLogs.push(event.toPlainObject());
    }
}