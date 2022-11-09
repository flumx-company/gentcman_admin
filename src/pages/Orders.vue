<template>
    <div class="page-orders">

        <input-component
                v-model="filterFields.billing_email"
                placeholder="почта"
                label="Почта"
                type="text"
        >
        </input-component>

        <input-component
                v-model="filterFields.billing_phone"
                placeholder="+3......"
                label="Телефон"
                type="text"
        >
        </input-component>

        <dropdown
                :options="statuses"
                :value="filterFields.order_status_id"
                :is-color="true"
                label="Статус"
                display-name="name"
                display-value="id"
                @input="filterFields.order_status_id = $event">

        </dropdown>

        <div
                class="g-btn-depressed"
                @click="getData()"
                depressed-order-modify>
            {{ texts.filtering }}
        </div>

        <vue-table-dynamic
                :params="params"
                ref="table"
                @selection-change="onSelectionChange">

            <template v-slot:column-2="{ props }">
                <div @click="editData(props)">
                    <dropdown
                            :options="statuses"
                            :value="props.cellData"
                            :disabled="true"
                            :is-color="true"
                            display-name="name"
                            display-value="id"
                    >
                    </dropdown>
                </div>
            </template>

            <template v-slot:column-3="{ props }">
                <div v-html="props.cellData">
                </div>
            </template>

            <template v-slot:column-4="{ props }">
                <button
                        @click="checkInfoAboutProject(props)"
                >
                    просмотреть информацию о заказе
                </button>
            </template>

            <template v-slot:column-13="{ props }">
                <button

                        @click="deleteData(props)"
                >
                    {{ texts.tableActions.delete }}
                </button>
            </template>

        </vue-table-dynamic>

        <pagination
                v-model="page"
                :pageCount="totalPage">
        </pagination>


        <div
                class="g-btn-depressed"
                v-if="selectionIds.length"
                @click="modalMode = 'confirmDeleteSelected'"
                depressed-order-modify>
            {{ texts.deleteSelected }}
        </div>

        <modal
                v-if="modalMode === 'editMode'"
                @close="modalMode = ''"
                width="auto"
                height="auto"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <dropdown
                        :options="statuses"
                        :value="form.order_status_id.value"
                        :validation="form.order_status_id.validation"
                        label="status"
                        display-name="name"
                        display-value="id"
                        @input="form.order_status_id.value = $event">
                </dropdown>
                <div>
                    <input-component
                            v-model="form.message.value"
                            :placeholder="form.message.placeholder"
                            :validation="form.message.validation"
                            :label="form.message.label"
                            :type="form.message.type"
                    >
                    </input-component>
                    <choose-message-template
                            :message-templates="messageTemplates"
                            @change="form.message.value = $event">
                    </choose-message-template>
                </div>


                <div
                        class="g-btn-depressed"
                        @click="submit(modalMode === 'editMode' && 'updateOneData')"
                        depressed-order-modify>
                    {{ texts.modalMode.confirmActionUpdateCreate[modalMode] }}
                </div>
            </form-data>
        </modal>
        <modal
                v-if="modalInfoMode === 'info'"
                @close="modalInfoMode = '', info = null"
                width="800px"
                height="80vh"
                :title="'Информация о заказе'">
            <div class="order-page-info">
                <table>
                    <tr>
                        <td>Дата создания:</td>
                        <td>{{ info.created_at }}</td>
                    </tr>
                    <tr>
                        <td>Адресс:</td>
                        <td><span v-html="info.address"></span></td>
                    </tr>
                    <tr>
                        <td>Сумма заказа:</td>
                        <td>{{ info.grand_total }}</td>
                    </tr>
                    <tr>
                        <td>Почта:</td>
                        <td>{{ info.billing_email }}</td>
                    </tr>
                    <tr>
                        <td>Имя юзера:</td>
                        <td>{{ info.billing_user_name }}</td>
                    </tr>
                    <tr>
                        <td>Телефон юзера:</td>
                        <td>{{ info.billing_phone }}</td>
                    </tr>
                    <tr>
                        <td>Тип оплаты:</td>
                        <td>{{ info.payment_type }}</td>
                    </tr>
                    <tr>
                        <td>Тип отправки:</td>
                        <td>{{ info.billing_delivery_type }}</td>
                    </tr>
                    <tr>
                        <td>Статус сообщения:</td>
                        <td>{{ info.message }}</td>
                    </tr>
                    <tr>
                        <td>Сообщение от юзера:</td>
                        <td>{{ info.message_from_user }}</td>
                    </tr>
                    <tr>
                        <td>Статус:</td>
                        <td>
                            <dropdown
                                :options="statuses"
                                :value="info.order_status_id"
                                :disabled="true"
                                :is-color="true"
                                display-name="name"
                                display-value="id"
                            >
                            </dropdown>
                        </td>
                    </tr>
                </table>

                <table>
                    <tr>
                        <th>Картинка</th>
                        <th>Количество заказанных</th>
                        <th>Имя товара</th>
                        <th>Стоимость товара</th>
                        <th>Количество доступных елементов</th>
                    </tr>
                    <tr v-for="item in info.order_products" :key="item.uuid">
                        <td>
                            <img :src="item.product.banner_image" style="width: 100%">
                        </td>
                        <td>
                            {{ item.quantity }}
                        </td>
                        <td>
                            {{ item.product.name }}
                        </td>
                        <td>
                            {{ item.product.cost }}
                        </td>
                        <td>
                            {{ item.product.amount }}
                        </td>
                    </tr>
                </table>

            </div>
        </modal>
        <modal
                v-if="modalMode === 'confirmDeleteMode' || modalMode === 'confirmDeleteSelected'"
                @close="modalMode = ''"
                width="auto"
                height="auto"
                :title="texts.modalMode[modalMode]">

            <div v-if="modalMode !== 'confirmDeleteSelected'"
                 class="delete__title"
            >
                {{ texts.modalMode.confirmDelete.description }}
            </div>

            <div v-else class="delete-selected">
                <div class="delete-selected__title">
                    {{ texts.deleteSelectedQuestion }}
                </div>
                <div class="delete-selected__list">
                    <div
                            class="delete-selected__list-item"
                            v-for="(item, index) in getSelectedDataName"
                            :key="item + 'getSelectedDataName'">
                        <span>{{ index + 1 }}</span> - {{ item }}
                    </div>
                </div>
            </div>

            <div
                    class="g-btn-depressed"
                    @click="modalMode !== 'confirmDeleteSelected' ? deleteOneData() : deleteSelectedData()"
                    depressed-order-modify>
                {{ texts.modalMode.confirmDelete.access }}
            </div>
        </modal>
    </div>
