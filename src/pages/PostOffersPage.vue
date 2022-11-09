<template>
    <div class="page-report-problem">
        <vue-table-dynamic
                :params="params"
                ref="table"
                @selection-change="onSelectionChange">
            <template v-slot:column-2="{ props }">
                <div  @click="editData(props)">
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
            <template v-slot:column-7="{ props }">
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
                v-if="modalMode === 'editMode'"
                @close="modalMode = ''"
                width="auto"
                height="auto"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <dropdown
                        :options="statuses"
                        :value="form.status.value"
                        :validation="form.status.validation"
                        label="status"
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
                    <choose-message-template
                            :message-templates="messageTemplates"
                            @change="form.message.value = $event">
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
            form: {
                message: {
                    value: '',
                    label: 'Сообщение',
                    placeholder: 'полу',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                status: {
                    value: '',
                    label: 'Статус',
                    placeholder: 'полу',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
            },
            statuses: [
                { name: 'получено', id: 'received', color: 'rgba(128,128,128,0.2)' },
                { name: "прочитано", id: 'read', color: 'rgba(128,128,128,0.7)' },
                { name: "рассмотрение", id: 'for consideration', color: '#ffa50073' },
                { name: "в процессе разработки", id: 'taken for implementation', color: 'rgba(255,165,0,0.8)' },
                { name: "оклонили", id: 'rejected', color: '#ff00008f' },
                { name: "реализовано", id: 'implemented', color: '#008000a1' },
            ],
            messageTemplates: []
        }),
        methods: {
            $init() {
                this.list = this.$updateList(this.$route.meta?.postOffers?.data) || [];
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
            editData(props) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[keyIndex];

                if(!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;
                this.setForm(this.list.find(item => item.id === this.selectElement));
                this.modalMode = 'editMode';
            },
        },
        computed: {
            $headers: () => ['id',  'created_at', 'status', 'email',  'theme',  'text', 'message',   'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts(){
                return this.getTexts('BannersTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.postOffersRequest
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
