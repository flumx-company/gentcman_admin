<template>
    <div
            class="g-input g-form"
            :class="{
                 'g-input-is-invalid': isFocus &!isValid,
                 'g-input-is-valid': isFocus && isValid,
                 'g-input-is-disabled': disabled
            }">
        <div v-if="label" class="g-input__label">
            <label :for="id">{{ label }}</label>
        </div>
        <div class="g-input__container" @click="$emit('click')">
            <input
                v-if="type !== 'textarea'"
                ref="test"
                :id="id"
                :type="getTypeText"
                class="g-input__inner"
                :placeholder="placeholder"
                :readonly="readonly"
                :disabled="disabled"
                :value="stringValue"

                @blur="validationHandle();isFocus = true"
                @input="handleInput($event.target.value)"
            />
            <textarea
                    v-else
                    ref="test"
                    :id="id"
                    class="g-input__inner"
                    :placeholder="placeholder"
                    :readonly="readonly"
                    :disabled="disabled"
                    :value="stringValue"
                    @blur="validationHandle();isFocus = true"
                    @input="handleInput($event.target.value)"
            ></textarea>
            <slot v-if="!isFocus"></slot>
            <i v-if="type !== 'password' && isFocus && !isValid" class="g-icon-fonts g-icons g-error"></i>
            <i v-if="type !== 'password' && isFocus && isValid" class="g-icon-fonts g-icons g-check"></i>
            <div class="g-input__container__eye" v-if="type === 'password'" @click="passwordHide = !passwordHide ">
                <span v-if="passwordHide" class="g-icon-fonts g-icons g-eye"></span>
                <span v-else class="g-icon-fonts g-icons g-eye-line"></span>
            </div>

        </div>
        <div v-if="isFocus">
            <div class="g-input__error-messages" v-for="item in messages" :key="item">{{ item }}</div>
        </div>

    </div>
</template>

<script>
    import { CommonHelperModule } from "../../helpers/common.helper.module";
    import { MaskInputHelperModule } from "../../helpers/mask.input.helper.module";

    const { generateUUID, getOnlyNumberFromString } = CommonHelperModule;
    const { maskValidation, createMask } = MaskInputHelperModule;

    export default {
        name: 'g-input',
        inheritAttrs: false,
        props: {
            placeholder: String,
            readonly: Boolean,
            disabled: Boolean,
            validation: {
                type: Array,
                default: () => ([])
            },
            type: {
                type: String,
                default: 'text'
            },
            label: {
                type: String,
                default: ''
            },
            mask: String,
            value: [ String, Number ],
            icon: {
                default: () => ({
                    validIcon: '',
                    invalidIcon: ''
                })
            },
            validationDefault: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isFocus: false,
                stringValue: null,
                validation_local: [],
                id: `${ generateUUID() }-input`,
                passwordHide: true
            }
        },
        watch: {
            value: {
                handler() {
                    this.handleInput(this.value);
                    if(this.value){
                        this.validationHandle()
                    }
                },
                immediate: true,
            },
            validation() {
               this.validationHandle()
            }
        },
        methods: {
            handleInput(e) {
                if(this.stringValue === e) return;

                if(this.type === 'number' ) {
                    e = getOnlyNumberFromString(e.toString())
                }

                if(this.type === 'phone' && this.mask) {
                    e = createMask(this.mask, e);
                }

                if(this.$refs.test) {
                    this.$refs.test.value = e;
                }
                this.stringValue = e;
                this.$emit('input', e)
            },
            validationHandle () {
                this.validation_local = [];
                (Array.isArray(this.validation) ? this.validation : []).forEach(item => {
                    const result = item(this.value);

                    const message = typeof result === 'string' ? result : null;
                    this.validation_local.push({
                        check: typeof result === 'boolean' && result,
                        message
                    })
                });
                if(this.type === 'phone' && this.mask) {
                    const result = maskValidation(this.mask, this.value);
                    this.validation_local.push({
                        check: result,
                        message: !result ? 'Please set valid data' : null
                    });
                }
            },
            checkValidation(){
                this.isFocus = true;
                this.validationHandle();
                return {
                    isValid: this.isValid,
                    messages: this.messages,
                }
            }
        },
        computed: {
            isValid() {
                return this.validation_local.every(item => item.check)
            },
            messages() {
                const array = [];
                this.validation_local.forEach((item) => item.message && array.push(item.message));
                return array;
            },
            getTypeText() {
                return this.type === 'text' || this.type === 'password'
                    ? this.type === 'password' ?  this.passwordHide ? 'password': 'text' : 'text'
                    : 'text'
            }
        },
        created() {
            // if(this.value){
            //
            // }

            if (this.validationDefault) {
                this.isFocus = true;
                this.validationHandle()
            }
        }
    }
</script>

<style lang="scss">
    .g-input {
        margin-bottom: 15px;
        *{
            color: #677D8E;
        }
        &__label {
            font-size: 14px;
            line-height: 150%;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
        }

        &__container {
            position: relative;
            display: flex;
            box-sizing: border-box;
            border-radius: 4px;

            input, textarea {
                border: 1px solid #BBCDDB;
                border-radius: 4px;
                padding: 15px;
                padding-right: 72px;
                font-size: 15px;
                line-height: 150%;
                width: 100%;
                transition: 0.2s all;

                &:focus, &:hover {
                    border: 1px solid #FFAE00;
                    outline: none;
                }

                &:active  {
                    border: 1px solid #C58100;
                }

                &::placeholder {
                    font-family: Inter;
                    font-size: 15px;
                    line-height: 150%;
                    letter-spacing: normal;
                    word-spacing: normal;
                }
            }

            i, &__eye {
                font-size: 21px;
                position: absolute;
                right: 23px;
                top: 15px;
            }

            &__eye {
                transition: 0.2s all;
                right: 16px;
                top: 13px;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                span {
                    font-size: 12px;
                    height: auto;
                    width: auto;

                    &.g-eye-line {
                        font-size: 19px;
                    }
                }

                &:hover {
                    background: #FFEEC3;

                    span {
                        color: #FFAE00;
                    }
                }
            }
        }
        &.g-input-is-invalid {
            * {
                color: #F56565;
            }
            input, textarea {
                color: #F56565;
                border: 1px solid #F56565;
            }
        }

        &.g-input-is-valid, textarea {

            * {
                color: #00948A;
            }
            input, textarea  {
                border: 1px solid #00948A;
            }
        }

        &.g-input-is-disabled, textarea {

            * {
                color:  #111D13;;
            }
            input, textarea  {
                border: 1px solid #BBCDDB;
            }
        }

        &__error-messages {
            margin-top: 5px;
            font-size: 12px;
            line-height: 150%;
        }
    }
</style>
