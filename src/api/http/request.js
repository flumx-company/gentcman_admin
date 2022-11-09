import { $axios } from "../../plugins/axios";
import { requestDataPipe } from "../request.pipe/request.data.pipe";

export class ApiRequest {
    $endPoint = '';

    $defaultVersion = '';

    $defaultClient = '';

    $axios = $axios;


    $getDefault() {
        const defaultVersion = typeof this.$defaultVersion === 'string' ? this.$defaultVersion : '';

        const defaultClient = typeof this.$defaultClient === 'string' ? this.$defaultClient : '';

        const endPointDefault = typeof this.$endPoint === 'string' ? this.$endPoint : '';

        return {
            defaultVersion,
            defaultClient,
            endPointDefault
        }
    }

    $getRequestParamsFromString (param) {

        const point = param || '';

        const [ version, clientName, endPoint ] = typeof point === 'string' ? point.split(':') : [];

        const { defaultVersion, defaultClient, endPointDefault } = this.$getDefault();

        return {
            version: version || defaultVersion || '',
            clientName: clientName || defaultClient || '',
            endPoint: endPoint || endPointDefault || ''
        };
    }

    $getRequestParamsFromObject (param) {
        const { version, clientName, endPoint } = typeof param === 'object' ? param : {};

        const { defaultVersion, defaultClient, endPointDefault } = this.$getDefault();

        return {
            version: version || defaultVersion || '',
            clientName: clientName || defaultClient || '',
            endPoint: endPoint || endPointDefault || ''
        };
    }

    $getRequestParams(param) {
        return typeof param === 'object' && !!param
            ? this.$getRequestParamsFromObject(param)
            : this.$getRequestParamsFromString(param)
    }

    $createQuery = (objQuery) => Object
        .keys(objQuery)
        .map((key) => `${key}=${objQuery[key]}`)
        .join('&');

    $concatParams = (...elements) => elements.join('/');

    $createUrl(param, objQuery) {

        const endPointBeforeReformat = param
            && param.endPoint
            && typeof param.endPoint === 'string'
            && param.endPoint.includes('EMPTY');

        const {
            version,
            clientName,
            endPoint
        } = this.$getRequestParams(param);

        const queryData = this.$createQuery(typeof objQuery === 'object' ? objQuery : {});

        const query = queryData ? `?${queryData}` : '';

        const url = [
            version,
            clientName,
            (endPointBeforeReformat ? '' : endPoint)
        ]
            .filter((item => !!item))
            .join('/');

        return `${url}${query}`;
    }

    getAll(query, headers, config) {
        return this.$axios.get(
            this.$createUrl(config, query),
            headers
        ).then(requestDataPipe);
    }

    getOne(id, headers, config) {
        return this.$axios.get(
            this.$concatParams(
                this.$createUrl(config),
                id
            ),
            headers
        ).then(requestDataPipe);
    }

    create(data, headers, config) {
        return this.$axios.post(
            this.$createUrl(config),
            data,
            headers
        ).then(requestDataPipe);
    }

    update(id, data, headers, config) {
        return this.$axios.put(
            this.$concatParams(
                this.$createUrl(config),
                id
            ),
            data,
            headers
        ).then(requestDataPipe);
    }

    patch(id, data, headers, config) {
        return this.$axios.patch(
            this.$concatParams(
                this.$createUrl(config),
                id
            ),
            data,
            headers
        ).then(requestDataPipe);
    }


    delete(id, headers, config) {
        return this.$axios.delete(
            this.$concatParams(
                this.$createUrl(config),
                id
            ),
            headers
        ).then(requestDataPipe);
    }

    deleteSelected(ids = [], forceDelete = [], headers, config) {
        return this.$axios.delete(
            this.$concatParams(
                this.$createUrl(config),
            ),
            {
                ...headers,
                data: {
                    ids,
                    forceDelete
                }
            },
        ).then(requestDataPipe);
    }
}
