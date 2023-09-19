export class apiResponse {
    status: string;
    messages: string[];
    errors: string[];
    data: {};

    constructor (status: string, messages: string[], errors: string[], data: {}) {
        this.status = status;
        this.messages = messages;
        this.errors = errors;
        this.data = data;
    }
}
