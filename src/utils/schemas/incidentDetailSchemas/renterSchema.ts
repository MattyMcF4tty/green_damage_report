export interface RenterSchema {
    customerId: string | null;
    reservationId: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    birthDate: string | null;
    gender: string | null;
    age: string | null;
    insurance: boolean | null;
}

export class Renter implements RenterSchema {
    customerId: string | null;
    reservationId: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    birthDate: string | null;
    gender: string | null;
    age: string | null;
    insurance: boolean | null;

    constructor(
        customerId: string | null, 
        reservationId: string | null,
        firstName: string | null,
        lastName: string | null,
        email: string | null,
        phoneNumber: string | null,
        birthDate: string | null,
        gender: string | null,
        age: string | null,
        insurance: boolean | null
    ) {
        this.customerId = customerId;
        this.reservationId = reservationId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.birthDate = birthDate;
        this.gender = gender;
        this.age = age;
        this.insurance = insurance;
    }

    updateFields(fields: Partial<Renter>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            customerId: this.customerId,
            reservationId: this.reservationId,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            birthDate: this.birthDate,
            gender: this.gender,
            age: this.age,
            insurance: this.insurance,
        }
    }
}
