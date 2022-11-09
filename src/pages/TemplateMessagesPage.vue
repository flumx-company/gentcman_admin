<template>
    <div class="faq-categories-page">
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
            <template v-slot:column-2="{ props }">
                <div v-if="props.cellData.length">
                    <div style="margin: 10px 0" v-for="item in props.cellData" :key="item.created_at">
                        <div>name: {{ item.name }}</div>
                        <div>message: <span v-html="item.message"></span></div>
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
                width="auto"
                height="auto"
                :z-index="200"
                v-if="modalContentMode === 'editMode' || modalContentMode === 'createMode'"
                @close="modalContentMode = '', clearForm('formContent')"
                :title="texts.modalContentMode[modalContentMode]">
            <form-data ref="formDataContent">

                <input-component
                        v-model="formContent.name.value"
                        :placeholder="formContent.name.placeholder"
                        :validation="formContent.name.validation"
                        :label="formContent.name.label"
                        :type="formContent.name.type"
                >
                </input-component>
                <input-component
                        v-model="formContent.message.value"
                        :placeholder="formContent.message.placeholder"
                        :validation="formContent.message.validation"
                        :label="formContent.message.label"
                        :type="formContent.message.type"
                >
                </input-component>
                <button

                        @click="submitContentData((modalContentMode === 'createMode' && 'addContentData') || (modalContentMode === 'editMode' && 'editContentData'))"
                >
                    {{ texts.modalContentMode.confirmActionUpdateCreate[modalContentMode] }}
                </button>
            </form-data>
        </modal>

        <modal
                :z-index="100"
                height="40vh"
                width="20vw"
                v-if="modalMode === 'editMode' || modalMode === 'createMode'"
                @close="modalMode = '',clearForm()"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <dropdown
                        :options="modelTypes"
                        :value="form.type.value"
                        :validation="form.type.validation"
                        label="type"
                        display-name="name"
                        display-value="id"
                        @input="form.type.value = $event">
                </dropdown>


                <div>
                    <h1>
                        {{ texts.items }}
                    </h1>

                    <div>
                        <button

                                @click="modalContentMode = 'createMode'"
                        >
                            {{ texts.tableActions.create }}
                        </button>
                        <table class="table-custom-content">
                            <tr>
                                <th>{{ texts.table.th.name }}</th>
                                <th>{{ texts.table.th.message }}</th>
                                <th>
                                    {{ texts.table.th.edit }}
                                </th>
                                <th>
                                    {{ texts.table.th.delete }}
                                </th>
                            </tr>
                            <tr v-for="(item, indData) in form.content.value" :key="item.id">
                                <td>{{ item.name }}</td>
                                <td>
                                    {{ item.message }}
                                </td>
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
                <div
                        class="g-btn-depressed"
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
    import { CommonHelperModule } from "../helpers/common.helper.module";

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
                type: {
                    value: '',
                    label: 'Тип',
                    placeholder: 'Тип',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                content: {
                    value: [],
                    label: 'Content',
                    placeholder: 'content',
                    validation: [Validation.required],
                    defValue: []
                },
            },
            formContent: {
                name: {
                    value: '',
                    label: 'Имя',
                    placeholder: 'тест',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                message: {
                    value: '',
                    label: 'Сообщение',
                    placeholder: 'тест',
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
            modalContentMode: '',
            blogCategories: [],
            modelTypes: [
                { name: 'Все', id: '' },
                { name: "Предложение поста", id: 'post_offer' },
                { name: "Предложение улучшения системы", id: "offer_improvement" },
                { name: "Отчет о проблеме", id: "report_problems" },
                { name: "Идеи разработки команды", id: "development_idea" },
                { name: "Ответы на вопросы", id: "faqs" },
                { name: "Заказы", id: "order" },
            ]
        }),
        methods: {
            $init() {
                this.list = this.$route.meta?.messageTemplates?.data || [];
            },

            $getData () {
                return this.$request.getAll(this.getQuery())
            },

            $getOneData (id) {
                return Promise.resolve({
                    data: this.list.find(item => item.id === id)
                })
            },

            $createData () {
                return this.$request.create({
                    ...this.getFormData([
                        'type',
                    ]),
                    items: this.localIDToggle(this.form.content.value, 'id', 'delete')
                });
            },

            $updateOneData () {
                return this.$request.update(this.selectElement, {
                    ...this.getFormData([
                        'type',
                    ]),
                    items: this.localIDToggle(this.form.content.value, 'id', 'delete')
                });
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

            addContentData() {
                this.form.content.value.push({
                    name: this.formContent.name.value,
                    message: this.formContent.message.value,
                    id: CommonHelperModule.generateUUID(10),
                });
                this.clearForm('formContent');
                this.modalContentMode = '';
                this.$toast.success(this.texts.handleActionContent.addContentData);
            },

            deleteContentData(index) {
                this.$toast.success(this.texts.handleActionContent.deleteContentData);
                this.form.content.value.splice(index, 1)
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
                this.formContent.name.value = data.name;
                this.formContent.message.value = data.message;
                this.formContent.id.value = data.id;
                this.$toast.warning(this.texts.handleActionContent.editContent);
            },
            editContentData() {
                const findData = this.form.content.value.find((item) => this.formContent.id.value === item.id);

                if(!findData) {
                    return;
                }

                findData.text = this.formContent.text.value;


                this.modalContentMode = '';
                this.clearForm('formContent');
                this.$toast.success(this.texts.handleActionContent.editContentData);
            },

            $handleGetOneData(data) {
                this.$nextTick(() => {
                    this.form.content.value = this.localIDToggle(
                        data.items,
                        'id',
                        'create'
                    );
                })
            },

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },
        },
        computed: {
            $headers: () => ['id', 'type', 'items', 'created_at', 'action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            $selectedNameFieldForDelete: () => 'first_name',
            $params: () => ({
                showCheck: true
            }),
            blogTypesForCreate() {
                return this.blogTypes.filter(({id}) => !!id)
            },
            texts(){
                return this.getTexts('TemplateMessageTexts')
            },
            $request: () => $api.templateMessagesRequest
        }
    }

</script>

<style lang="scss">
    .faq-categories-page .v-table-dynamic{
        .table-cell {
            min-width: 100px;
            width: 100px;
        }
        .vue-scroll-view > div{
            &:nth-child(n+2){
                .v-table-row {
                    height: auto!important;
                    display: flex!important;
                    align-items: center!important;

                }
            }
        }
    }
</style>
