
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class OrdersRequest extends ApiRequest {
    $endPoint = RequestEndPoint.Orders;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;
}

