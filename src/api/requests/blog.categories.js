import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class BlogCategoriesRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.BlogCategoriesEndPoint;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}
