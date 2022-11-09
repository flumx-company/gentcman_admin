import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class ProductStatusesRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.ProductStatusesEndPoint;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}
