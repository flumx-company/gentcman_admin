export const UrlInterseptor = (request) => {
    request.url = `${request.baseURL}${request.url}`;

    return request
};
