export interface BikerSchema {
    name: string | null;
    phone: string | null;
    email: string | null;
    ebike: boolean | null;
    personDamage: string | null;
}

export class Biker {
    name: string | null;
    phone: string | null;
    email: string | null;
    ebike: boolean | null;
    personDamage: string | null;

    constructor(
        name: string | null,
        phone: string | null,
        email: string | null,
        ebike: boolean | null,
        personDamage: string | null
    ) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.ebike = ebike;
        this.personDamage = personDamage;
    }

    updateFields(fields: Partial<Biker>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email,
            ebike: this.ebike,
            personDamage: this.personDamage,
        };
    }
}
