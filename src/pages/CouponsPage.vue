<template>
    <div class="page-coupons">
        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>

        <div  class="checkbox">
            {{ texts.notExpired }}
            <input type="checkbox" v-model="filterFields.not_expired">
        </div>
        <div  class="checkbox">
            {{ texts.withTrashed }}
            <input type="checkbox" v-model="filterFields.with_trashed">
        </div>
        <div  class="checkbox">
            {{ texts.onlyTrashed }}
            <input type="checkbox" v-model="filterFields.only_trashed">
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
            <template v-slot:column-6="{ props }">
                <button
                        :style="{background: `${props.cellData ? 'red' : 'green'}`}"
                        @click="editData(props)"
                >
                   {{ props.cellData ? texts.deleted: texts.notDeleted}}
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
                        :disabled="!props.cellData.action"
                        @click="deleteHardData(props.cellData.id)"
                >
                   {{ texts.deleteWithoutRestore }}
                </button>
            </template>
            <template v-slot:column-9="{ props }">
                <button
                        :disabled="!props.cellData.action"
                        @click="deleteSoftData(props.cellData.id)"
                >
                    {{ texts.deleteWithRestore }}
                </button>
            </template>
            <template v-slot:column-10="{ props }">
                <button
                        :disabled="!props.cellData.action"
                        @click="restoreData(props.cellData.id)"
                >
                    {{ texts.restore }}
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
                v-if="modalMode === 'editMode' || modalMode === 'createMode'"
                @close="modalMode = ''"
                :title="texts.modalMode[modalMode]">
            <form-data ref="formData">
                <div v-for="(item, index) in form" :key="index + 'forms'">
                    <input-component
                            v-if="index !== 'expires_at'"
                            v-model="item.value"
                            :placeholder="item.placeholder"
                            :validation="item.validation"
                            :disabled="item.disabled"
                            :label="item.label"
                            :type="item.type"
                    >
                    </input-component>
                </div>
                <div class="datapicker-container">
                    <input-component
                            v-model="form.expires_at.value"
                            :placeholder="form.expires_at.placeholder"
                            @click="openPicker()"
                            :validation="form.expires_at.validation"
                            :disabled="form.expires_at.disabled"
                            :label="form.expires_at.label"
                            :type="form.expires_at.type"
                    >
                    </input-component>
                    <datepicker
                            format="yyyy-MMM-dd"
                            ref="test"
                            @input="form.expires_at.value = formatPicker($event)"
                            :value="form.expires_at.value" name="uniquename">
                    </datepicker>
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
                    @click="modalMode !== 'confirmDeleteSelected'
                       ? deleteWithoutRestoreData([selectElement])
                       : deleteWithoutRestoreData(selectionIdsWithCanDelete)"
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
    import Pagination from "../components/molecules/Pagination";
    import Datepicker from "vuejs-datepicker";

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            VueTableDynamic,
            Modal,
            Pagination,
            Datepicker,
            InputComponent: Input
        },
        data:() => ({
            form: {
                name: {
                    value: '',
                    label: 'Название',
                    placeholder: 'тестовое',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                cost: {
                    value: '',
                    label: 'Стоимость',
                    placeholder: '1',
                    type: 'number',
                    validation: [Validation.required],
                    defValue: ''
                },
                discount: {
                    value: '',
                    label: 'Акция',
                    placeholder: '1',
                    type: 'number',
                    validation: [Validation.required],
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
            },
            filterFields: {
                not_expired: '',
                with_trashed: '',
                only_trashed: '',
            }
        }),
        methods: {
            $init() {
                this.filterFields = {
                    ...this.filterFields,
                    ...this.$route.query,
                };

                this.list = this.$updateList(this.$route.meta?.coupons?.data);
            },

            $getData () {
                return this.$request.getAll(this.getQuery())
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                return this.$request.create({
                    ...this.getFormData(),
                    expires_at: this.formatPicker(this.form.expires_at.value)
                });
            },

            $updateOneData () {
                return this.$request.update(this.selectElement, {
                    ...this.getFormData(),
                    expires_at: this.formatPicker(this.form.expires_at.value)
                })
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

            $updateList(data) {
                this.paginate = data || {};
                this.filterFields.page = this.paginate.current_page;
                return (this.paginate?.data || []).map(item => ({
                    ...item,
                    isCanRestore: {
                        action:  !!item.deleted_at,
                        id: item.id
                    },
                    isCanHardDelete: {
                        action:  !!item.deleted_at,
                        id: item.id
                    },
                    isCanSoftDelete: {
                        action:  !item.deleted_at,
                        id: item.id
                    }
                }));
            },
            formatPicker(trackedDate){
                const date = new Date(trackedDate);
                return `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
            },
            deleteWithoutRestoreData(ids) {
                window.startSpinner();
                this.$request
                   .hightDeleteCoupons(ids)
                   .then(this.getData.bind(this))
                   .then(() => {
                       this.modalMode = '';
                       this.selectElement = null;
                       this.$toast.success(this.texts.handleRequest.$handleDeleteWithoutRestoreData);
                   })
            },
            restoreData(id) {
                window.startSpinner();
                this.$request
                    .restoreCoupons(id)
                    .then(this.getData.bind(this))
                    .then(() => this.$toast.success(this.texts.handleRequest.$handleRestoreData))
            },
            deleteSoftData(id) {
                window.startSpinner();
                this.$request
                    .delete(id)
                    .then(this.getData.bind(this))
                    .then(() => this.$toast.success(this.texts.handleRequest.$handleDeleteSoftData))
            },
            deleteHardData(id) {
                this.selectElement = id;
                this.modalMode = 'confirmDeleteMode';
            },
            openPicker() {
                // debugger
                this.$refs.test.showCalendar()

                this.$nextTick(() => {
                    this.$refs.formData.$el.parentNode.scrollTo(0, this.$refs.formData.$el.parentNode.scrollHeight)
                })
            }

        },
        computed: {
            $headers: () => ['id', 'created_at', 'name', 'cost', 'discount', 'expires_at', 'deleted_at', 'action', 'isCanHardDelete', 'isCanSoftDelete', 'isCanRestore'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts(){
                return this.getTexts('CouponsTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.couponsRequest,
            getSelectedDataNameWithCanDelete () {
                return this.list
                    .filter(item => this.selectionIds.includes(item.id))
                    .filter(item => item.isCanHardDelete.action)
                    .map(item => item[this.$selectedNameFieldForDelete])
                    .filter(item => !!item)
            },
            selectionIdsWithCanDelete () {
                return this.list
                    .filter(item => item.isCanHardDelete.action)
                    .map(item => item.id)
                    .filter(item => !!item)
            }
        }
    }
</script>

<style lang="scss">
    .page-coupons .v-table-dynamic{
        .table-cell {
            min-width: 140px;
        }
    }

    .vdp-datepicker {
        .vdp-datepicker__calendar {
            margin-top: -16px;
        }
        input {
            display: none;
        }
    }
</style>
