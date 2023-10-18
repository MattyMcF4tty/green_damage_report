export interface ApiResponseSchema {
    status: string;
    messages: string[];
    errors: string[];
    data: {};
}

export class ApiResponse implements ApiResponseSchema {
    status: string;
    messages: string[];
    errors: string[];
    data: {};

    constructor(status: string, messages: string[], errors:string[], data:{}) {
        this.status = status;
        this.messages = messages;
        this.errors = errors;
        this.data = data;
    }
}