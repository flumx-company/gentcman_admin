export const loverCaseFirstLetter = (string) => typeof string === 'string'
    ? string.charAt(0).toLowerCase() + string.slice(1)
    : '';

export const reduceObject = (object) => Object
    .keys(object)
    .reduce((prev, cur) => ({
        ...prev,
        [cur]: object[cur]
    }),  {});

function deepClone(clObj = {}, obj) {
    for(const i in obj) {
        if (typeof obj[i] === 'object') {
            clObj[i] = deepClone(obj[i]);
            continue;
        }
        clObj[i] = obj[i];
    }
    return clObj;
}

export const compareClass = (classA, classB) => ({
    ...deepClone(classA),
    ...classB
});
