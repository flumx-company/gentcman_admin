<template>
    <div>
        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>
        <vue-table-dynamic :params="params" ref="table"
                           @selection-change="onSelectionChange">
            <template v-slot:column-3="{ props }">
                <button

                        @click="editData(props)"
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
                        :label="form.name.label"
                        :type="form.name.type"
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
                name: {
                    value: '',
                    label: 'Название',
                    placeholder: 'тестовый статус',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
            }
        }),
        methods: {
            $init() {
                this.list = this.$route.meta?.productStatuses?.data || [];
            },

            $getData (query) {
                return this.$request.getAll(query)
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                return this.$request.create(this.getFormData())
            },

            $updateOneData () {
                if(this.rawOne.name === this.form.name.value) {
                    return Promise.resolve(true)
                }
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

            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },
        },
        computed: {
            $headers: () => ['id', 'created_at', 'name', 'action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            $request: () => $api.productStatusesRequest,
            texts(){
                return this.getTexts('ProductStatusesTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            })
        }
    }
</script>
