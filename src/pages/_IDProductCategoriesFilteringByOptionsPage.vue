<template>
    <div>

        {{ texts.nameCategory }} - {{ nameCategory }}

        <br/>
        <br/>

        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>

        <vue-table-dynamic
                :params="params"
                ref="table"
                @selection-change="onSelectionChange">
            <template v-slot:column-3="{ props }">
                <div v-if="props.cellData.length">
                    <div
                         v-for="(item, index) in props.cellData"
                         :key="item.id + 'props.cellData'+ index ">
                        <div>value: {{ item.value }}</div>
                        <br>
                    </div>
                </div>
                <div v-else>
                    --------------
                </div>
            </template>
            <template v-slot:column-4="{ props }">
                <button

                        @click="editData(props)"
                        >
                    {{ texts.tableActions.edit }}
                </button>
            </template>
            <template v-slot:column-5="{ props }">
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
                :z-index="10000"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <input-component
                     v-model="form.option_name.value"
                     :placeholder="form.option_name.placeholder"
                     :validation="form.option_name.validation"
                     :label="form.option_name.label"
                     :type="form.option_name.type"
                >
                </input-component>
                <div >
                    <h1>
                        {{ texts.option }}
                    </h1>

                    <div>
                        <button

                                @click="modalContentMode = 'createMode'"
                        >
                            {{ texts.tableActions.create }}
                        </button>
                        <table class="table-custom-content">
                            <tr>
                                <th>{{ texts.table.th.value }}</th>
                                <th>
                                    {{ texts.table.th.edit }}
                                </th>
                                <th>
                                    {{ texts.table.th.delete }}
                                </th>
                            </tr>
                            <tr v-for="(item, indData) in form.option_values.value" :key="item.id">
                                <td>{{ item.value }}</td>
                                <td>
                                    <button

                                            @click="editContent(item)"
                                    >
                                        {{ texts.tableActions.edit }}
                                    </button>
                                </td>
                                <td>
                                    <button

                                            @click="deleteContentData(indData)"
                                    >
                                        {{ texts.tableActions.delete }}
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <br/>
                <br/>
                <div
                        class="g-btn-depressed"
                        @click="submit((modalMode === 'createMode' && 'createData') || (modalMode === 'editMode' && 'updateOneData'))"
                        depressed-order-modify>
                    {{ texts.modalMode.confirmActionUpdateCreate[modalMode] }}
                </div>
            </form-data>
        </modal>

        <modal
                height="auto"
                width="auto"
                :z-index="10001"
                v-if="modalContentMode === 'editMode' || modalContentMode === 'createMode'"
                @close="modalContentMode = '', clearForm('formContent')"
                :title="texts.modalContentMode[modalContentMode]">
            <form-data ref="formDataContent">
                <input-component
                     v-model="formContent.value.value"
                     :placeholder="formContent.value.placeholder"
                     :validation="formContent.value.validation"
                     :label="formContent.value.label"
                     :type="formContent.value.type"
                >
                </input-component>

                <button

                     @click="submitContentData(
                          (modalContentMode === 'createMode' && 'addContentData') ||
                          (modalContentMode === 'editMode' && 'editContentData')
                     )"
                >
                     {{ texts.modalContentMode.confirmActionUpdateCreate[modalContentMode] }}
                </button>
            </form-data>
        </modal>

        <modal
                v-if="modalMode === 'confirmDeleteMode' || modalMode === 'confirmDeleteSelected'"
                @close="modalMode = ''"
                height="auto"
                width="auto"
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
    import { CommonHelperModule } from "../helpers/common.helper.module";

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            VueTableDynamic,
            Modal,
            InputComponent: Input
        },
        data:() => ({
            form: {
                option_name: {
                    value: '',
                    label: 'Имя опции',
                    placeholder: 'Имя опции',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                option_values: {
                    value: [],
                    label: 'Значение опций',
                    placeholder: 'Значение опций',
                    validation: [Validation.required],
                    defValue: []
                },
            },
            formContent: {
                value: {
                    value: '',
                    label: 'Значение',
                    placeholder: 'Значение',
                    type: 'text',
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
            nameCategory: '',
            modalContentMode: '',
            idCategory: null,
            filteringCategories: []
        }),
        methods: {
            $init() {
                const category = this.$route.meta?.productCategory?.data;
                this.list = this.$updateList(category?.product_category_options || []);
                this.nameCategory = category?.name;
                this.idCategory = category?.id;
            },

            $getData () {
                return this.$api
                    .productCategoriesRequest
                    .getOne(this.idCategory)
                    .then(res => ({
                        data: res.data.product_category_options
                    }))
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                return this.$api
                    .productCategoriesRequest
                    .addFilterOptions(this.idCategory, {
                        option_name: this.form.option_name.value,
                        option_values: this.form.option_values.value.map(({ value }) => ({
                            value
                        }))
                    })

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

            $handleDeleteSelectedData () {
                this.$toast.success(this.texts.handleRequest.$handleDeleteSelectedData);
            },

            $updateList(data){
                return data;
            },

            $setForm({ product_category_option_values, option_name }) {
                return {
                    option_name,
                    option_values: product_category_option_values
                }
            },

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },

            addContentData() {
                this.form.option_values.value.push({
                    id: CommonHelperModule.generateUUID(10),
                    value: this.formContent.value.value,
                });
                this.clearForm('formContent');
                this.modalContentMode = '';
                this.$toast.success(this.texts.handleActionContent.addContentData);
            },

            deleteContentData(index) {
                this.$toast.success(this.texts.handleActionContent.deleteContentData);
                this.form.option_values.value.splice(index, 1)
            },
            submitContentData (funcName) {
                const test = this.$refs.formDataContent.getValidation();
                if(test.isValid) {
                    this[funcName] && this[funcName]();
                } else {
                    this.$toast.error(this.texts.errorValidation);
                }
            },

            editContent(data) {
                this.modalContentMode = 'editMode';
                this.formContent.value.value = data.value;
                this.formContent.id.value = data.id;
                this.$toast.warning(this.texts.handleActionContent.editContent);
            },
            editContentData() {
                const findData = this.form.option_values.value.find((item) => this.formContent.id.value === item.id);

                if(!findData) {
                    return;
                }

                findData.value = this.formContent.value.value;
                this.modalContentMode = '';
                this.clearForm('formContent');
                this.$toast.success(this.texts.handleActionContent.editContentData);
            },
        },
        computed: {
            $headers: () => ['id', 'created_at', 'option_name', 'product_category_option_values', 'action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts(){
                return this.getTexts('ProductCategoriesFilteringTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.productCategoryOptionsRequest
        }
    }
</script>
