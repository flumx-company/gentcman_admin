<template>
    <div class="g-dropdown g-form" :class="{
             active: showMenu,
             'g-dropdown-is-invalid': !disabled && focus && !isValid,
             'g-dropdown-is-valid': !disabled && focus && isValid,
             'g-dropdown-is-disabled': disabled
            }">

        <div class="g-dropdown-label" v-if="label">
            {{ label }}
        </div>

        <div class="btn-group" :class="{ active: showMenu }" :style="{
                    'background': isColor && getColor
                }">

            <div @click="toggleMenu()" class="dropdown-toggle" v-if="getSelectData !== undefined"
                >

                {{ getSelectData }}

                <i class="g-icon-fonts g-icons g-arrow-down"></i>
                <i class="g-icon-fonts g-icons g-arrow-above"></i>
            </div>

            <div @click="toggleMenu()" class="dropdown-toggle dropdown-toggle-placeholder"
                v-if="getSelectData === undefined">

                {{placeholderText}}

                <i class="g-icon-fonts g-icons g-arrow-down"></i>
                <i class="g-icon-fonts g-icons g-arrow-above"></i>
            </div>

            <ul class="dropdown-menu">
                <li v-for="(option, idx) in options" :key="idx">
                    <a href="javascript:void(0)"
                       :class="{active: (option && option[displayValue]) === (selectedOption && (selectedOption || selectedOption[displayName]))}"
                       @click="updateOption(option)">
                        {{ option && option[displayName] }}
                    </a>
                </li>
            </ul>
        </div>
        <div v-if="focus">
            <div class="g-dropdown__error-messages" v-for="item in messages" :key="item">{{ item }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedOption: {},
                showMenu: false,
                placeholderText: 'Please select an item',
                validation_local: [],
                focus: false
            }
        },
        props: {
            options: {
                type: [ Array, Object ]
            },
            displayName: String,
            displayValue: {},
            value: {},
            placeholder: [ String ],
            label: [ String ],
            closeOnOutsideClick: {
                type: [ Boolean ],
                default: true,
            },
            disabled: Boolean,
            validation: {
                type: Array,
                default: () => ([])
            },
            infinite: Boolean,
            isColor: Boolean
        },

        mounted() {

            if(this.infinite) {
                this.$el.onscroll = () => {
                    let bottomOfWindow = this.$el.scrollTop + this.$el.innerHeight === this.$el.offsetHeight;

                    console.log(bottomOfWindow)

                    if (bottomOfWindow) {
                        // ...
                    }
                };
            }


            this.selectedOption = this.options
                .find((option) => (
                    typeof option === 'object' ? option[this.displayValue] : option) == (typeof this.value  === 'object' ? this.value[this.displayValue] : this.value)
                );

            if(!this.selectedOption) {
                this.selectedOption = this.options[0]
            }

            if (this.placeholder) {
                this.placeholderText = this.placeholder;
            }

            if (this.closeOnOutsideClick) {
                document.addEventListener('click', this.clickHandler);
            }
        },

        beforeDestroy() {
            document.removeEventListener('click', this.clickHandler);
        },

        methods: {
            updateOption(option) {
                this.selectedOption = option;
                this.showMenu = false;
                this.$emit('input', typeof option === 'object' ? option[this.displayValue] === undefined ? option : option[this.displayValue] : option);
            },

            toggleMenu() {
                this.showMenu = !this.showMenu;
            },

            clickHandler(event) {
                const { target } = event;
                const { $el } = this;

                if (this.showMenu && !$el.querySelector('.btn-group').contains(target)) {
                    this.validationHandle();
                    this.focus = true;
                    this.showMenu = false;
                }
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
            },
            checkValidation(){
                this.focus = true;
                this.validationHandle();
                return {
                    isValid: this.isValid,
                    messages: this.messages,
                }
            }
        },

        watch: {
            validation() {
                this.validationHandle()
            },
            value() {
                this.selectedOption = this.options
                    .find((option) => (
                        typeof option === 'object' ? option[this.displayValue] : option) == (typeof this.value  === 'object' ? this.value[this.displayValue] : this.value)
                    );
            },
            options() {
                this.selectedOption = this.options
                    .find((option) => (
                        typeof option === 'object' ? option[this.displayValue] : option) == (typeof this.value  === 'object' ? this.value[this.displayValue] : this.value)
                    );
            }
        },

        created() {
            if (this.validationDefault) {
                this.focus = true
                this.validationHandle()
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
            getSelectData() {
                return typeof this.selectedOption === 'object' ? this.selectedOption[this.displayName] : this.selectedOption
            },
            getColor() {
                return typeof this.selectedOption === 'object' && this.selectedOption.color ? this.selectedOption.color : ''
            }
        }
    }
