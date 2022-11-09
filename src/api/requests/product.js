import { ApiRequestClient } from "../http/request.client";
import { RequestClientName, RequestEndPoint, RequestVersions } from "../request.key/request.const";

export class ProductsRequest extends ApiRequestClient {
    $endPoint = RequestEndPoint.ProductsEndPoint;

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;

    getAll(query, headers) {
        return super.getAll(
            query,
            headers,
            {
                endPoint: `${ RequestEndPoint.ProductsEndPoint }/admin`,
            }
        );
    }

    createProductDiscount(id, data, headers, config) {
        return super.create(
            data,
            headers,
            {
                endPoint: `${ RequestEndPoint.ProductsEndPoint }/${id}/discount`,
                ...config
            }
        );
    }

    createProductCategoryDiscount(id, data, headers, config) {
        return super.create(
            data,
            headers,
            {
                endPoint: `${ RequestEndPoint.ProductCategoriesEndPoint }/${id}/discount`,
                ...config
            }
        );
    }

    updateProductDiscount(id, data, headers, config) {
        return super.update(
            id,
            data,
            headers,
            {
                endPoint: RequestEndPoint.Discounts,
                ...config
            }
        );
    }

    deleteProductDiscount(id, data, headers, config) {
        return super.delete(
            id,
            headers,
            {
                endPoint: RequestEndPoint.Discounts,
                ...config
            }
        );
    }
}
