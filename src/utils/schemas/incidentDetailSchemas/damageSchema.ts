import { cryptoText, cryptoTextArray } from "@/utils/security/crypto";

export interface DamageSchema {
    position: string | null;
    description: string | null;
    images: string[];
}


export class Damage implements DamageSchema {
    position: string | null;
    description: string | null;
    images: string[];

    constructor(position: string | null, description: string | null, images: string[]) {
        this.position = position;
        this.description = description;
        this.images = images;
    }

    updateFields(fields: Partial<Damage>) {
        Object.assign(this, fields);
    }

    toPlainObject() {
        return {
            position: this.position,
            description: this.description,
            images: this.images,
        };
    }

    crypto(type: 'encrypt' | 'decrypt') {
        return {
            position: cryptoText(type, this.position),
            description: cryptoText(type, this.description),
            images: cryptoTextArray(type, this.images),
        };
    }
}