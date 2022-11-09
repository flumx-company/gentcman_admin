import * as requests from './requests';
import { loverCaseFirstLetter } from "../helpers/utils";

const $apiData = Object
    .keys(requests)
    .map((item) => ([
            loverCaseFirstLetter(item),
            new requests[item]()
        ])
    )
    .reduce((previousValue, currentValue) => ({
            ...previousValue,
            [currentValue[0]]: currentValue[1]
        }),
        {}
    );

export const $api = $apiData;
