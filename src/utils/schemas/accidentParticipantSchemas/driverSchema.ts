export interface DriverSchema {
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    socialSecurityNumber: string | null;
    drivingLicenseNumber: string | null;
    phoneNumber: string | null;
    email: string | null;
    validDriversLicense: null | boolean;
}

export class Driver implements DriverSchema {
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    socialSecurityNumber: string | null;
    drivingLicenseNumber: string | null;
    phoneNumber: string | null;
    email: string | null;
    validDriversLicense: null | boolean;

    constructor(    firstName: string | null,
        lastName: string | null,
        address: string | null,
        socialSecurityNumber: string | null,
        drivingLicenseNumber: string | null,
        phoneNumber: string | null,
        email: string | null,
        validDriversLicense: null | boolean) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.address = address;
            this.socialSecurityNumber = socialSecurityNumber;
            this.drivingLicenseNumber = drivingLicenseNumber;
            this.phoneNumber = phoneNumber;
            this.email = email;
            this.validDriversLicense = validDriversLicense;
    }

    updateFields(fields: Partial<Driver>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            address: this.address,
            socialSecurityNumber: this.socialSecurityNumber,
            drivingLicenseNumber: this.drivingLicenseNumber,
            phoneNumber: this.phoneNumber,
            email: this.email,
            validDriversLicense: this.validDriversLicense,     
        };
    }
}