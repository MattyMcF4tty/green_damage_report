import AppError from "../schemas/miscSchemas/errorSchema";

export const getEnvVariable = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new AppError('INTERNAL_ERROR', `${key} is not defined in environment.`);
    }
    return value;
};
