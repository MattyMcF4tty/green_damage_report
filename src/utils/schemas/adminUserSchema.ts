export interface AdminUserSchema {
    uid: string,
    email: string,
}


export class AdminUser implements AdminUserSchema {
    uid: string;
    email: string;

    constructor(uid:string, email:string) {
        this.uid = uid;
        this.email = email;
    }
}