<template>
    <div class="form-data" :name="name">
        <slot></slot>
    </div>
</template>

<script>
    import { CommonHelperModule } from "../../helpers/common.helper.module";

    export default {
        name: "form-data",
        props: {
            name: {
                type: String,
                default: () => CommonHelperModule.generateUUID(10)
            }
        },
        methods: {
            getValidation() {
                const arrayChecks = [];

                document.querySelectorAll(`.form-data[name="${this.name}"] .g-form`)
                    .forEach(item => item.__vue__ && arrayChecks.push(item.__vue__.checkValidation()));

                return {
                    isValid: arrayChecks.every(({ isValid }) => isValid),
                    messages: arrayChecks.reduce((acc, { messages }) => acc.concat(messages), [])
                }
            }
        }
    }
</script>
