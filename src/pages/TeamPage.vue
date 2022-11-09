<template>
    <div class="faq-categories-page">
        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>
        <vue-table-dynamic :params="params" ref="table"
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

        <pagination v-model="page" :pageCount="totalPage"></pagination>


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
                :z-index="10001"
                v-if="modalContentMode === 'editMode' || modalContentMode === 'createMode'"
                @close="modalContentMode = '', clearForm('formContent')"
                :title="texts.modalContentMode[modalContentMode]">
            <form-data ref="formDataContent">

                <input-component
                        v-model="formContent.text.value"
                        :placeholder="formContent.text.placeholder"
                        :validation="formContent.text.validation"
                        :label="formContent.text.label"
                        :type="formContent.text.type"
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
                width="auto"
                height="auto"
                :z-index="10001"
                v-if="modalTagsMode === 'editMode' || modalTagsMode === 'createMode'"
                @close="modalTagsMode = '', clearForm('formTags')"
                :title="texts.modalContentMode[modalTagsMode]">
            <form-data ref="formDataTags">

                <input-component
                        v-model="formTags.text.value"
                        :placeholder="formTags.text.placeholder"
                        :validation="formTags.text.validation"
                        :label="formTags.text.label"
                        :type="formTags.text.type"
                >
                </input-component>
                <input-component
                        v-model="formTags.color.value"
                        :placeholder="formTags.color.placeholder"
                        :validation="formTags.color.validation"
                        :label="formTags.color.label"
                        :type="formTags.color.type"
                >
                </input-component>
                <input-component
                        v-model="formTags.background.value"
                        :placeholder="formTags.background.placeholder"
                        :validation="formTags.background.validation"
                        :label="formTags.background.label"
                        :type="formTags.background.type"
                >
                </input-component>
                <button

                        @click="submitTagsData((modalTagsMode === 'createMode' && 'addTagsData') || (modalTagsMode === 'editMode' && 'editTagsData'))"
                >
                    {{ texts.modalContentMode.confirmActionUpdateCreate[modalTagsMode] }}
                </button>
            </form-data>
        </modal>

        <modal
                :z-index="10000"
                height="60vh"
                width="60vw"
                v-if="modalMode === 'editMode' || modalMode === 'createMode'"
                @close="modalMode = '',clearForm()"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <dropdown
                        :options="positionTypes"
                        :value="form.position.value"
                        :validation="form.position.validation"
                        :label="form.position.label"
                        display-name="name"
                        display-value="id"
                        @input="form.position.value = $event">
                </dropdown>
                <input-component
                        v-model="form.first_name.value"
                        :placeholder="form.first_name.placeholder"
                        :validation="form.first_name.validation"
                        :label="form.first_name.label"
                        :type="form.first_name.type"
                >
                </input-component>
                <input-component
                        v-model="form.last_name.value"
                        :placeholder="form.last_name.placeholder"
                        :validation="form.last_name.validation"
                        :label="form.last_name.label"
                        :type="form.last_name.type"
                >
                </input-component>
                <input-component
                        v-model="form.image_link.value"
                        :placeholder="form.image_link.placeholder"
                        :validation="form.image_link.validation"
                        :label="form.image_link.label"
                        :type="form.image_link.type"
                >
                </input-component>
                <img v-if="form.image_link.value" :src="form.image_link.value" width="400px">
                <input-component
                        v-model="form.resource_link.value"
                        :placeholder="form.resource_link.placeholder"
                        :validation="form.resource_link.validation"
                        :label="form.resource_link.label"
                        :type="form.resource_link.type"
                >
                </input-component>
                <input-component
                        v-model="form.email.value"
                        :placeholder="form.email.placeholder"
                        :validation="form.email.validation"
                        :label="form.email.label"
                        :type="form.email.type"
                >
                </input-component>


                <div>
                    <h1>
                        {{ texts.modalMode.content }}
                    </h1>

                    <div>
                        <button

                                @click="modalContentMode = 'createMode'"
                        >
                            {{ texts.tableActions.create }}
                        </button>

                        <table class="table-custom-content">
                            <tr>
                                <th>{{ texts.table.th.text }}</th>
                                <th>
                                    {{ texts.table.th.edit }}
                                </th>
                                <th>
                                    {{ texts.table.th.delete }}
                                </th>
                            </tr>
                            <tr v-for="(item, indData) in form.content.value" :key="item.id">
                                <td>{{ item.text }}</td>

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

                <div>
                    <h1>
                        {{ texts.modalMode.tags }}
                    </h1>

                    <div>
                        <button

                                @click="modalTagsMode = 'createMode'"
                        >
                            {{ texts.tableActions.create }}
                        </button>
                        <table class="table-custom-content">
                            <tr>
                                <th>{{ texts.table.th.text }}</th>
                                <th>{{ texts.table.th.color }}</th>
                                <th>{{ texts.table.th.background }}</th>
                                <th>
                                    {{ texts.table.th.edit }}
                                </th>
                                <th>
                                    {{ texts.table.th.delete }}
                                </th>
                            </tr>
                            <tr v-for="(item, indData) in form.tags.value" :key="item.id">
                                <td>{{ item.text }}</td>
                                <td>{{ item.color }}</td>
                                <td>{{ item.background }}</td>
                                <td>
                                    <button

                                            @click="editTags(item)"
                                    >
                                        {{ texts.tableActions.edit }}
                                    </button>
                                </td>
                                <td>
                                    <button

                                            @click="deleteTagsData(indData)"
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
    import Pagination from "../components/molecules/Pagination";
    import { CommonHelperModule } from "../helpers/common.helper.module";

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            Pagination,
            VueTableDynamic,
            Modal,
            Dropdown,
            InputComponent: Input
        },
        data:() => ({
            form: {
                position: {
                    value: '',
                    label: 'Позиция',
                    placeholder: 'диз',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                first_name: {
                    value: '',
                    label: 'Имя',
                    placeholder: 'тест',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                resource_link: {
                    value: '',
                    label: 'Ссылка на ресурс',
                    placeholder: 'https://test.com',
                    type: 'text',
                    validation: [Validation.link],
                    defValue: ''
                },
                email: {
                    value: '',
                    label: 'Почта',
                    placeholder: 'test@gmail.com',
                    type: 'text',
                    validation: [Validation.email],
                    defValue: ''
                },
                image_link: {
                    value: '',
                    label: 'Фото',
                    placeholder: 'https://test.png',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
                    defValue: ''
                },
                last_name: {
                    value: '',
                    label: 'Фамилия',
                    placeholder: 'тест',
                    validation: [Validation.required],
                    defValue: ''
                },
                content: {
                    value: [],
                    label: 'Контент',
                    placeholder: 'Контент',
                    validation: [Validation.required],
                    defValue: []
                },
                tags: {
                    value: [],
                    label: 'Теги',
                    placeholder: 'Теги',
                    validation: [Validation.required],
                    defValue: []
                }
            },
            formContent: {
                text: {
                    value: '',
                    label: 'Текст',
                    placeholder: 'Текст',
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
            formTags: {
                text: {
                    value: '',
                    label: 'Текст тега',
                    placeholder: 'Текст тега',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                color: {
                    value: '',
                    label: 'цвет',
                    placeholder: 'red',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                background: {
                    value: '',
                    label: 'фон',
                    placeholder: 'red',
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
            modalTagsMode: '',
            blogCategories: [],
            positionTypes: [
                { name: 'Все', id: '' },
                { name: "Дизайнер", id: 'designer' },
                { name: "Разработчик", id: 'developer' },
                { name: "Создатель", id: "owner" },
                { name: "Руководитель", id: "founder" },
                { name: "Аналитик", id: "analyst" },
                { name: "Проджект менеджер", id: "pm" },
                { name: "QA", id: "qa" },
            ]
        }),
        methods: {
            $init() {
                const data = this.$route.meta?.developers?.data;
                this.list = this.$updateList(data);
            },

            $getData () {
                return this.$request.getAll(this.getQuery())
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                return this.$request.create({
                    ...this.getFormData([
                        'position',
                        'first_name',
                        'image_link',
                        'last_name',
                        'resource_link',
                        'email'
                    ]),
                    information: {
                        tags: this.localIDToggle(this.form.tags.value, 'id', 'delete'),
                        content: this.localIDToggle(this.form.content.value, 'id', 'delete'),
                    }
                });
            },

            $updateOneData () {
                return this.$request.update(this.selectElement, {
                    ...this.getFormData([
                        'position',
                        'first_name',
                        'image_link',
                        'last_name',
                        'resource_link',
                        'email'
                    ]),
                    information: {
                        tags: this.localIDToggle(this.form.tags.value, 'id', 'delete'),
                        content: this.localIDToggle(this.form.content.value, 'id', 'delete'),
                    }
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

            $handleDeleteSelectedData () {
                this.$toast.success(this.texts.handleRequest.$handleDeleteSelectedData);
            },

            addContentData() {
                this.form.content.value.push({
                    text: this.formContent.text.value,
                    id: CommonHelperModule.generateUUID(10),
                });
                this.clearForm('formContent');
                this.modalContentMode = '';
                this.$toast.success(this.texts.handleActionContent.addContentData);
            },
            addTagsData() {
                this.form.tags.value.push({
                    text: this.formTags.text.value,
                    color: this.formTags.color.value,
                    background: this.formTags.background.value,
                    id: CommonHelperModule.generateUUID(10),
                });
                this.clearForm('formTags');
                this.modalTagsMode = '';
                this.$toast.success(this.texts.handleActionContent.addContentData);
            },

            deleteContentData(index) {
                this.$toast.success(this.texts.handleActionContent.deleteContentData);
                this.form.content.value.splice(index, 1)
            },
            deleteTagsData(index) {
                this.$toast.success(this.texts.handleActionContent.deleteContentData);
                this.form.tags.value.splice(index, 1)
            },

            submitContentData (funcName) {
                const test = this.$refs.formDataContent.getValidation();
                if(test.isValid) {
                    this[funcName] && this[funcName]();
                } else {
                    this.$toast.error(this.texts.errorValidation);
                }
            },

            submitTagsData (funcName) {
                const test = this.$refs.formDataTags.getValidation();
                if(test.isValid) {
                    this[funcName] && this[funcName]();
                } else {
                    this.$toast.error(this.texts.errorValidation);
                }
            },

            editContent(data) {
                this.modalContentMode = 'editMode';
                this.formContent.text.value = data.text;
                this.formContent.id.value = data.id;
                this.$toast.warning(this.texts.handleActionContent.editContent);
            },
            editTags(data) {
                this.modalTagsMode = 'editMode';
                this.formTags.text.value = data.text;
                this.formTags.color.value = data.color;
                this.formTags.background.value = data.background;
                this.formTags.id.value = data.id;
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
            editTagsData() {
                const findData = this.form.tags.value.find((item) => this.formTags.id.value === item.id);

                if(!findData) {
                    return;
                }

                findData.text = this.formTags.text.value;
                findData.color = this.formTags.color.value;
                findData.background = this.formTags.background.value;

                this.modalTagsMode = '';
                this.clearForm('formTags');
                this.$toast.success(this.texts.handleActionContent.editContentData);
            },

            $handleGetOneData(data) {
                this.$nextTick(() => {
                    this.form.content.value = this.localIDToggle(
                        (data.information && data.information.content) || [],
                        'id',
                        'create'
                    );
                    this.form.tags.value = this.localIDToggle(
                        (data.information  && data.information.tags) || [],
                        'id',
                        'create'
                    );
                })
            },

            $updateList(data) {
                return Object
                    .keys(data)
                    .map(item => data[item])
                    .reduce((acc, cur) => acc.concat(cur), []);
            },

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },
        },
        computed: {
            $headers: () => ['id', 'first_name', 'last_name', 'position','created_at', 'action', 'action'],
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
                return this.getTexts('TeamTexts')
            },
            $request: () => $api.developersRequest
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
