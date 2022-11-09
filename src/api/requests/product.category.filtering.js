import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class ProductCategoryFilteringRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.ProductCategoryFilteringEndPoint;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}
