export default class AppError extends Error{
    constructor(name: string, message: string) {
        super(message);
        this.name = name;
    }
}
