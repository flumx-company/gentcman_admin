import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class ProductCategoryOptionsRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.ProductCategoryOptions;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;


}

