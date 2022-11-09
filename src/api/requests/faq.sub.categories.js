import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class FaqSubCategoriesRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.FaqSubCategoriesEndPoint;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

