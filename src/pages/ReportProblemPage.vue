<template>
    <div class="page-report-problem">
        <vue-table-dynamic
                :params="params"
                ref="table"
                @selection-change="onSelectionChange">
            <template v-slot:column-2="{ props }">
                <div  @click="editData(props, 'modalMode')">
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
                <div @click="editData(props, 'modalImagesMode')"
                     style="padding: 10px; cursor: pointer; border-radius: 5px; color: white; background: green"
                     v-if="props.cellData.length">
                    Есть картинки
                </div>
                <div v-else></div>
            </template>

            <template v-slot:column-8="{ props }">
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
                width="800px"
                height="500px"
                :z-index="10001"
                v-if="modalImagesMode === 'checkMode'"
                @close="modalImagesMode = ''"
                title="Просмотреть картинки">
<!--            //texts.modalImagesMode[modalImagesMode]-->
            <div style="width: 100%;display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="width: 32%; padding: 10px; border: 1px solid; " v-for="item in form.images.value"
                    :key="item.id + 'form.images.value'"
                >
                    <img :src="backend_url + item.image_url" width="100%">
                </div>
            </div>
        </modal>

        <modal
                v-if="modalMode === 'editMode'"
                @close="modalMode = ''"
                width="auto"
                height="auto"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <dropdown
                        :options="statuses"
                        :value="form.status.value"
                        label="status"
                        :validation="form.status.validation"
                        display-name="name"
                        display-value="id"
                        @input="form.status.value = $event">
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
                    <choose-message-template :message-templates="messageTemplates" @change="form.message.value = $event">

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
    import ChooseMessageTemplate from "../components/molecules/ChooseMessageTemplate";
    import Pagination from "../components/molecules/Pagination";

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            VueTableDynamic,
            Modal,
            Dropdown,
            Pagination,
            ChooseMessageTemplate,
            InputComponent: Input
        },
        data:() => ({
            backend_url: process.env.VUE_APP_HOST_IMAGE,
            form: {
                message: {
                    value: '',
                    label: 'Сообщение',
                    placeholder: 'сообщ',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                status: {
                    value: '',
                    label: 'Статус',
                    placeholder: 'Статус',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                images: {
                    value: '',
                    label: 'Картинки',
                    placeholder: 'Картинки',
                    type: 'text',
                    validation: [],
                    defValue: []
                },
            },
            filterFields: {
                orderBy: 'desc',
            },
            statuses: [
                { name: 'получено', id: 'received', color: 'rgba(128,128,128,0.2)' },
                { name: "прочитано", id: 'read', color: 'rgba(128,128,128,0.7)' },
                { name: "рассмотрение", id: 'consideration', color: '#ffa50073' },
                { name: "В процессе исп", id: 'in the process of fixing', color: 'rgba(255,165,0,0.8)' },
                { name: "оклонили", id: 'rejected', color: '#ff00008f' },
                { name: "исправлено", id: 'fixed', color: '#008000a1' },
            ],
            messageTemplates: [],
            modalImagesMode: ''
        }),

        methods: {
            $init() {
                this.list = this.$updateList(this.$route.meta?.reportProblem?.data) || [];
                this.messageTemplates = this.$route.meta?.messageTemplates?.data || []
                this.filterFields = {
                    ...this.filterFields,
                    ...this.$route.query,
                }
            },

            $getData () {
                return this.$request.getAll(this.getQuery())
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $updateOneData () {
                return this.$request.patch(this.selectElement, this.getFormData())
            },

            $deleteOneData () {
                return this.$request.delete(this.selectElement)
            },

            $handleGetData () {
                this.$toast.success(this.texts.handleRequest.$handleGetData);
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

            $updateList(data) {
                this.paginate = data || {};
                this.filterFields.page = this.paginate.current_page;
                return this.paginate?.data || [];
            },

            deleteData(props) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[keyIndex];

                if(!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;
                this.modalMode = 'confirmDeleteMode'
            },
            editData(props, modalType) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[keyIndex];

                if(!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;
                this.setForm(this.list.find(item => item.id === this.selectElement));

                if(modalType === 'modalMode') {
                    this.modalMode = 'editMode';
                } else if (modalType === 'modalImagesMode') {
                    this.modalImagesMode = 'checkMode'
                }
            },
        },
        computed: {
            $headers: () => ['id',  'created_at', 'status','images', 'user_email',  'theme',  'content', 'message',   'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts(){
                return this.getTexts('ReportProblemTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.reportProblemRequest
        }
    }
</script>

<style lang="scss">
    .page-report-problem .v-table-dynamic{
        .table-cell {
            min-width: 180px;
        }
    }
</style>
