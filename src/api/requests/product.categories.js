import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";
import { requestDataPipe } from "../request.pipe/request.data.pipe";

export class ProductCategoriesRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.ProductCategoriesEndPoint;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;

    addFilterOptions(id, data, headers, config) {
        return this.$axios.post(
            this.$concatParams(
                this.$createUrl(config),
                id,
                'options'
            ),
            data,
            headers
        ).then(requestDataPipe);
    }
}
