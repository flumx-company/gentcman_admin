import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";


export class NotificationsRequest extends ApiRequest {
    $endPoint = RequestEndPoint.Notifications;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;

    readAll(config) {
        return super.getAll(
            {},
            {},
            {
                endPoint:`${RequestEndPoint.Notifications }/mark/markAllNotifications`,
                ...config
            }
        )
    }
}
