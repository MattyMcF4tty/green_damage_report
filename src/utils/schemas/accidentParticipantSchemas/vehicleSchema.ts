export interface VehicleSchema {
    name: string | null;
    phone: string | null;
    email: string | null;
    driversLicenseNumber: string | null;
    insurance: string | null;
    numberplate: string | null;
    model: string | null;
}

export class Vehicle implements VehicleSchema {
    name: string | null;
    phone: string | null;
    email: string | null;
    driversLicenseNumber: string | null;
    insurance: string | null;
    numberplate: string | null;
    model: string | null;

    constructor(
        name: string | null,
        phone: string | null,
        email: string | null,
        driversLicenseNumber: string | null,
        insurance: string | null,
        numberplate: string | null,
        model: string | null
    ) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.driversLicenseNumber = driversLicenseNumber;
        this.insurance = insurance;
        this.numberplate = numberplate;
        this.model = model;
    }

    updateFields(fields: Partial<Vehicle>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email,
            driversLicenseNumber: this.driversLicenseNumber,
            insurance: this.insurance,
            numberplate: this.numberplate,
            model: this.model,
        };
    }
}
