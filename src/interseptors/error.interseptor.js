
import router, { LOGIN_PATH } from "../router";

export const ErrorInterseptor = (error) => {

    error = error.response;

    if (error.status === 401 || error.status === 403 || error.data.error.message === 'Unauthenticated.') {
        router.push(LOGIN_PATH);
        localStorage.removeItem('jwt')
    }


    return  Promise.reject(error)
};
