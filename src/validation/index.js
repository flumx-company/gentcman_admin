function validateEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateURL(textval) {
    // eslint-disable-next-line
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(textval);
}

function validateBASE64(textval) {
    // eslint-disable-next-line
    const base64regex = /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g;

    return base64regex.test(textval);
}

export const Validation = {
    required: (e) => !!e || 'Это поле обязательное!',
    email: (e) => validateEmail(e) || 'Введите валидную почту',
    link: (e) => validateURL(e) || validateBASE64(e) || 'Введите валидный юрл',
    minLength: (length) => (e) => typeof e === 'string' && e.length >= length|| `Минимальная длина ${ length } `,
    maxLength: (length) => (e) => typeof e === 'string' && e.length < length|| `Минимальная длина ${ length } `,
};
