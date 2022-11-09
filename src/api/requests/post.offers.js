
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class PostOffersRequest extends ApiRequest {
    $endPoint = RequestEndPoint.PostOffers;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

