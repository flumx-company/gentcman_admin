import { ApiRequest } from "./request";
import { RequestClientName } from "../request.key/request.const";

export class ApiRequestClient extends ApiRequest {
    getAll(query, headers, config) {
        return super.getAll(
            query,
            headers,
            {
                clientName: RequestClientName.Client,
                ...config
            }
        );
    }


    getOne(id, headers, config) {
        return super.getOne(
            id,
            headers,
            {
                clientName: RequestClientName.Client,
                ...config
            }
        );
    }
}


