
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class DevelopmentIdeasRequest extends ApiRequest {
    $endPoint = RequestEndPoint.DevelopmentIdeas;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

