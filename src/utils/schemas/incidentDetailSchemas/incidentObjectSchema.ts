import { cryptoText } from "@/utils/security/crypto";

export interface IncidentObjectSchema {
    description: string | null;
    information: string | null;
}

export class IncidentObject implements IncidentObjectSchema {
    description: string | null;
    information: string | null;

    constructor(
        description: string | null,
        information: string | null,
    ) {
        this.description = description;
        this.information = information;
    }

    updateFields(fields: Partial<IncidentObject>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            description: this.description,
            information: this.information,
        };
    }

    crypto(type: 'encrypt' | 'decrypt') {
        return {
            description: cryptoText(type, this.description),
            information: cryptoText(type, this.information),
        };
    }
}
