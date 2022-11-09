<template>
    <div class="Login">
        <div class="containerform">
            <div class="form">
                <form-data ref="formData">
                    <input-component
                            v-model="form.email.value"
                            :placeholder="form.email.placeholder"
                            :validation="form.email.validation"
                            :label="form.email.label"
                            :type="form.email.type"
                    >
                    </input-component>

                    <input-component
                            v-model="form.password.value"
                            :placeholder="form.password.placeholder"
                            :validation="form.password.validation"
                            :label="form.password.label"
                            :type="form.password.type"
                    >
                    </input-component>

                    <div
                            class="g-btn-depressed"
                            @click="login()"
                            depressed-order-modify>
                        Войти
                    </div>
                </form-data>
            </div>
        </div>
    </div>
</template>

<script>
    import { $api } from '../../api';
    import { Validation } from "../../validation";
    import Input from "../molecules/Input";
    import FormData from "../molecules/FormData";

    export default {
        name: "login",
        components: {
            FormData,
            InputComponent: Input
        },
        data: () => ({
            form: {
                email: {
                    value: 'admin@gmail.com',
                    label: 'Email',
                    placeholder: 'test@gmail.com',
                    type: 'text',
                    validation: [Validation.required, Validation.email],
                    defValue: ''
                },
                password: {
                    value: 'admin',
                    label: 'Пароль',
                    placeholder: 'пароль',
                    type: 'password',
                    validation: [Validation.required],
                    defValue: ''
                },
            }
        }),
        mounted() {
            window.finishSpinner();
        },
        methods: {
            async login() {
                const test = this.$refs.formData.getValidation();
                if (test.isValid) {
                    $api.authRequest.signIn({
                        email: this.form.email.value,
                        password: this.form.password.value
                    })
                        .then((res = {}) => {
                            if (res && res.data && res.data.token) {
                                this.$toast.success('Вы залогинены');
                                localStorage.setItem('jwt', res.data.token);
                                this.$router.push({ path: "/panel/blog-categories" });
                            } else {
                                this.message("error", "Error authorize", true);
                            }
                        })
                        .catch(() => {
                            this.$toast.error('Пожалуйста заполните валидно данные');
                        });
                } else {
                    this.$toast.error('Пожалуйста заполните валидно данные');
                }
            }
        }
    };
</script>

<style scoped>
    .modallogin {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background: white;
        z-index: 2000;
        transition: all 1s;
        width: 100vw;
        height: 100vh;
        font-size: 30px;
    }

    .Login {
        position: absolute;
        background: #71ff99;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .containerform {
        width: 360px;
        margin: auto;
    }

    .form {
        position: relative;
        z-index: 1;
        background: #ffffff;
        padding: 45px;
        text-align: center;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    .form input {
        font-family: "Roboto", sans-serif;
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        margin: 0 0 15px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
        transition: all 1s;
        border: 1px solid white;
    }

    .form button,
    .form-modal button {
        font-family: "Roboto", sans-serif;
        text-transform: uppercase;
        outline: 0;
        width: 100%;
        border: 0;
        margin-top: 20px;
        padding: 15px;
        color: #ffffff;
        font-size: 14px;
        -webkit-transition: all 0.3 ease;
        transition: all 1s;
        cursor: pointer;
    }

    .form button:hover {
        background: rgb(0, 177, 217);
    }

    .form .message {
        margin: 15px 0 0;
        color: #b3b3b3;
        font-size: 12px;
    }

    .form .message a {
        color: rebeccapurple;
        text-decoration: none;
    }

    .allErrors {
        position: absolute;
        opacity: 0;
        background: red;
        border: 1px solid red;
        padding: 5px;
        color: white;
        right: 5px;
        top: 5px;
        z-index: 10;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
        word-wrap: break-word;
        transition: all 1s;
    }

    .allErrors ul {
        padding: 0;
        margin: 0;
    }

    .allErrors ul li {
        padding: 5px;
        list-style: none;
    }
</style>
