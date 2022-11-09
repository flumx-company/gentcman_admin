
import { $api } from './../api';

const getUser = async () => {
    try {
        await $api.authRequest.getAdmin();
        return true;
    } catch (e) {
        console.warn("userData", e);
        return false;
    }
};

const checkIsUser = async (next) => {
    const result = await getUser();
    return !result && next(false);
};

const dataResolver = async objRequests => {
    const objData = {};
    const arrayRequests = Object.keys(objRequests).map((key, index) => {
        objData[index] = key;
        return typeof objRequests[key] === 'function'
            ? objRequests[key]()
            : Promise.resolve(null);
    });

    let result = [];
    try {
        result = await Promise.all(arrayRequests);
    } catch ( e ) {
        window.vue.$toast.error(e.data.error.message)
        console.error(e)
    }

    Object.keys(objData).forEach(i => {
        objData[objData[i]] = result[i];
        delete objData[i];
    });

    return objData;
};

export const resolver = (resolverCallback) => async (to, from, next) => {
    window.startSpinner();
    await checkIsUser(next);

    if (typeof resolverCallback !== 'function') {
        return;
    }

    const objRequests = resolverCallback(to, from);

    if (!objRequests) {
        return;
    }

    const result = await dataResolver(objRequests);

    Object
        .keys(result)
        .forEach((item) => to.meta[item] = result[item]);

    window.finishSpinner();
    next();
};
