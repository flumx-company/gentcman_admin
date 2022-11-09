<template>
    <div class="sitebar-right">
        <button @click="readAll()" style="margin: auto">прочитать все</button>

        <ul class="dbl-border">
            <li v-for="(item, index) in list"
                :key="item.id + 'index' + index"
                :style="{background: !item.read_at ? 'rgba(255,25,0,0.33)': ''}">
                <div>
                    <h3 @click="sameRouter(item.pageUrl)"
                        style="margin-right: 10px; font-size: 13px; padding: 10px; border-radius: 10px"
                        :style="{
                            color: item.titleColor,
                            background: item.titleBackground
                        }">
                        {{ index + 1 }} -
                        <router-link :to="item.pageUrl"  :style="{
                            color: item.titleColor
                        }">{{ item.titleName }}</router-link>
                    </h3>


                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
                        <button v-if="!item.read_at" @click="read(item)">прочитать</button>
                        <div v-if="item.read_at" style="color: blue">прочитано</div>
                        <button @click="deleteNotification(item)">удалить</button>
                    </div>
                </div>

                <div style="margin-bottom: 10px;display: flex" v-for="(dataContent, dataIndex) in item.data"
                     :key="item.id + 'dataContent' + dataIndex + dataContent">
                    <div style="margin-right: 10px;min-width: 100px;word-break: break-word;">
                        {{ dataIndex }}
                    </div>
                    <div style="word-break: break-word;">
                        {{ dataContent }}
                    </div>
                </div>
            </li>

            <infinite-loading @infinite="infiniteHandler"></infinite-loading>
        </ul>
    </div>
</template>

