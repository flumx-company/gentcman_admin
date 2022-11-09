
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class TemplateMessagesRequest extends ApiRequest {
    $endPoint = RequestEndPoint.TemplateMessages;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