</script>

<style lang="scss">

    .g-dropdown-label {
        font-size: 14px;
        line-height: 150%;
        margin-bottom: 5px;
    }

    .g-dropdown {

        &-is-invalid {
            *{color: #F56565!important;}
            .btn-group{
                border-color: #F56565;
            }
        }

        &-disabled {
            *{
                color:  #111D13!important;
            }
            .btn-group{
                border-color: #BBCDDB;
            }
        }

        &-is-valid {
            *{color: #00948A!important;}
            .btn-group{
                border-color: #00948A;
            }
        }

        &__error-messages {
            margin-top: 5px;
            font-size: 12px;
            line-height: 150%;
        }
    }

    .btn-group {
        min-width: 160px;
        height: 40px;
        position: relative;
        margin: 10px 1px;
        display: inline-block;
        vertical-align: middle;
        border: 0.7px solid #677D8E;
        border-radius: 4px;

        i {
            position: absolute;
            right: 20px;
            top: 15px;
            color: #111D13;
            font-size: 8px;
            width: auto;
            height: auto;
            &:before {
                font-size: 8px;
            }

        }
        .btn-group a:hover {
            text-decoration: none;
        }

        .dropdown-toggle {

            font-size: 14px;
            line-height: 150%;
            color: #000000;
            width: 100%;
            height: 100%;
            padding: 9px 20px;
            padding-right: 33px;
            text-transform: none;
            font-weight: 300;
            margin-bottom: 7px;
            border: 0;
            box-shadow: none;
            border-radius: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .dropdown-toggle:hover {
            cursor: pointer;
        }

        .dropdown-menu {
            display: none;
            position: absolute;
            left: 0;
            top: calc(100% + 20px);
            z-index: 1000;
            float: left;
            min-width: 100%;
            max-height: 200px;
            overflow-y: auto;
            padding: 5px 0;
            margin: 2px 0 0;
            list-style: none;
            font-size: 14px;
            background: #FCFCFC;
            box-shadow: 0 7px 30px rgba(76, 122, 157, 0.25);
            border-radius: 4px;
            background-clip: padding-box;
        }

        .dropdown-menu > li > a {
            padding: 7px 20px;
            display: block;
            clear: both;
            font-weight: normal;
            line-height: 1.6;
            color: #333333;
            text-decoration: none;
            transition: all 0.5s;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            &.active, &:hover {
                color: #FFAE00;
                padding-left: 35px;
            }
            &.active {
                color: #cb8800;
            }

        }

        .dropdown-menu > li {
            overflow: hidden;
            width: 100%;
            position: relative;
            margin: 0;
        }

        .caret {
            width: 0;
            position: absolute;
            top: 19px;
            height: 0;
            margin-left: -24px;
            vertical-align: middle;
            border-top: 4px dashed;
            border-top: 4px solid;
            border-right: 4px solid transparent;
            border-left: 4px solid transparent;
            right: 10px;
        }

        li {
            list-style: none;
        }
        i {
            transition: opacity 0.5s ;
        }
        i:last-child {
            opacity: 0;
        }
        &.active {
            i:first-child {
                opacity: 0;
            }
            i:last-child {
                opacity: 1;
            }
            .dropdown-menu {
                display: block;
            }
        }
    }

</style>
