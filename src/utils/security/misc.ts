import Cookies from "js-cookie"

export const getAuthToken = () => {
    const authToken = Cookies.get('AuthToken');

    return authToken;
}