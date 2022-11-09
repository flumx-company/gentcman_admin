import { CommonHelperModule } from "./common.helper.module";


const { getOnlyNumberFromString } = CommonHelperModule;

const createMask = (mask, value) => {

    value = typeof value !== 'string' ? '' : value;

    if(!mask) {
        return value;
    }

    const array = getOnlyNumberFromString(value).split('');
    const arrayMask = getOnlyNumberFromString(mask).split('');

    arrayMask.forEach(item => {
        const index = array.indexOf(item);
        if(index > -1 ) {
            array.splice(index, 1)
        }
    });

    let valueAfterMask = mask
        .split('')
        .map((item) => item === '#' ? array.shift() || "_"  : item)
        .filter(item => !!item);


    let index_ = -1;
    valueAfterMask
        .forEach((item, index) => {
            if(!isNaN(parseInt(item))) {
                index_ = index
            }
        });

    if(index_ > -1) {
        valueAfterMask.splice(index_ + 1);
    } else {
        valueAfterMask = []; // todo
    }

    valueAfterMask = valueAfterMask.join('');

    return valueAfterMask;
};


const maskValidation = (mask, value) => {

    value = typeof value !== 'string' ? '' : value;

    if(!mask) {
        return false;
    }

    if(!value) {
        return false;
    }

    const array = getOnlyNumberFromString(value).split('');

    let valueAfterMask = mask
        .split('')
        .map((item) => item === '#' ? array.shift() || "_"  : item)
        .filter(item => !!item);

    return !valueAfterMask.includes('_')
};


export const MaskInputHelperModule =  {
    maskValidation,
    createMask
};
