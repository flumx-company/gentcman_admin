
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class FaqRequest extends ApiRequest {
    $endPoint = RequestEndPoint.Faq;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

