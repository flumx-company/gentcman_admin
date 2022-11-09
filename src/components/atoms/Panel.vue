<template>
    <div class="panel">
        <div class="reload-popup"  v-if="isReloadPopup">
            <div class="reload-popup-container">
                Вы сейчас находитесь на странице на которую хотите перейти,
                для того что бы обновить данные нажмите кнопку для перезагрузки (у вас все несохранненые данные
                очистятся)
                <div>
                    <button @click="reload()">
                        Перезагрузка
                    </button>
                    <button @click="isReloadPopup = false">
                        я потом сам перезагружу
                    </button>
                </div>
            </div>
        </div>
        <sitebar></sitebar>
        <div class="panel-content">
            <router-view></router-view>
        </div>
        <sitebar-right @is-reload-popup="isReloadPopup = true"></sitebar-right>

    </div>
</template>

<script>
    import Sitebar from "./Sitebar";
    import SitebarRight from "./SitebarRight";

    export default {
        name: "Panel",
        components: {
            Sitebar,
            SitebarRight
        },
        data () {
            return {
                isReloadPopup: false
            }
        },
        methods: {
            reload() {
                location.reload()
            },
        }
    }
</script>

<style scoped lang="scss">
    .panel {
        display: flex;

        &-content {
            padding: 20px;
            width: 100%;
            height: 100vh;
            overflow-y: auto;
        }
    }

    .reload-popup {
        width: 100%;
        height: 100vh;
        z-index: 1000000;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.59);

        &-container {
            background: white;
            width: 400px;
            box-shadow: 0 7px 30px rgba(76, 122, 157, 0.25);
            border-radius: 4px;
            padding: 20px;

            div {
                margin-top: 10px;
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
        }
    }

</style>