<script>

    import { $api } from "../../api";
    import InfiniteLoading from "vue-infinite-loading";

    const mp3 = require('../../assets/rj_3142622_04f1ce0737903e073fdc3c1cd5953a14_1618084674.mp3')

    const reformatType = (text) => {
        return text.replace(/\\|\//g, '$').split('$')[ 2 ]
    };

    class NotificationModel {
        constructor(obj, type) {
            Object.assign(this, {
                id: obj.id,
                notification_id: obj.notification_id,
                type,
                read_at: obj.read_at,
                data: this.reformatData(obj.data)
            });
        }

        reformatData() {
        }

    }

    class NotificationOrderModel extends NotificationModel {
        titleBackground = '#2c2c80';
        titleColor = 'yellow';
        titleName = 'Сделали заказ';
        pageUrl = '/panel/orders';

        reformatData(data) {
            return {
                "Почта": data.billing_email,
                "Телефон": data.billing_phone,
                "Юзер": data.user_id,
                "Номер заказа": data.order_id,
                "Стоимость": data.grand_total,
                "Тип отправки": this.getBillingType(data.billing_delivery_type),
                "Тип оплаты": this.getPaymentType(data.billing_payment_type)
            }
        }

        getPaymentType(status) {
            switch ( status ) {
                case 1: return 'Наложеный платёж';
                case 2: return 'Оплата на карту';
                default: return;
            }
        }

        getBillingType(status) {
            switch ( status ) {
                case 1: return 'Нова Пошта';
                case 2: return 'Укр Пошта';
                case 3: return 'Самовывоз (Запорожье)';
                case 4: return 'Курьерская доставка';
                default: return;
            }
        }
    }

    class NotificationAnswerNotFoundModel extends NotificationModel {
        titleBackground = 'black';
        titleColor = 'skyblue';
        titleName = 'У нас спросили вопрос';
        pageUrl = '/panel/faq';

        reformatData(data) {
            return {
                "Тема": data.theme,
                "Описание": data.content,
                "Юзер": data.name,
                "Почта": data.user_email,
            }
        }
    }

    class NotificationReportProblemModel extends NotificationModel {
        titleBackground = 'black';
        titleColor = 'yellow';
        titleName = 'Нас оповестили о проблеме';
        pageUrl = '/panel/report-problem';

        reformatData(data) {
            return {
                "Тема": data.theme,
                "Описание": data.content,
                "Почта": data.user_email,
            }
        }
    }

    class NotificationDevelopmentIdeaModel extends NotificationModel {
        titleBackground = 'black';
        titleColor = 'green';
        titleName = 'Нам предлоили разработать';
        pageUrl = '/panel/development-ideas';

        reformatData(data) {
            return {
                "Тема": data.theme,
                "Описание": data.idea,
                "Почта": data.email,
            }
        }
    }

    class NotificationImprovementIdeaModel extends NotificationModel {
        titleBackground = 'black';
        titleColor = 'orange';
        titleName = 'Нам предлоили улучшить';
        pageUrl = '/panel/idea-improvements';

        reformatData(data) {
            return {
                "Идея улучшения": data.improvement,
                "Имя юзера": data.user_name,
                "Почта": data.email,
            }
        }
    }

    class NotificationPostOfferModel extends NotificationModel {
        titleBackground = 'black';
        titleColor = '#e3aaaa';
        titleName = 'Нам предлоили сделать пост';
        pageUrl = '/panel/post-offers';

        reformatData(data) {
            return {
                "Тема": data.theme,
                "Текст": data.text,
                "Имя юзера": data.user_name,
                "Почта": data.email,
            }
        }
    }

    const getModelWithType = (obj) => {
        const type = reformatType(obj.type);

        switch ( type ) {
            case 'AnswerNotFoundNotification':
                return new NotificationAnswerNotFoundModel(obj, type);
            case 'ReportProblemNotification':
                return new NotificationReportProblemModel(obj, type);
            case 'DevelopmentIdeaNotification':
                return new NotificationDevelopmentIdeaModel(obj, type);
            case 'ImprovementIdeaNotification':
                return new NotificationImprovementIdeaModel(obj, type);
            case 'PostOfferNotification':
                return new NotificationPostOfferModel(obj, type);
            case 'UserPlacedOrderNotification':
                return new NotificationOrderModel(obj, type);
        }
    };

    const channels = ["answer-no-found", "report-problem", "post-offer", "development-idea", "improvement-idea", "user-placed-order"]

    export default {
        name: "sitebarRight",
        components: {
            InfiniteLoading,
        },
        data: () => ({
            list: [],
            current_page: 0
        }),
        computed: {
            page: {
                get() {
                    return this.current_page
                },
                set(page) {
                    this.getData(page)
                }
            }
        },
        methods: {
            setPaginate(res) {
                this.current_page = res.data.current_page;
                this.last_page = res.data.last_page;
                let list = res.data.data.map(getModelWithType);

                const constId = this.list.map(item => item.id);

                list = list.filter(item => {
                    return !constId.includes(item.id)
                });

                this.list = this.list.concat(list);

                return res.data
            },

            reformatType(text) {
                return text.replace(/\\|\//g, '$').split('$')[ 2 ]
            },

            getData(page) {
                window.startSpinner();
                return $api.notificationsRequest
                    .getAll({
                        page
                    })
                    .then(this.setPaginate.bind(this))
                    .then((res) => {
                        window.finishSpinner();
                        return res;
                    });
            },

            read(data) {
                window.startSpinner();
                return $api.notificationsRequest
                    .getOne(data.id)
                    .then((res) => this.readedElement({
                        ...res.data,
                        type: this.reformatType(res.data.type)
                    }))
                    .then(window.finishSpinner);
            },

            deleteNotification(data) {
                window.startSpinner();
                return $api.notificationsRequest
                    .delete(data.id)
                    .then(window.finishSpinner);
            },

            readAll() {
                window.startSpinner();
                $api.notificationsRequest
                    .readAll()
                    .then(this.readAllInList.bind(this))
                    .then(window.finishSpinner);
            },

            readedElement(data) {
                data = typeof data === 'object' ? data : {};
                const id = data.id;

                const findIndex = this.list.findIndex(item => item.id === id);


                if (findIndex > -1) {
                    this.list.splice(findIndex, 1, {
                        ...this.list[ findIndex ],
                        ...data
                    });
                }
            },

            infiniteHandler($state) {
                this.getData(this.page + 1)
                    .then((res) => res.last_page > this.page ? $state.loaded() : $state.complete())
            },
            addNotification(e) {
                const data = getModelWithType({
                    ...e,
                    data: e
                });

                this.list.splice(
                    0,
                    0,
                    getModelWithType({
                        ...e,
                        data: e
                    })
                );


                window.showNotification(data.type, data.titleName);
                this.audioNotification(data.type)
            },
            readAllInList() {
                this.list = this.list.map(item => ({
                    ...item,
                    read_at: true
                }));
            },
            normalizeObj(obj) {
                return Object
                    .keys(obj)
                    .filter(item => !!obj[ item ])
                    .reduce((acc, cur) => ({
                        ...acc,
                        [ cur ]: obj[ cur ]
                    }), {})
            },
            audioNotification (){
                try {
                    const audio = document.createElement('audio');
                    audio.src = mp3;
                    audio.load();
                    audio.play();
                } catch ( e ) {
                    console.log(e)
                }

            },
            sameRouter(path) {
                const isReloadPopub = location.pathname.includes(path);
                if(isReloadPopub) {
                    this.$emit('is-reload-popup')
                }
            }
        },
        created() {


            channels.forEach((item) => window.Echo
                .channel(item)
                .notification(this.addNotification.bind(this))
            );

            window.Echo
                .channel("read-at")
                .notification((e) => {
                    this.readedElement({
                        id: e.id_read,
                        read_at: e.read_at
                    });
                });

            window.Echo
                .channel("notification-removed")
                .notification((e) => {
                    const findIndex = this.list.findIndex(item => item === e.id);

                    this.list.splice(
                        findIndex,
                        1,
                    )
                });

            window.Echo
                .channel("mark-all-notifications-as-read")
                .notification(this.readAllInList.bind(this));

        }
    }
</script>

<style scoped lang="scss">
    .sitebar-right {
        width: 300px;
        min-width: 300px;
        position: relative;
        overflow-y: auto;
        height: 100vh;
        box-shadow: 1px 1px 20px #00000054;
    }

    .dbl-border {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .dbl-border li {
        padding: 10px;
        position: relative;
        border-bottom: 1px solid grey;
    }


    /*.dbl-border a {*/
    /*    width: 100%;*/
    /*    padding: 10px;*/
    /*    color: #808285;*/
    /*    text-decoration: none;*/
    /*    border-left: 6px solid #ABC7EA;*/
    /*    display: block;*/
    /*    line-height: 44px;*/
    /*    font-size: 20px;*/
    /*    position: relative;*/
    /*    transition: 0.3s linear;*/
    /*}*/

    /*.dbl-border a:hover {*/
    /*    border-left: 6px solid #d97950;*/
    /*    background: rgba(217, 121, 80, 0.27);*/
    /*}*/

    /*.dbl-border a.active {*/
    /*    border-left: 6px solid #58a2d9;*/
    /*    background: rgba(88, 162, 217, 0.27);*/
    /*}*/
</style>
