<template>
    <div>
        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>

        <vue-table-dynamic
                :params="params"
                ref="table"
                @selection-change="onSelectionChange">
            <template v-slot:column-3="{ props }">
                <button

                        @click="toFilteringPage(props)"
                >
                    {{ texts.table.filterOptions }}
                </button>
            </template>
            <template v-slot:column-4="{ props }">
                {{ props.cellData && props.cellData[0] ? props.cellData[0].amount : '---'}}
            </template>
            <template v-slot:column-5="{ props }">
                <button
                        @click="discount(props)"
                >
                    {{ props.cellData && props.cellData[0] ? texts.table.editDiscount : texts.table.addDiscount}}
                </button>
            </template>
            <template v-slot:column-6="{ props }">
                <button
                        :style="props.cellData && props.cellData[0] ? 'background: green': 'background: red'"
                        @click="props.cellData && props.cellData[0] && deleteProductDiscount(props.cellData[0])"
                >
                    {{ texts.table.deleteDiscount }}
                </button>
            </template>
            <template v-slot:column-7="{ props }">
                <button

                        @click="editData(props)"
                        >
                    {{ texts.tableActions.edit }}
                </button>
            </template>
            <template v-slot:column-8="{ props }">
                <button

                        @click="deleteData(props)"
                >
                    {{ texts.tableActions.delete }}
                </button>
            </template>
        </vue-table-dynamic>

        <div
                class="g-btn-depressed"
                v-if="selectionIds.length"
                @click="modalMode = 'confirmDeleteSelected'"
                depressed-order-modify>
            {{ texts.deleteSelected }}
        </div>

        <modal
                v-if="modalMode === 'editMode' || modalMode === 'createMode'"
                @close="modalMode = ''"
                width="auto"
                height="auto"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <div v-for="(item, index) in form"
                     :key="item.placeholder + item.type + 'item_category'">
                    <input-component
                            v-model="item.value"
                            :placeholder="item.placeholder"
                            :validation="item.validation"
                            :label="item.label"
                            :type="item.type"
                    >
                    </input-component>
                    <img v-if="index === 'image_link' && item.value" :src="item.value" width="400px">
                </div>


                <div
                        class="g-btn-depressed g-btn__full-size"
                        @click="submit((modalMode === 'createMode' && 'createData') || (modalMode === 'editMode' && 'updateOneData'))"
                        depressed-order-modify>
                    {{ texts.modalMode[modalMode]}}
                </div>
            </form-data>
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

        <modal
                height="300px"
                width="400px"
                :z-index="10001"
                v-if="modalDiscountMode === 'editMode' || modalDiscountMode === 'createMode'"
                @close="modalDiscountMode = '', clearForm('formDiscountContent')"
                :title="texts.discount[modalDiscountMode]">
            <form-data ref="formDiscountDataContent">
                <input-component
                        v-model="formDiscountContent.amount.value"
                        :placeholder="formDiscountContent.amount.placeholder"
                        :validation="formDiscountContent.amount.validation"
                        :label="formDiscountContent.amount.label"
                        :type="formDiscountContent.amount.type"
                >
                </input-component>
                <div class="datapicker-container">
                    <input-component
                            v-model="formDiscountContent.expires_at.value"
                            :placeholder="formDiscountContent.expires_at.placeholder"
                            @click="openPicker()"
                            :validation="formDiscountContent.expires_at.validation"
                            :disabled="formDiscountContent.expires_at.disabled"
                            :label="formDiscountContent.expires_at.label"
                            :type="formDiscountContent.expires_at.type"
                    >
                    </input-component>
                    <datepicker
                            format="yyyy-MMM-dd"
                            ref="formDiscountDataContentDatepicker"
                            @input="formDiscountContent.expires_at.value = formatPicker($event)"
                            :value="formDiscountContent.expires_at.value" name="uniquename">
                    </datepicker>
                </div>
                <button

                        @click="productDiscount(modalDiscountMode === 'editMode')"
                >
                    {{ texts.discount[modalDiscountMode] }}
                </button>
            </form-data>
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
    import Datepicker from "vuejs-datepicker";

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            VueTableDynamic,
            Modal,
            Datepicker,
            InputComponent: Input
        },
        data:() => ({
            form: {
                name: {
                    value: '',
                    label: 'Название',
                    placeholder: 'тестовое название',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                image_link: {
                    value: '',
                    label: 'Картинка',
                    placeholder: 'https://test.png',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
                    defValue: ''
                },
                description: {
                    value: '',
                    label: 'Описание',
                    placeholder: 'Ремни стальные',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                }
            },
            formDiscountContent: {
                amount: {
                    value: '',
                    label: 'Количество',
                    placeholder: '11',
                    type: 'number',
                    validation: [ Validation.required],
                    defValue: ''
                },
                expires_at: {
                    value: '',
                    label: 'Срок действия',
                    placeholder: '',
                    type: 'text',
                    disabled: true,
                    validation: [Validation.required],
                    defValue: ''
                },
                id: {
                    value: '',
                    label: 'id',
                    placeholder: 'id',
                    type: 'text',
                    defValue: ''
                },
            },
            filteringCategories: [],
            modalDiscountMode: ''
        }),
        methods: {
            $init() {
                this.list = this.$updateList(this.$route.meta?.productCategories?.data) || [];
            },

            $getData (query) {
                return this.$request.getAll(query)
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                return this.$request.create(this.getFormData())
            },

            $updateOneData () {
                return this.$request.update(this.selectElement, this.getFormData())
            },

            $deleteOneData () {
                return this.$request.delete(this.selectElement)
            },

            $handleGetData () {
                this.$toast.success(this.texts.handleRequest.$handleGetData);
            },

            $handleCreateData () {
                this.$toast.success(this.texts.handleRequest.$handleCreateData);
            },

            $handleUpdateOneData () {
                this.$toast.success(this.texts.handleRequest.$handleUpdateOneData);
            },

            $handleDeleteOneData () {
                this.$toast.success(this.texts.handleRequest.$handleDeleteOneData);
            },

            $updateList(data){
                return data;
            },

            $setForm({ product_category_options, name, image_link, description }) {
                return {
                    name,
                    image_link,
                    description,
                    filteringCategory: product_category_options
                }
            },

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },

            toFilteringPage(props) {
                const idIndex = this.$headers.findIndex(item => item === 'id');
                const el = props.rowData[idIndex];
                if(idIndex > -1 && el && el.data) {
                    this.$router.push(`/panel/product-categories/${el.data}`)
                }
            },


            discount(props) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[keyIndex];

                if(!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;

                const findRow = this.list.find(item => keyData.data === item.id);


                const discount = findRow?.discounts[0];

                this.modalDiscountMode = 'createMode';

                if(discount) {
                    this.modalDiscountMode = 'editMode';
                    this.setFormLite(discount, 'formDiscountContent')
                }
                this.$toast.success(this.modalDiscountMode === 'createMode'
                    ? this.texts.discountAction.action.creationDiscount
                    : this.texts.discountAction.action.editionDiscount
                );
            },

            productDiscount(isEdit) {

                const test = this.$refs.formDiscountDataContent.getValidation();
                if(test.isValid) {
                    window.startSpinner();
                    this[ !isEdit ? 'createDiscount' : 'editDiscount']()
                        .then(this.getData.bind(this))
                        .then(() => {
                            this.clearForm('formDiscountContent');
                            this.modalDiscountMode = '';
                            this.selectElement = null;
                            window.finishSpinner();


                            this.$toast.success(!isEdit
                                ? this.texts.discountAction.request.createdDiscount
                                : this.texts.discountAction.request.editedDiscount
                            );
                        })
                } else {
                    this.$toast.error(this.texts.errorValidation);
                }
            },

            createDiscount() {
                return this
                    .$api
                    .productsRequest
                    .createProductCategoryDiscount(
                        this.selectElement,
                        this.getFormData(null, 'formDiscountContent')
                    )
            },


            editDiscount() {
                const data = this.getFormData(null, 'formDiscountContent');
                return this
                    .$api
                    .productsRequest
                    .updateProductDiscount(
                        data.id,
                        data
                    )
            },

            deleteProductDiscount(data) {
                window.startSpinner();
                this.$api
                    .productsRequest
                    .deleteProductDiscount(data.id)
                    .then(this.getData.bind(this))
                    .then(window.finishSpinner)
                    .then(() => this.$toast.success(this.texts.discountAction.request.deletedDiscount))
            },

            openPicker() {
                this.$refs.formDiscountDataContentDatepicker.showCalendar();

                this.$nextTick(() => {
                    this.$refs.formDiscountDataContent.$el.parentNode.scrollTo(0, this.$refs.formDiscountDataContent.$el.parentNode.scrollHeight);
                });
            },

            formatPicker(trackedDate){
                const date = new Date(trackedDate);
                return `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
            },
        },
        computed: {
            $headers: () => ['id', 'created_at', 'name', 'filtering',  'discounts', 'discounts', 'discounts', 'action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts(){
                return this.getTexts('ProductCategoriesTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.productCategoriesRequest
        }
    }
</script>
