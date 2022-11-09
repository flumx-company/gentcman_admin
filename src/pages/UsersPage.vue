<template>
    <div class="faq-categories-page">
        <input-component
                v-model="filterFields.user_name"
                placeholder="имя юзера"
                label="Имя юзер"
        >
        </input-component>
        <input-component
                v-model="filterFields.user_email"
                placeholder="почта юзера"
                label="Почта юзера"
        >
        </input-component>
        <input-component
                v-model="filterFields.user_city"
                placeholder="город проживания"
                label="Город проживания"
        >
        </input-component>

        <div
                class="g-btn-depressed"
                @click="getData()"
                depressed-order-modify>
            {{ texts.filtering }}
        </div>
        <vue-table-dynamic :params="params">
            <template v-slot:column-5="{ props }">
               <input type="checkbox" :checked="props.cellData" disabled>
            </template>
            <template v-slot:column-6="{ props }">
               {{props.cellData ? props.cellData.points : 0 }}
            </template>
            <template v-slot:column-13="{ props }">
               <button @click="editData(props)">
                   {{ texts.toggleBonus }}
               </button>
            </template>
            <template v-slot:column-14="{ props }">
               <button @click="editCouponsData(props)">
                   {{ texts.coupons }}
               </button>
            </template>
        </vue-table-dynamic>

        <pagination v-model="page" :pageCount="totalPage"></pagination>

        <modal
                v-if="modalMode === 'editMode'"
                @close="modalMode = ''"
                width="auto"
                height="auto"
                :title="'edit'">
            <form-data ref="formData">
                <input-component
                        v-model="form.amount.value"
                        :placeholder="form.amount.placeholder"
                        :validation="form.amount.validation"
                        :disabled="form.amount.disabled"
                        :label="form.amount.label"
                        :type="form.amount.type"
                >
                </input-component>
                <dropdown
                        :options="operationTypes"
                        :value="form.operation.value"
                        :validation="form.operation.validation"
                        :label="form.operation.label"
                        display-name="name"
                        display-value="id"
                        @input="form.operation.value = $event">
                </dropdown>
                <div
                        class="g-btn-depressed"
                        @click="updateOneData"
                        depressed-order-modify>
                    {{ texts.edit }}
                </div>
            </form-data>
        </modal>
    </div>
</template>

<script>

    import { $api } from "../api";
    import { PageComponent } from "../shared/page";
    import VueTableDynamic from "../../packages/vue-table/components/VueTableDynamic";
    import Input from "../components/molecules/Input";
    import Pagination from "../components/molecules/Pagination";
    import Dropdown from "../components/molecules/Dropdown";
    import { Validation } from "../validation";
    import Modal from "../components/molecules/Modal";
    import FormData from "../components/molecules/FormData";

    export default {
        mixins: [ PageComponent ],
        components: {
            Dropdown,
            Pagination,
            Modal,
            FormData,
            VueTableDynamic,
            InputComponent: Input
        },
        data:() => ({
            filterFields: {
                user_city:  '',
                user_name:  '',
                user_email: ''
            },
            operationTypes: [
                { name: 'Все', id: '' },
                { name: "Увеличить", id: "increment" },
                { name: "Уменьшить", id: "decrement" },
            ],
            form: {
                amount: {
                    value: '',
                    label: 'Количество',
                    placeholder: 'Количество',
                    type: 'number',
                    validation: [Validation.required],
                    defValue: ''
                },
                operation: {
                    value: '',
                    label: 'Операция',
                    placeholder: 'Операция',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
            },
        }),
        methods: {
            $init() {
                this.list = this.$updateList(this.$route.meta?.users?.data) || [];

                this.filterFields = {
                    ...this.filterFields,
                    ...this.$route.query,
                };
            },

            $getData () {
                return this.$request.getAll({
                    ...this.getQuery(),
                    isAdmin: 0
                })
            },

            $updateList(data) {
                this.paginate = data || {};
                this.filterFields.page = this.paginate.current_page;
                return this.paginate?.data || [];
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $updateOneData () {
                const element = this.list.find(item => item.id === this.selectElement);
                const bonus = (element && element.bonus_points && element.bonus_points.points) || 0;

                const amount = Number(this.form.amount.value);
                const operation = this.form.operation.value;

                if(operation === 'decrement' && (bonus - amount ) < 0) {
                    this.$toast.error(this.texts.lessThenYouHave);
                    return Promise.resolve(true)
                }

                return this
                    .$request
                    .updateBonuses(this.selectElement, {
                        amount,
                        operation
                    })
                    .then(() => this.$toast.error(this.texts.updatedSuccessfully))
            },

            editCouponsData(props) {
                const idIndex = this.$headers.findIndex(item => item === 'id');
                const el = props.rowData[idIndex];
                if(idIndex > -1 && el && el.data) {
                    this.$router.push(`users/${el.data}/manage-coupons`)
                }
            }
        },
        computed: {
            $headers: () => ['id', 'avatar', 'city','country', 'email', 'email_verified_at', 'bonus_points', 'name', 'phone', 'street',  'house',  'apartment', 'surname', 'action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            blogTypesForCreate() {
                return this.blogTypes.filter(({id}) => !!id)
            },
            texts(){
                return this.getTexts('UsersTexts')
            },
            $request: () => $api.usersRequest
        }
    }

</script>
