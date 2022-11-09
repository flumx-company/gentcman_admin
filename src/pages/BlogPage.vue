<template>
    <div class="blog-page">
        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>
        <dropdown
                :options="blogTypes"
                :value="filterFields.type_id"
                label="Тип"
                display-name="name"
                display-value="id"
                @input="filterFields.type_id = $event">
        </dropdown>
        <dropdown
                :options="blogCategories"
                :value="filterFields.category_id"
                label="Категория"
                display-name="name"
                display-value="id"
                @input="filterFields.category_id = $event">
        </dropdown>

        <input-component
                v-model="filterFields.excludeIds"
                placeholder="1,2,3,4"
                label="Исключить записи"
                type="text"
        >
        </input-component>
        <input-component
                v-model="filterFields.limit"
                placeholder="4"
                label="Ограниченое количество на страницу"
                type="number"
        >
        </input-component>
        <input-component
                v-model="filterFields.title"
                placeholder="Название блог айтема"
                label="Имя"
                type="text"
        >
        </input-component>

        <div class="checkbox">
            {{ texts.actual }}
            <input type="checkbox" v-model="filterFields.actual">
        </div>
        <div class="checkbox">
            {{ texts.random }}
            <input type="checkbox" v-model="filterFields.random">
        </div>

        <dropdown
                :options="records"
                :value="filterFields.published"
                label="Опубликовано"
                display-name="name"
                display-value="id"
                @input="filterFields.published = $event">
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
            <template v-slot:column-1="{ props }">
                <div
                    class="is-publish-record"
                    :style="{
                        background: props.cellData === 1 ? 'green' : 'red'
                    }">
                    {{ props.cellData === 1 ? 'PUB' :'NO PUB' }}
                </div>
            </template>
            <template v-slot:column-2="{ props }">
                {{ props.cellData.name }}
            </template>
            <template v-slot:column-6="{ props }">
                {{ props.cellData.name }}
            </template>
            <template v-slot:column-7="{ props }">
                <a
                        target="_blank"
                        class="is-publish-record"
                        :href="props.rowData[1] && props.rowData[1].data === 1? props.cellData.link :props.cellData.linkPreview"
                        :style="{
                            background: props.rowData[1] && props.rowData[1].data === 1 ? 'green' : 'red'
                        }">
                    {{ props.rowData[1] && props.rowData[1].data === 1 ? texts.link.toProduct : texts.link.toPreview}}
                </a>
            </template>
            <template v-slot:column-8="{ props }">
                <button

                        @click="editData(props)"
                        >
                    {{ texts.tableActions.edit }}
                </button>
            </template>
            <template v-slot:column-9="{ props }">
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
                height="80vh"
                width="80vw"
                :z-index="200"
                v-if="modalContentMode === 'editMode' || modalContentMode === 'createMode'"
                @close="modalContentMode = '', clearForm('formContent')"
                :title="texts.modalContentMode[modalContentMode]">
            <form-data ref="formDataContent">

                <dropdown
                        :options="contentType"
                        :value="formContent.type.value"
                        :validation="formContent.type.validation"
                        label="Тип"
                        display-name="name"
                        display-value="id"
                        @input="formContent.type.value = $event">
                </dropdown>

                <div v-if="formContent.type.value === 'html'">
                    <vue-editor
                            v-model="formContent.html.value"
                            @input="formContent.html.value = $event">
                    </vue-editor>
                    <input-component
                            v-model="formContent.html.value"
                            :placeholder="formContent.html.placeholder"
                            :disabled="true"
                            :validation="formContent.html.validation"
                            :label="formContent.html.label"
                            :type="formContent.html.type"
                    >
                    </input-component>
                </div>

                <div v-else-if="formContent.type.value === 'image'">
                    <input-component
                            v-model="formContent.image.value"
                            :placeholder="formContent.image.placeholder"
                            :validation="formContent.image.validation"
                            :label="formContent.image.label"
                            :type="formContent.image.type"
                    >
                    </input-component>
                    <img
                            v-if="formContent.image.value"
                            :src="formContent.image.value"
                            width="400px">
                </div>

                <div v-else-if="formContent.type.value === 'video'">
                    <input-component
                            v-model="formContent.video.value"
                            :placeholder="formContent.video.placeholder"
                            :validation="formContent.video.validation"
                            :label="formContent.video.label"
                            :type="formContent.video.type"
                    >
                    </input-component>
                </div>

                <div
                     class="g-btn-depressed"
                     depressed-order-modify
                     @click="submitContentData(
                         (modalContentMode === 'createMode' && 'addContentData') ||
                         (modalContentMode === 'editMode' && 'editContentData')
                     )"
                >
                    {{ texts.modalContentMode.confirmActionUpdateCreate[modalContentMode] }}
                </div>
            </form-data>
        </modal>

        <modal
                :z-index="100"
                height="80vh"
                width="50vw"
                v-if="modalMode === 'editMode' || modalMode === 'createMode'"
                @close="modalMode = '',clearForm()"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <dropdown
                        :options="blogCategories"
                        :value="form.category_id.value"
                        :validation="form.category_id.validation"
                        label="Категория"
                        display-name="name"
                        display-value="id"
                        @input="form.category_id.value = $event">
                </dropdown>
                <dropdown
                        :options="blogTypes"
                        :value="form.type_id.value"
                        :validation="form.type_id.validation"
                        label="Тип"
                        display-name="name"
                        display-value="id"
                        @input="form.type_id.value = $event">
                </dropdown>
                <input-component
                        v-model="form.title.value"
                        :placeholder="form.title.placeholder"
                        :validation="form.title.validation"
                        :label="form.title.label"
                        :type="form.title.type"
                >
                </input-component>
                <input-component
                        v-model="form.short_content.value"
                        :placeholder="form.short_content.placeholder"
                        :validation="form.short_content.validation"
                        :label="form.short_content.label"
                        :type="form.short_content.type"
                >
                </input-component>
                <input-component
                        v-model="form.image_title.value"
                        :placeholder="form.image_title.placeholder"
                        :validation="form.image_title.validation"
                        :label="form.image_title.label"
                        :type="form.image_title.type"
                >
                </input-component>
                <img
                        v-if="form.image_title.value"
                        :src="form.image_title.value"
                        width="400px">
                <input-component
                        v-model="form.meta_title.value"
                        :placeholder="form.meta_title.placeholder"
                        :validation="form.meta_title.validation"
                        :label="form.meta_title.label"
                        :type="form.meta_title.type"
                >
                </input-component>
                <input-component
                        v-model="form.meta_description.value"
                        :placeholder="form.meta_description.placeholder"
                        :validation="form.meta_description.validation"
                        :label="form.meta_description.label"
                        :type="form.meta_description.type"
                >
                </input-component>
                <input-component
                        v-model="form.meta_keywords.value"
                        :placeholder="form.meta_keywords.placeholder"
                        :validation="form.meta_keywords.validation"
                        :label="form.meta_keywords.label"
                        :type="form.meta_keywords.type"
                >
                </input-component>
                <div v-if="form.type_id.value">
                    <h1>
                        {{ texts.tableActions.content }}
                    </h1>

                    <div v-if="form.type_id.value === 1">
                        <button

                                @click="modalContentMode = 'createMode'"
                        >
                            {{ texts.tableActions.create }}
                        </button>
                        <table class="table-custom-content">
                            <tr>
                                <th>{{ texts.table.th.type }}</th>
                                <th>
                                    {{ texts.table.th.edit }}
                                </th>
                                <th>
                                    {{ texts.table.th.delete }}
                                </th>
                            </tr>
                            <tr v-for="(item, indData) in form.content.value" :key="item.id">
                                <td>{{ item.type }}</td>
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
                    <div v-else>
                        <input-component
                                v-model="form.content.value.link"
                                :placeholder="form.content.placeholder"
                                :validation="form.content.validation"
                                :label="form.content.label"
                                :type="form.content.type"
                        >
                        </input-component>
                    </div>
                </div>

                <div class="checkbox">
                    {{ texts.publish }}
                    <input type="checkbox" v-model="form.published.value">
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
    import VueEditor from "../components/molecules/VueEditor";
    import { CommonHelperModule } from "../helpers/common.helper.module";
    const BLOG_TYPE_ENUM = {
        POST_TYPE: 1,
        VIDEO_TYPE: 2,
    };

    const postModel =() => {
        return {
            value: [],
            label: 'Контент',
            placeholder: 'content',
            validation: [Validation.required],
            defValue: []
        }
    };

    const videoModel = () => {
        return {
            value: {
                link: ''
            },
            label: 'Контент',
            placeholder: 'content',
            validation: [Validation.required, Validation.link],
            defValue: {
                link: ''
            }
        }
    };

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            Pagination,
            VueTableDynamic,
            Modal,
            VueEditor,
            Dropdown,
            InputComponent: Input
        },
        watch: {
            'form.type_id.value' : {
                deep: true,
                handler(e) {
                    this.setTypeContentModel(e)
                }
            }
        },
        data:() => ({
            form: {
                title: {
                    value: '',
                    label: 'Заголовок',
                    placeholder: 'Тестовое',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                short_content: {
                    value: '',
                    label: 'Описание',
                    placeholder: 'тестовое',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                image_title: {
                    value: '',
                    label: 'Заглавная фотка',
                    placeholder: 'https://test.png',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
                    defValue: ''
                },
                type_id: {
                    value: '',
                    label: 'Тип',
                    placeholder: 'тип',
                    validation: [Validation.required],
                    defValue: ''
                },
                category_id: {
                    value: '',
                    label: 'Категория',
                    placeholder: 'категория',
                    validation: [Validation.required],
                    defValue: ''
                },
                meta_title: {
                    value: '',
                    label: 'Мета - заголовок',
                    placeholder: 'Ремень',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                meta_description: {
                    value: '',
                    label: 'Мета - описание',
                    placeholder: 'Ремень - гладкий',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                meta_keywords: {
                    value: '',
                    label: 'Мета - ключиевые слова',
                    placeholder: 'ремень,гладкий,кожаный,2 метра',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                published: {
                    value: false,
                    label: 'published',
                    placeholder: 'published',
                    defValue: false
                },
                content: {

                }
            },
            formContent: {
                type: {
                    value: '',
                    label: 'Тип',
                    placeholder: 'тип',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                html: {
                    value: '',
                    label: 'Разметка',
                    placeholder: '<p>разметка</p>',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                image: {
                    value: '',
                    label: 'Картинка',
                    placeholder: 'https://test.png',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
                    defValue: ''
                },
                video: {
                    value: '',
                    label: 'Видео',
                    placeholder: 'https://test.mp4',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
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
            filterFields: {
                type_id:  '',
                category_id:  '',
                excludeIds:  '',
                limit:  10,
                title:  '',
                actual: false,
                published: false,
                random: false
            },
            modalContentMode: '',
            blogCategories: [],
            blogTypes: [
                { name: 'Все', id: '' },
                { name: "Статья", id: 1 },
                { name: "Видео", id: 2 },
            ],
            contentType: [
                { name: 'Все', id: '' },
                { name: 'Картинка', id: 'image' },
                { name: "Разметка", id: 'html' },
                { name: "Видео", id: 'video' },
            ],
            records: [
                { name: 'Все', id: '' },
                { name: 'Неопубликованые', id: '0' },
                { name: "Опубликованые", id: '1' },
            ]
        }),
        methods: {
            setTypeContentModel(e) {
                switch ( e ) {
                    case BLOG_TYPE_ENUM.POST_TYPE: this.form.content = postModel();
                        return;
                    case BLOG_TYPE_ENUM.VIDEO_TYPE: this.form.content = videoModel();
                        return;
                }
            },
            $init() {

                this.list = this.$updateList(this.$route.meta?.blog?.data);

                this.blogCategories = [
                    { name: 'Все', id: '' },
                    ...(this.$route.meta?.blogCategories?.data || [])
                ];

                this.filterFields = {
                    ...this.filterFields,
                    ...this.$route.query,
                    actual: !!(this.$route.query.actual === 'true'),
                    published: this.$route.query.published,
                    random: !!(this.$route.query.random === 'true')
                };
            },

            $getData () {
                const query = this.getQuery();
                return this.$request.getAll({
                    ...query,
                    title: query.title ? encodeURIComponent(query.title) : ''
                })
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                const data = this.getFormData();

                if (data.type_id === BLOG_TYPE_ENUM.POST_TYPE) {
                    data.content = this.localIDToggle(data.content, 'id', 'delete');
                }

                return this.$request.create(data)
            },

            $updateOneData () {
                const data = this.getFormData();

                if (data.type_id === BLOG_TYPE_ENUM.POST_TYPE) {
                    data.content = this.localIDToggle(data.content, 'id', 'delete');
                }

                return this.$request.update(this.selectElement, data)
            },

            $deleteOneData () {
                return this.$request.delete(this.selectElement)
            },

            $handleGetData () {
                this.$toast.success(this.texts.handleRequest.$handleGetData);
            },

            $handleCreateData () {
                this.$toast.success(this.texts.handleRequest.$handleCreateData);
                this.modalMode = '';
                this.clearForm();
            },

            $handleUpdateOneData () {
                this.$toast.success(this.texts.handleRequest.$handleUpdateOneData);
                this.modalMode = '';
                this.selectElement = null;
                this.clearForm();
            },

            $handleDeleteOneData () {
                this.$toast.success(this.texts.handleRequest.$handleDeleteOneData);
                this.modalMode = '';
                this.selectElement = null;
                this.clearForm();
            },

            $updateList(data) {
                this.paginate = data || {};
                this.filterFields.page = this.paginate.current_page;
                return (this.paginate?.data || []).map(item => ({
                    ...item,
                    links: {
                        linkPreview: `${process.env.VUE_APP_BASE_URL_BLOG_PREVIEW}/${item.id}`,
                        link: `${process.env.VUE_APP_BASE_URL_BLOG}/${item.id}`
                    }
                }));
            },

            addContentData() {
                this.form.content.value.push({
                    type: this.formContent.type.value,
                    id: CommonHelperModule.generateUUID(10),
                    data: this.formContent[this.formContent.type.value].value,
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
                this.formContent.type.value = data.type;
                this.formContent[this.formContent.type.value].value = data.data;
                this.formContent.id.value = data.id;
                this.$toast.warning(this.texts.handleActionContent.editContent);
            },
            editContentData() {
                const findData = this.form.content.value.find((item) => this.formContent.id.value === item.id);
                if(!findData) {
                    return;
                }
                findData.type = this.formContent.type.value;
                findData.data = this.formContent[this.formContent.type.value].value;
                this.modalContentMode = '';
                this.clearForm('formContent');
                this.$toast.success(this.texts.handleActionContent.editContentData);
            },

            $handleGetOneData(data) {
                this.$nextTick(() => {
                    this.form.content.value = data.content || []
                })
            },

            $setForm(data) {
                this.setTypeContentModel(data.type_id);
                if (data.type_id === BLOG_TYPE_ENUM.POST_TYPE) {
                    data.content = this.localIDToggle(data.content, 'id', 'create');
                }

                return data;
            },

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },

            $handleDeleteSelectedData() {
                this.$toast.success(this.texts.handleActionContent.$handleDeleteSelectedData);
            }

        },
        computed: {
            $headers: () => ['id', 'published','category', 'created_at', 'short_content','title', 'type', 'links','action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            blogTypesForCreate() {
                return this.blogTypes.filter(({id}) => !!id)
            },
            texts(){
                return this.getTexts('BlogTexts')
            },
            $selectedNameFieldForDelete: () => 'title',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.blogRequest
        }
    }

</script>

<style>
    .blog-page {

    }
</style>
