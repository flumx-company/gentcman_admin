<template>
    <div>
        <!-- <loading ref="loading"></loading> -->
        <router-view></router-view>
        <loading ref="loading"></loading>
    </div>
</template>

<script>
    import Loading from "./components/molecules/Loading";

    export default {
        name: "App",
        components: {
            Loading
        },
        mounted() {
            window.loading = this.$refs.loading;

            window.startSpinner();
        },
    };
</script>

<style lang="scss">
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        overflow-y: auto !important;
    }

    $g-btn-outlined-border: #899BA9;
    $g-btn-outlined-color: #677D8E;
    $g-btn-outlined-disabled-border: #c5dfee;
    $g-btn-outlined-disabled-color: #a5cfe2;
    $g-btn-outlined-active-border: #FFAE00;
    $g-btn-outlined-active-color: #FFAE00;

    $g-btn-depressed-default-border: transparent;
    $g-btn-depressed-default-color: #677D8E;
    $g-btn-depressed-default-background: white;
    $g-btn-depressed-default-active-color: #506272;
    $g-btn-depressed-default-active-background: #eeeeee;
    $g-btn-depressed-default-disabled-border: #899BA9;
    $g-btn-depressed-default-disabled-color: #899BA9;
    $g-btn-depressed-default-disabled-background: #FBFBFB;

    $g-btn-depressed-order-modify-color: #FFFFFF;
    $g-btn-depressed-order-modify-background: #9C2D40;
    $g-btn-depressed-order-modify-active-background: #CF2240;

    $g-btn-depressed-review-modify-color: #FFFFFF;
    $g-btn-depressed-review-modify-background: #677D8E;
    $g-btn-depressed-review-modify-active-background: #8FA5B6;

    .g-btn {
        &-depressed, &-outlined {
            width: 240px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 23px;
            cursor: pointer;
            transition: 0.5s all;
            margin-bottom: 20px;
            border-radius: 4px;

            .ft-icons {
                margin-right: 8px;
            }
        }


        &-outlined {
            border: 0.7px solid $g-btn-outlined-border;
            box-sizing: border-box;
            color: $g-btn-outlined-color;
            font-size: 14px;
            line-height: 150%;

            &:hover, &:active {
                border-color: $g-btn-outlined-active-border;
                color: $g-btn-outlined-active-color;
            }

            &[btn-disabled],
            &[btn-disabled]:hover,
            &[btn-disabled]:active {
                border-color: $g-btn-outlined-disabled-border;
                color: $g-btn-outlined-disabled-color;
                cursor: not-allowed;
            }
        }


        &-depressed {
            padding: 18px 43px;
            background: $g-btn-depressed-default-background;
            font-weight: 500;
            border: 1px solid $g-btn-depressed-default-border;
            color: $g-btn-depressed-default-color;

            &[depressed-order-modify] {
                background: $g-btn-depressed-order-modify-background;
                color: $g-btn-depressed-order-modify-color;
            }

            &[depressed-review-modify] {
                background: $g-btn-depressed-review-modify-background;
                color: $g-btn-depressed-review-modify-color;
            }

            &:hover,
            &:active {
                background: $g-btn-depressed-default-active-background;
                color: $g-btn-depressed-default-active-color;
                box-shadow: 0 6px 10px rgba(197, 223, 238, 0.25);
            }

            &[depressed-order-modify]:hover,
            &[depressed-order-modify]:active {
                background: $g-btn-depressed-order-modify-active-background;
                color: $g-btn-depressed-order-modify-color;
            }

            &[depressed-review-modify]:hover,
            &[depressed-review-modify]:active {
                background: $g-btn-depressed-review-modify-active-background;
                color: $g-btn-depressed-review-modify-color;
            }

            &[btn-disabled],
            &[btn-disabled]:hover,
            &[btn-disabled]:active {
                background: $g-btn-depressed-default-disabled-background;
                border: 1px solid $g-btn-depressed-default-disabled-border;
                color: $g-btn-depressed-default-disabled-color;
                cursor: not-allowed;
            }


            &[overflow-ellipsis] {
                display: block;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
    }

    .g-btn-depressed.g-btn__full-size {
        width: 100%;
    }

    .delete__title {
        margin: 10px 0;
    }

    .is-publish-record {
        color: white;
        padding: 10px;
        border-radius: 10px;
    }

    .delete-selected {
        &__title {
            font-weight: bold;
            margin-bottom: 15px;

            &:first-letter {
                text-transform: uppercase;
            }
        }

        &__list {
            margin-bottom: 5px;

            &-item {
                span {
                    font-weight: bold;
                }
            }
        }
    }

    .datapicker-container {
        position: relative;
        .vdp-datepicker {
            position: absolute;
        }
    }

    * {
        box-sizing: border-box;
    }

    body {
        overflow-y: hidden;
    }


    .v-table-dynamic {
        .table-cell {
            min-width: 140px;
            width: 140px;
        }

        .vue-scroll-view > div {
            &:nth-child(n+2) {
                .v-table-row {
                    height: auto !important;
                    display: flex !important;
                    align-items: center !important;

                }
            }
        }
    }

    .checkbox {
        margin: 20px;
        font-size: 26px;
    }

    .table-custom-content {
        margin: 20px;
        td {
            border: 1px solid gray;
            padding: 5px;
        }

        th {
            background: #ff979b;
        }
    }

    .table-cell-content.fill-width {
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        overflow: hidden;
        white-space: normal!important;
    }

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
