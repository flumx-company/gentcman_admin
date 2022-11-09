import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class BannersRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.Banners;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

