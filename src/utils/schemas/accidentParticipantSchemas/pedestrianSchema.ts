export interface PedestrianSchema {
    name: string | null;
    phone: string | null;
    email: string | null;
    personDamage: string | null;
}

export class Pedestrian implements PedestrianSchema {
    name: string | null;
    phone: string | null;
    email: string | null;
    personDamage: string | null;

    constructor(
        name: string | null,
        phone: string | null,
        email: string | null,
        personDamage: string | null,
    ) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.personDamage = personDamage;
    }

    updateFields(fields: Partial<Pedestrian>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email,
            personDamage: this.personDamage,            
        };
    }
}

