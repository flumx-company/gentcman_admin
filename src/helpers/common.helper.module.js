function dec2hex(dec) {
    return dec
        .toString(16)
        .padStart(2, '0');
}

function generateSimpleUUID() {
    return Math
        .random()
        .toString(36)
        .substr(2, 5);
}

function generateUUID(len) {
    try {
        if (!window.crypto) {
            return generateSimpleUUID();
        }

        const arr = new Uint8Array((len || 40) / 2);

        return Array
            .from(window.crypto.getRandomValues(arr), dec2hex)
            .join('');
    } catch ( e ) {
        return generateSimpleUUID();
    }
}

const getOnlyNumberFromString = (value) => {
    value = typeof value !== 'string' ? '' : value;

    return value
        .split('')
        .filter(item => !isNaN(parseInt(item)))
        .join('');
};


const randomInteger = (min, max) => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
};



export const CommonHelperModule = {
    getOnlyNumberFromString,
    generateUUID,
    randomInteger
};
