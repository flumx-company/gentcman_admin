<template>
    <div>
        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>

        <input-component
                v-model="filterFields.length"
                placeholder="4"
                label="limit"
                type="number"
        >
        </input-component>

        <dropdown
                :options="records"
                :value="filterFields.published"
                label="published"
                display-name="name"
                display-value="id"
                @input="filterFields.published = $event">
        </dropdown>


        <div  class="checkbox">
            {{ texts.random }}
            <input type="checkbox" v-model="filterFields.random_banner">
        </div>

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
                       style="color: white; padding: 10px; border-radius: 10px;"
                       :style="props.cellData === 1 ? 'background: green' : 'background: red'">
                   {{ props.cellData === 1 ? 'PUB' :'NO PUB' }}
               </div>
            </template>
            <template v-slot:column-6="{ props }">
                <a
                        target="_blank"
                        style="color: white; padding: 10px; border-radius: 10px;"
                        :href="props.rowData[1] && props.rowData[1].data === 1? props.cellData.link :props.cellData.linkPreview"
                        :style="props.rowData[1] && props.rowData[1].data === 1 ? 'background: green' : 'background: red'">
                    {{ props.rowData[1] && props.rowData[1].data === 1 ? texts.link.toProduct : texts.link.toPreview}}
                </a>
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
                width="80vh"
                height="80vh"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">


                <input-component
                        v-model="form.link_desktop.value"
                        :placeholder="form.link_desktop.placeholder"
                        :validation="form.link_desktop.validation"
                        :label="form.link_desktop.label"
                        :type="form.link_desktop.type"
                >
                </input-component>
                <input-component
                        v-model="form.link_mobile.value"
                        :placeholder="form.link_mobile.placeholder"
                        :validation="form.link_mobile.validation"
                        :label="form.link_mobile.label"
                        :type="form.link_mobile.type"
                >
                </input-component>
                <input-component
                        v-model="form.description.value"
                        :placeholder="form.description.placeholder"
                        :validation="form.description.validation"
                        :label="form.description.label"
                        :type="form.description.type"
                ></input-component>
                    <input-component
                        v-model="form.button_text.value"
                        :placeholder="form.button_text.placeholder"
                        :validation="form.button_text.validation"
                        :label="form.button_text.label"
                        :type="form.button_text.type"
                >
                </input-component>
                <input-component
                        v-model="form.button_link.value"
                        :placeholder="form.button_link.placeholder"
                        :validation="form.button_link.validation"
                        :label="form.button_link.label"
                        :type="form.button_link.type"
                >
                </input-component>
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
                published: {
                    value: false,
                    label: 'published',
                    placeholder: 'published',
                    defValue: false
                },
                link_mobile: {
                    value: '',
                    label: 'link_mobile',
                    placeholder: 'link_mobile',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
                    defValue: ''
                },
                link_desktop: {
                    value: '',
                    label: 'link_desktop',
                    placeholder: 'link_desktop',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
                    defValue: ''
                },
                button_link: {
                    value: '',
                    label: 'button_link',
                    placeholder: 'button_link',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                button_text: {
                    value: '',
                    label: 'button_text',
                    placeholder: 'button_text',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                description: {
                    value: '',
                    label: 'description',
                    placeholder: 'description',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
            },
            filterFields: {
                length:  '',
                random_banner: false,
                published: false
            },
            templates: [
                { name: 'Все', id: '' },
                { name: 'Шаблон каталога', id: 'catalogTemplate' },
                { name: "Второй", id: 'second_template' },
                { name: "Третий", id: 'third_template' },
            ],
            devices: [
                { name: 'Все', id: '' },
                { name: 'Мобайл', id: 'mobile' },
                { name: "Десктоп", id: 'desktop' },
            ],
            records: [
                { name: 'Все', id: '' },
                { name: 'Неопубликованые', id: '0' },
                { name: "опубликованые", id: '1' },
            ],

            device: '',
            modalContentMode: ''
        }),
        methods: {
            $init() {
                this.list = this.$updateList(this.$route.meta?.banners?.data || []);
            },

            $getData () {
                return this.$request.getAll(this.getQuery())
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                return this.$request.create({
                    published: this.form.published.value,
                    link_desktop: this.form.link_desktop.value,
                    link_mobile: this.form.link_mobile.value,
                    description: this.form.description.value,
                    button_link: this.form.button_link.value,
                    button_text: this.form.button_text.value
                });
            },

            $updateOneData () {
                return this.$request.update(this.selectElement, {
                    published: this.form.published.value,
                    link_desktop: this.form.link_desktop.value,
                    link_mobile: this.form.link_mobile.value,
                    description: this.form.description.value,
                    button_link: this.form.button_link.value,
                    button_text: this.form.button_text.value
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

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },

            $updateList(dataArray) {
                return dataArray.map(item => ({
                    ...item,
                    links: {
                        linkPreview: `${process.env.VUE_APP_BASE_URL_BANNER_PREVIEW}/${item.id}`,
                        link: `${process.env.VUE_APP_BASE_URL_BANNER}/${item.id}`
                    }
                }))
            },
        },
        computed: {
            $headers: () => ['id', 'published', 'created_at', 'link_desktop','link_desktop','description', 'links', 'action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts(){
                return this.getTexts('BannersTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.bannersRequest
        }
    }
</script>
