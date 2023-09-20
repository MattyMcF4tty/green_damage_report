export class apiResponse {
    status: string;
    messages: string[];
    errors: string[];
    data: {};
    debug: string[];

    constructor (status: string, messages: string[], errors: string[], data: {}, debug: string[]) {
        this.status = status;
        this.messages = messages;
        this.errors = errors;
        this.data = data;
        this.debug = debug;
    }
}
