
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class IdeaImprovementsRequest extends ApiRequest {
    $endPoint = RequestEndPoint.IdeaImprovements;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

