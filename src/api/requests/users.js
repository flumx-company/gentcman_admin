import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";



export class UsersRequest extends ApiRequest {
    $endPoint = RequestEndPoint.UsersEndPoint;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;

    createAdmin(data, headers, config) {
        return super.create(
            data,
            headers,
            {
                endPoint: `${ RequestEndPoint.UsersEndPoint }/create-admin`,
                ...config
            }
        );
    }

    updateBonuses(id, data, headers, config) {
        return super.create(
            data,
            headers,
            {
                endPoint: `${ RequestEndPoint.UsersEndPoint }/${id}/manage-bonus-points`,
                ...config
            }
        );
    }

    updateAdmin(id, data, headers, config) {
        return super.patch(
            id,
            data,
            headers,
            {
                endPoint: `EMPTY`,
                ...config
            }
        );
    }

    addCouponsDataByUserId(id, data, headers, config) {
        return super.create(
            data,
            headers,
            {
                endPoint: `${ RequestEndPoint.UsersEndPoint }/${id}/manage-coupons`,
                ...config
            }
        );
    }

    deleteSelectedCouponsDataByUserId(id, ids, forceDelete, headers, config) {
        return super.deleteSelected(
            ids,
            forceDelete,
            headers,
            {
                endPoint: `${ RequestEndPoint.UsersEndPoint }/${id}/manage-coupons`,
                ...config
            }
        );
    }

    getCouponsDataByUserId(id, query, headers, config) {
        return super.getAll(
            query,
            headers,
            {
                endPoint: `${ RequestEndPoint.UsersEndPoint }/${id}/coupons`,
                ...config
            }
        );
    }
}
