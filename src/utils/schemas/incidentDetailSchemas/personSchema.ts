export default class Person {
    name: string | null;
    phone: string | null;
    email: string | null;

    constructor(
        name: string | null,
        phone: string | null,
        email: string | null,
    ) {
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    updateFields(fields: Partial<Person>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email,
        };
    }
}
