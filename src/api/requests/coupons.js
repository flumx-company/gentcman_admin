import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { requestDataPipe } from "../request.pipe/request.data.pipe";

export class CouponsRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.Coupons;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;

    hightDeleteCoupons(ids, headers, config) {
        return super.deleteSelected(
            ids,
            headers,
            {
                endPoint: `${RequestEndPoint.Coupons}/soft-delete/permanent-delete`,
                ...config
            }
        );
    }
    restoreCoupons(id, headers, config) {
        return this.$axios.post(
            this.$concatParams(
                this.$createUrl({
                    endPoint: `${RequestEndPoint.Coupons}/restore/${id}`,
                    ...config
                }),
            ),
            headers
        ).then(requestDataPipe);
    }
}