</template>

<script>

    import { $api } from "../api";
    import { PageComponent } from "../shared/page";
    import VueTableDynamic from "../../packages/vue-table/components/VueTableDynamic";
    import Modal from "../components/molecules/Modal";
    import Input from "../components/molecules/Input";
    import FormData from "../components/molecules/FormData";
    import { Validation } from "../validation";
    import Dropdown from "../components/molecules/Dropdown";
    import ChooseMessageTemplate from "../components/molecules/ChooseMessageTemplate";
    import Pagination from "../components/molecules/Pagination";
    import dayJs from "dayjs";
    import { CommonHelperModule } from "../helpers/common.helper.module";

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            VueTableDynamic,
            Modal,
            Pagination,
            ChooseMessageTemplate,
            Dropdown,
            InputComponent: Input
        },
        data: () => ({
            form: {
                message: {
                    value: '',
                    label: 'Сообщение',
                    placeholder: 'Сообщение',
                    type: 'text',
                    validation: [ Validation.required ],
                    defValue: ''
                },
                order_status_id: {
                    value: '',
                    label: 'Статус',
                    placeholder: 'Статус',
                    type: 'text',
                    validation: [ Validation.required ],
                    defValue: ''
                },
            },
            filterFields: {
                page: 1,
                sort_by: 'desc',
                order_status_id: '',
                billing_phone: '',
                billing_email: '',
            },
            statuses: [
                { name: 'Любой статус', id: 0, color: 'white' },
                { name: 'Заказ создан', id: 1, color: 'rgb(237,0,3)' },
                { name: "В обработке", id: 2, color: 'rgba(128,97,16,0.7)' },
                { name: "Отправлен", id: 3, color: '#ffa50073' },
                { name: "Завершен", id: 4, color: 'rgba(0,255,33,0.8)' },
                { name: "Отклонен", id: 5, color: '#ff00008f' },
                { name: "Деньги вернули", id: 6, color: 'rgba(128,53,82,0.63)' },
            ],
            messageTemplates: [],
            modalInfoMode: '',
            info: null
        }),
        methods: {
            $init() {
                this.list = this.$updateList(this.$route.meta?.orders?.data) || [];
                this.messageTemplates = this.$route.meta?.messageTemplates?.data || [];
                this.filterFields = {
                    ...this.filterFields,
                    ...this.$route.query
                }
            },

            $getData() {
                return this.$request.getAll(this.getQuery())
            },

            $getOneData(id) {
                return this.$request.getOne(id)
            },

            $updateOneData() {
                return this.$request.patch(this.selectElement, this.getFormData())
            },

            $deleteOneData() {
                return this.$request.delete(this.selectElement)
            },

            $handleGetData() {
                this.$toast.success(this.texts.handleRequest.$handleGetData);
            },

            $handleUpdateOneData() {
                this.$toast.success(this.texts.handleRequest.$handleUpdateOneData);
            },

            $handleDeleteOneData() {
                this.$toast.success(this.texts.handleRequest.$handleDeleteOneData);
            },

            $handleDeleteSelectedData() {
                this.$toast.success(this.texts.handleRequest.$handleDeleteSelectedData);
            },

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },

            $updateList(data) {
                this.paginate = data || {};
                this.filterFields.page = this.paginate.current_page;
                return (this.paginate?.data || []).map(item => {
                    const address = {
                        'Город:': item.billing_city,
                        'улица:': item.billing_street,
                        'дом:': item.billing_house,
                        'отделение:': item.department,
                        'квартира:': item.billing_apartment,
                    };

                    const key = CommonHelperModule.generateUUID(10);
                    return {
                        order_status_id: item.order_status.id,
                        address: Object.keys(address)
                            .filter(item => !!address[ item ])
                            .map(item => `<span style="color: grey">${ item }</span> ${ address[ item ] } <br/>`)
                            .join(''),
                        grand_total: item.grand_total,
                        billing_user_name: item.billing_user_name,
                        billing_phone: item.billing_phone,
                        message_from_user: item.message_from_user,
                        order_products: item.order_products.map((order_product, index) => ({
                            ...order_product,
                            uuid: key + 'order_products' + index
                        })),
                        message: item.message,
                        billing_email: item.billing_email,
                        payment_type: this.getPaymentType(item.billing_payment_type),
                        billing_delivery_type: this.getBillingType(item.billing_delivery_type),
                        created_at: dayJs(item.created_at).format('DD/MM/YYYY hh:mm a'),
                        id: item.id
                    }
                });
            },

            getPaymentType(status) {
                switch ( status ) {
                    case 1:
                        return 'Наложеный платёж';
                    case 2:
                        return 'Оплата на карту';
                    default:
                        return;
                }
            },
            getBillingType(status) {
                switch ( status ) {
                    case 1:
                        return 'Нова Пошта';
                    case 2:
                        return 'Укр Пошта';
                    case 3:
                        return 'Самовывоз (Запорожье)';
                    case 4:
                        return 'Курьерская доставка';
                    default:
                        return;
                }
            },

            deleteData(props) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[ keyIndex ];

                if (!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;
                this.modalMode = 'confirmDeleteMode'
            },
            checkInfoAboutProject(props) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[ keyIndex ];

                if (!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;
                this.modalInfoMode = 'info';
                this.info = this.list.find(item => item.id === this.selectElement);
            },
            editData(props) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[ keyIndex ];

                if (!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;
                this.setForm(this.list.find(item => item.id === this.selectElement));
                this.modalMode = 'editMode';
            },
        },
        computed: {
            $headers: () => [
                'id',
                'created_at',
                'order_status_id',
                'address',
                'order_products',
                'grand_total',
                'billing_email',
                'billing_user_name',
                'billing_phone',
                'payment_type',
                'billing_delivery_type',
                'message',
                'message_from_user',
                'action'
            ],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts() {
                return this.getTexts('OrdersTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.ordersRequest
        }
    }
</script>

<style lang="scss">
    .page-orders {

        .order-page-info {
            padding-top: 20px;
            div {
                margin-bottom: 10px;
                font-weight: bold;
                span {
                    font-weight: normal;
                }
            }

            table {
                &:nth-child(1) {
                    margin-bottom: 20px;
                    width: 100%;
                    tr {
                        td {
                            width: calc(100% / 2);
                            text-align: left;
                            border-bottom: 1px solid grey;
                        }
                    }
                }
                &:nth-child(2) {
                    width: 100%;
                    tr {

                        td {
                            width: calc(100% / 5);
                            text-align: center;
                            border-bottom: 1px solid grey;
                            border-right: 1px solid grey;
                        }
                    }
                }
            }
        }


        .v-table-dynamic {
            .table-cell {
                min-width: 180px;
                width: 180px;
            }
        }
    }


</style>
