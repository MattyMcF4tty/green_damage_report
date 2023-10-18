import AppError from "@/utils/schemas/miscSchemas/errorSchema";

export const requestUserVerification = async () => {
    const appUrl = process.env.NEXT_PUBLIC_URL;
    if (!appUrl) {
      throw new AppError('INTERNAL_ERROR', 'NEXT_PUBLIC_URL is not defined in enviroment.')
    }

    const response = await fetch(`${appUrl}/api/firebase/authentication/verifySession`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const responseJson = await response.json();
    if (!response.ok) {
        throw new AppError(responseJson.status, responseJson.errors[0])
    }

    return responseJson.data.user as {uid: string, email: string}
}