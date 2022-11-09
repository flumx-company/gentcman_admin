import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class DevelopersRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.Developers;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}
