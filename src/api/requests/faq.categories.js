import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class FaqCategoriesRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.FaqCategoriesEndPoint;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

