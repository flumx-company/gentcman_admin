<template>
    <div class="modal" :style="{zIndex}">
        <div class="modal-container" :style="{width,height}">
            <div style="width: 100%; display: flex; justify-content: flex-end">
                <button @click.self="$emit('close')" class="cancel">
                    Отмена
                </button>
            </div>
            <div style="width: 100%; height: calc(100% - 21px);overflow-y: auto; ">
                <div class="modal-title" v-if="title">
                    {{ title }}
                </div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "modal",
        props: {
            width: {
                type: String,
                default: '600px'
            },
            height: {
                type: String,
                default: '500px'
            },
            zIndex: {
                type: Number,
                default: 10000
            },
            header: {
                type: Object,
                default: () => ({})
            },
            footer: {
                type: Object,
                default: () => ({})
            },
            title: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped lang="scss">
    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.48);
        height: 100vh;
        width: 100%;
        position: absolute;
        top: 0;
        /*z-index: 10000;*/
        left: 0;

        &-container {
            background: white;
            padding: 10px;

        }

        &-title {
            font-size: 22px;
            margin-bottom: 10px;
        }

        .cancel {
            margin-bottom: 10px;
        }
    }
</style>
