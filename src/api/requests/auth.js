import { RequestClientName, RequestVersions } from "../request.key/request.const";
import { ApiRequest } from "../http/request";
import { requestDataPipe } from "../request.pipe/request.data.pipe";

const signInConfig = {
    clientName: RequestClientName.Client,
    endPoint: 'sign-in'
};

const adminConfig = {
    endPoint: 'me'
};

export class AuthRequest extends ApiRequest {
    $endPoint = '';

    $defaultVersion = RequestVersions.V1;

    $defaultClient = RequestClientName.Admin;

    signIn(data, headers) {
        return this.$axios.post(
            this.$concatParams(
                this.$createUrl(signInConfig)
            ),
            data,
            headers
        ).then(requestDataPipe);
    }

    getAdmin(headers) {
        return this.$axios.get(
            this.$concatParams(
                this.$createUrl(adminConfig)
            ),
            headers
        ).then(requestDataPipe);
    }
}

