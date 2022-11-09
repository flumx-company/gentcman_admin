<template>
    <div>
        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>

        <dropdown
                :options="categoriesData"
                :value="filterFields.faq_category_id"
                label="Категория вопроса"
                display-name="name"
                display-value="id"
                @input="filterFields.faq_category_id = $event">
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
            <template v-slot:column-5="{ props }">
                <button

                        @click="editData(props)"
                >
                    {{ texts.tableActions.edit }}
                </button>
            </template>
            <template v-slot:column-6="{ props }">
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
                <dropdown
                        :options="categoriesData"
                        :value="form.faq_category_id.value"
                        :validation="form.faq_category_id.validation"
                        :label="form.faq_category_id.label"
                        display-name="name"
                        display-value="id"
                        @input="form.faq_category_id.value = $event">
                </dropdown>
                <input-component
                        v-model="form.question.value"
                        :placeholder="form.question.placeholder"
                        :validation="form.question.validation"
                        :label="form.question.label"
                        :type="form.question.type"
                >
                </input-component>
                <input-component
                        v-model="form.answer.value"
                        :placeholder="form.answer.placeholder"
                        :validation="form.answer.validation"
                        :label="form.answer.label"
                        :type="form.answer.type"
                >
                </input-component>
                <div
                        class="g-btn-depressed g-btn__full-size"
                        @click="submit((modalMode === 'createMode' && 'createData') || (modalMode === 'editMode' && 'updateOneData'))"
                        depressed-order-modify>
                    {{ texts.modalMode.confirmActionUpdateCreate[modalMode] }}
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

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            VueTableDynamic,
            Modal,
            Dropdown,
            InputComponent: Input
        },
        data:() => ({
            form: {
                question: {
                    value: '',
                    label: 'Вопрос',
                    placeholder: 'тестовый вопрос',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                answer: {
                    value: '',
                    label: 'Ответ',
                    placeholder: 'тестовый ответ',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                faq_category_id: {
                    value: '',
                    label: 'Категория вопроса',
                    placeholder: 'Категория',
                    validation: [Validation.required],
                    defValue: ''
                },
            },
            filterFields: {
                faq_category_id: ''
            },
            categoriesData: [],
        }),
        methods: {
            $init() {
                this.categoriesData = [
                    { name: 'Все', id: '' },
                    ...this.$route.meta?.faqCategories?.data || []
                ];
                this.list = this.$updateList(this.$route.meta?.faqSubCategories?.data || []);

                this.filterFields = {
                    ...this.filterFields,
                    ...this.$route.query
                };
            },

            $getData () {
                return this.$request.getAll(this.getQuery())
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

            $handleDeleteSelectedData () {
                this.$toast.success(this.texts.handleRequest.$handleDeleteSelectedData);
            },
            $updateList (list) {
                return list.map((item) => ({
                    ...item,
                    category: this.categoriesData.find(({ id }) => id === item.faq_category_id).name
                }));
            },

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },
        },
        computed: {
            $headers: () => ['id', 'created_at', 'category', 'question', 'answer', 'action', 'action'],
            $keyName: () => 'id',
            $request: () => $api.faqSubCategoriesRequest,
            texts(){
                return this.getTexts('FaqSubCategoriesTexts')
            },
            $selectedNameFieldForDelete: () => 'question',
            $params: () => ({
                showCheck: true
            }),
        }
    }
</script>
