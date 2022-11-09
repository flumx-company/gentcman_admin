export const TokenInterseptor = (request) => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
        request.headers.Authorization = `Bearer ${jwt}`;
        request.headers.Accept = `application/json`
    }

    return request
};
