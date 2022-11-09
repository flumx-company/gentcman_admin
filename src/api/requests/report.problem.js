
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class ReportProblemRequest extends ApiRequest {
    $endPoint = RequestEndPoint.ReportProblem;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

