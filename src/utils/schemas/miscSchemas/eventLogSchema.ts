import { cryptoText } from "@/utils/security/crypto";

export interface EventLogSchema {
    user: string | null;
    date: string | null;
    action: string | null;
    description: string | null;
}

export class EventLog implements EventLogSchema {
    user: string | null;
    date: string | null;
    action: string | null;
    description: string | null;

    constructor(user: string | null, date: string | null, action: string | null, description: string | null) {
        this.user = user;
        this.date = date;
        this.action = action;
        this.description = description;
    }

    toPlainObject(): EventLogSchema {
        return {
            user: this.user,
            date: this.date,
            action: this.action,
            description: this.description,
        };
    }

    crypto(type: 'encrypt' | 'decrypt'):EventLogSchema {
        return {
            user: cryptoText(type, this.user),
            date: cryptoText(type, this.date),
            action: cryptoText(type, this.action),
            description: cryptoText(type, this.description),
        }
    }
}