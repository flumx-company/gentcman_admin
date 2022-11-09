<template>
    <div>
        <div
                class="g-btn-depressed"
                @click="startCreateAdmin; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>

        <input-component
                v-model="filterFields.user_name"
                placeholder="имя юзера"
                label="Имя юзер"
        >
        </input-component>
        <input-component
                v-model="filterFields.user_email"
                placeholder="почта юзера"
                label="Почта юзера"
        >
        </input-component>
        <input-component
                v-model="filterFields.user_city"
                placeholder="город проживания"
                label="Город проживания"
        >
        </input-component>

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
            <template v-slot:column-3="{ props }">
                <button

                        @click="startUpdateAdmin(props)"
                        >
                    {{ texts.tableActions.edit }}
                </button>
            </template>
            <template v-slot:column-4="{ props }">
                <button

                        @click="deleteData(props)"
                >
                    {{ texts.tableActions.delete }}
                </button>
            </template>
        </vue-table-dynamic>

        <pagination  v-model="page" :pageCount="totalPage"></pagination>


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
                <input-component
                        v-model="form.name.value"
                        :placeholder="form.name.placeholder"
                        :validation="form.name.validation"
                        :disabled="form.name.disabled"
                        :label="form.name.label"
                        :type="form.name.type"
                >
                </input-component>
                <input-component
                        v-model="form.email.value"
                        :placeholder="form.email.placeholder"
                        :validation="form.email.validation"
                        :disabled="form.email.disabled"
                        :label="form.email.label"
                        :type="form.email.type"
                >
                </input-component>
                <input-component
                        v-model="form.password.value"
                        :placeholder="form.password.placeholder"
                        :validation="form.password.validation"
                        :disabled="form.password.disabled"
                        :label="form.password.label"
                        :type="form.password.type"
                >
                </input-component>

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
    import Pagination from "../components/molecules/Pagination";

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            VueTableDynamic,
            Modal,
            Pagination,
            InputComponent: Input
        },
        data:() => ({
            form: {
                name: {
                    value: '',
                    label: 'Имя',
                    placeholder: 'тестовое',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                email: {
                    value: '',
                    label: 'Почта',
                    placeholder: '1@gmail.com',
                    type: 'text',
                    validation: [Validation.required,Validation.email],
                    defValue: ''
                },
                password: {
                    value: '',
                    label: 'Пароль',
                    placeholder: '12342342',
                    type: 'text',
                    validation: [],
                    defValue: ''
                },
            },
            filterFields: {
                user_city:  '',
                user_name:  '',
                user_email: ''
            }
        }),
        methods: {
            $init() {
                this.list = this.$updateList(this.$route.meta?.admins?.data) || [];

                this.filterFields = {
                    ...this.filterFields,
                    ...this.$route.query,
                };
            },

            $getData () {
                return this.$request.getAll({
                    ...this.getQuery(),
                    isAdmin: 1
                })
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                return this.$request.createAdmin(this.getFormData());
            },

            $updateOneData () {
                return this.$request.updateAdmin(this.selectElement, this.getFormData())
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

            $updateList(data) {
                this.paginate = data || {};
                this.filterFields.page = this.paginate.current_page;
                return this.paginate?.data || [];
            },

            formatPicker(trackedDate){
                const date = new Date(trackedDate);
                return `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
            },

            startUpdateAdmin (data) {
                this.form.password.validation = [];
                this.editData(data)
            },

            startCreateAdmin () {
                this.form.password.validation = [Validation.required, Validation.minLength(8)];
                this.modalMode = 'createMode'
            }

        },
        computed: {
            $headers: () => ['id',  'email',  'name',  'action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            texts(){
                return this.getTexts('AdminsTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            }),
            $request: () => $api.usersRequest
        }
    }
</script>
