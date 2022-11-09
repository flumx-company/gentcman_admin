<template>
    <div>
        <div v-if="user">
            <div> email - {{ user.email }} </div>
            <div> bonus_points - {{user.bonus_points ? user.bonus_points.points : 0 }} </div>
            <div> name - {{ user.name }} </div>
            <div> coupons - {{ user.coupons.length }} </div>
        </div>


        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'"
                depressed-order-modify>
            Создать Категорию Продукта
        </div>
<!--        TODO text for files-->
        <vue-table-dynamic
                :params="params"
                ref="table"
                @selection-change="onSelectionChange">
            <template v-slot:column-5="{ props }">
                {{ props.cellData && props.cellData.status }}
            </template>
            <template v-slot:column-6="{ props }">
                <button

                        @click="deleteData(props)"
                >
                    удалить
                </button>
            </template>
        </vue-table-dynamic>

        <div
                class="g-btn-depressed"
                v-if="selectionIds.length"
                @click="modalMode = 'confirmDeleteSelected'"
                depressed-order-modify>
            удалить выбранные елементы из списка
        </div>

        <modal
                v-if="modalMode === 'editMode' || modalMode === 'createMode'"
                @close="modalMode = ''"
                :title="(modalMode === 'createMode' && 'Создать Категорию Продукта') ||( modalMode === 'editMode' && 'Изменить Категорию Продукта')">
            <form-data ref="formData">
                <div >
                    <h1>
                       купоны
                    </h1>

                    <div>
                        <button

                                @click="startAddContentData"
                        >
                            создать
                        </button>
                        <table class="table-custom-content">
                            <tr>
                                <th>name</th>
                                <th>
                                    delete
                                </th>
                            </tr>
                            <tr v-for="(item, indData) in form.option_values.value" :key="item.id">
                                <td>{{ item.name }}</td>
                                <td>
                                    <button

                                            @click="deleteContentData(indData)"
                                    >
                                        удалить
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>


                </div>
                <div
                        class="g-btn-depressed"
                        @click="submit((modalMode === 'createMode' && 'createData') || (modalMode === 'editMode' && 'updateOneData'))"
                        depressed-order-modify>
                    {{ modalMode === 'createMode' && 'Создать' || modalMode === 'editMode' && 'Изменить'}}
                </div>
            </form-data>
        </modal>

        <modal
                width="300px"
                height="400px"
                :z-index="10001"
                v-if="modalContentMode === 'createMode'"
                @close="modalContentMode = '', clearForm('formContent')"
                :title="''">
            <form-data ref="formDataContent">


                <dropdown
                        :options="couponsList"
                        :value="formContent.value.value"
                        :validation="formContent.value.validation"
                        label="value"
                        display-name="name"
                        display-value="id"
                        @input="formContent.value.value = $event">
                </dropdown>

                <button

                        @click="submitContentData"
                >
                    да
<!--                    {{ texts.modalContentMode.confirmActionUpdateCreate[modalContentMode] }}-->
                </button>
            </form-data>
        </modal>

        <modal
                v-if="modalMode === 'confirmDeleteMode' || modalMode === 'confirmDeleteSelected'"
                @close="modalMode = ''"
                width="auto"
                height="auto"
                :title="''">

            <div v-if="modalMode !== 'confirmDeleteSelected'"
                 class="delete__title"
            >
                {{ texts.modalMode.confirmDelete.description }}
            </div>

            <div v-else class="delete-selected">
                <div class="delete-selected__title">
                    {{ texts.deleteSelectedQuestion }}
                </div>
                <div  class="delete-selected__list">
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
    import FormData from "../components/molecules/FormData";
    import { Validation } from "../validation";
    import Dropdown from "../components/molecules/Dropdown";

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            VueTableDynamic,
            Modal,
            Dropdown
        },
        data:() => ({
            form: {
                option_name: {
                    value: '',
                    label: 'option_name',
                    placeholder: 'option_name',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                option_values: {
                    value: [],
                    label: 'option_values',
                    placeholder: 'option_values',
                    validation: [Validation.required],
                    defValue: []
                },
            },
            formContent: {
                value: {
                    value: '',
                    label: 'value',
                    placeholder: 'value',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                }
            },
            modalContentMode: '',
            couponsList: [],
            couponsData: [],
        }),
        methods: {
            $init() {
                this.couponsData = this.$route.meta?.coupons?.data;
                this.user = this.$route.meta?.user.data;

                this.list = this.$updateList(this.user?.coupons || []);
            },

            reformatCoupons(data) {
                const ids = this.list
                    .map(({id}) => id)
                    .concat(this.form.option_values.value.map(({id}) => id));

                return data
                    .map(({name, discount, id}) => ({
                        id,
                        name: `${ name } - ${ discount }`
                    }))
                    .filter(({id}) => id && !ids.includes(id))
            },

            $getData () {
                return Promise.all([
                    this.$api.usersRequest.getOne(this.$route.params.id),
                    this.$api.couponsRequest.getAll(),
                ]).then(([res1, res2]) => {

                    this.coupons = res2.data;

                    this.user = res1.data;

                    return {
                        data: this.user?.coupons || [],
                    }
                })
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                return this.$api
                    .usersRequest
                    .addCouponsDataByUserId(this.$route.params.id, {
                        ids: this.form.option_values.value.map(({ id }) => id)
                    })

            },

            $deleteOneData () {
                return this.$api.usersRequest.deleteSelectedCouponsDataByUserId(
                    this.$route.params.id,
                   [],
                   [
                       this.selectElement
                   ]
                )
            },

            $handleGetData () {
                this.$toast.success(this.texts.handleRequest.$handleGetData);
            },

            $handleCreateData () {
                this.$toast.success(this.texts.handleRequest.$handleCreateData);
            },

            $handleDeleteOneData () {
                this.$toast.success(this.texts.handleRequest.$handleDeleteOneData);
            },

            $updateList(data){
                return data;
            },

            $deleteSelectedData() {
                return this.$api.usersRequest.deleteSelectedCouponsDataByUserId(
                    this.$route.params.id,
                    [],
                    this.selectionIds
                )
            },

            startAddContentData () {
                this.couponsList = [
                    { id: '', name: 'Выбирите купон' }
                ].concat(this.reformatCoupons(this.couponsData.data || []));

                this.modalContentMode = 'createMode'
            },

            submitContentData () {
                const test = this.$refs.formDataContent.getValidation();
                if(test.isValid) {
                    this.addContentData();
                } else {
                    this.$toast.error(this.texts.errorValidation);
                }
            },

            addContentData() {

                const id = this.formContent.value.value;
                const el = this.couponsList.find(item => item.id === id);
                // console.log(el)
                this.form.option_values.value.push({
                    id: el.id,
                    name: el.name
                });
                // debugger
                this.clearForm('formContent');
                this.modalContentMode = '';
                this.$toast.success(this.texts.handleActionContent.addContentData);
            },

            deleteContentData(index) {
                this.$toast.success(this.texts.handleActionContent.deleteContentData);
                this.form.option_values.value.splice(index, 1)
            },

            deleteData(props) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[keyIndex];

                if(!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;
                this.modalMode = 'confirmDeleteMode'
            }
        },
        computed: {
            $headers: () => ['id', 'created_at', 'name', 'discount', 'couponable_type', 'pivot', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts(){
                return this.getTexts('ProductCategoriesTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.productCategoryOptionsRequest
        }
    }
</script>
