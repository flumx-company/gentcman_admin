<template>
    <div class="faq-categories-page">
        <div
                class="g-btn-depressed"
                @click="modalMode = 'createMode'; clearForm()"
                depressed-order-modify>
            {{ texts.createButton }}
        </div>

        <dropdown
                :options="productCategories"
                :value="filterFields.product_category_id"
                label="Категория продукта"
                display-name="name"
                display-value="id"
                @input="filterFields.product_category_id = $event">
        </dropdown>

        <dropdown
                :options="productStatuses"
                :value="filterFields.product_status_id"
                label="Статус продукта"
                display-name="name"
                display-value="id"
                @input="filterFields.product_status_id = $event">
        </dropdown>

        <dropdown
                :options="orderTypes"
                :value="filterFields.order_by"
                label="Возрастание / убывание"
                display-name="name"
                display-value="id"
                @input="filterFields.order_by = $event">
        </dropdown>

        <dropdown
                :options="records"
                :value="filterFields.published"
                label="Опубликовано"
                display-name="name"
                display-value="id"
                @input="filterFields.published = $event">
        </dropdown>
        <input-component
                v-model="filterFields.name"
                placeholder="Название товара"
                label="Имя"
                type="text"
        >
        </input-component>
        <div style="display: flex">
            <input-component
                    v-model="customFilterFields.priceStart"
                    placeholder="200"
                    label="Стартовая цена"
                    type="number"
            >
            </input-component>
            <input-component
                    v-model="customFilterFields.priceFinish"
                    placeholder="600"
                    label="Финишная цена"
                    type="number"
            >
            </input-component>
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
                        class="is-publish-record"
                        :style="{
                        background: props.cellData === 1 ? 'green' : 'red'
                    }">
                    {{ props.cellData === 1 ? 'PUB' :'NO PUB' }}
                </div>
            </template>
            <template v-slot:column-7="{ props }">
                {{ props.cellData && props.cellData[0] ? props.cellData[0].name : '---'}}
            </template>
            <template v-slot:column-8="{ props }">
                {{ props.cellData && props.cellData.name }}
            </template>
            <template v-slot:column-9="{ props }">
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
            <template v-slot:column-10="{ props }">
                {{
                 props.cellData && props.cellData.getDiscount
                    ? props.cellData.getDiscountFromCategory ? `${props.cellData.getDiscount} - дисконт с категории` : props.cellData.getDiscount
                    : '---'
                }}
            </template>
            <template v-slot:column-11="{ props }">
                <button
                        @click="discount(props)"
                        :disabled="props.cellData.getDiscountFromCategory"
                >
                    {{
                     props.cellData && props.cellData.getDiscount  && !props.cellData.getDiscountFromCategory
                        ? texts.table.editDiscount
                        : props.cellData.getDiscountFromCategory ? 'дисконт в категории' : texts.table.addDiscount
                    }}
                </button>
            </template>
            <template v-slot:column-12="{ props }">
                <button
                        :style="{
                            background: props.cellData && props.cellData[0] ? 'green' : 'red'
                        }"
                        :disabled="props.cellData.getDiscountFromCategory"
                        @click="props.cellData && props.cellData.discount && deleteProductDiscount(props.cellData.discount)"
                >
                    {{ props.cellData.getDiscountFromCategory ? 'дисконт в категории' : texts.table.deleteDiscount  }}
                </button>
            </template>
            <template v-slot:column-13="{ props }">
                <button

                        @click="editData(props)"
                >
                    {{ texts.tableActions.edit }}
                </button>
            </template>
            <template v-slot:column-14="{ props }">
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
                :z-index="10001"
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
                <dropdown
                        :options="dataType"
                        :value="formContent.dataType.value"
                        :validation="formContent.dataType.validation"
                        label="dataType"
                        display-name="name"
                        display-value="name"
                        @input="formContent.dataType.value = $event">
                </dropdown>
                <div v-if="formContent.dataType.value === 'number'">
                    <input-component
                            v-model="formContent.valueN.value"
                            :placeholder="formContent.valueN.placeholder"
                            :validation="formContent.valueN.validation"
                            :label="formContent.valueN.label"
                            :type="formContent.valueN.type"
                    >
                    </input-component>
                </div>
                <div v-else-if="formContent.dataType.value === 'string'">
                    <input-component
                            v-model="formContent.valueT.value"
                            :placeholder="formContent.valueT.placeholder"
                            :validation="formContent.valueT.validation"
                            :label="formContent.valueT.label"
                            :type="formContent.valueT.type"
                    >
                    </input-component>
                </div>

                <button
                     @click="submitContentData(
                          (modalContentMode === 'createMode' && 'addContentData') ||
                          (modalContentMode === 'editMode' && 'editContentData')
                     )"
                >
                    {{ texts.modalContentMode.confirmActionUpdateCreate[modalContentMode] }}
                </button>
            </form-data>
        </modal>
        <modal
                height="auto"
                width="auto"
                :z-index="10001"
                v-if="modalImagesMode === 'editMode' || modalImagesMode === 'createMode'"
                @close="modalImagesMode = '', clearForm('formImages')"
                :title="texts.modalImagesMode[modalMode]">
            <form-data ref="formImagesDataContent">
                <input-component
                        v-model="formImages.link.value"
                        :placeholder="formImages.link.placeholder"
                        :validation="formImages.link.validation"
                        :label="formImages.link.label"
                        :type="formImages.link.type"
                >
                </input-component>
                <img v-if="formImages.link.value" :src="formImages.link.value" width="400px">
                <button
                    @click="submitImagesContentData(
                        (modalImagesMode === 'createMode' && 'addImageContentData') ||
                        (modalImagesMode === 'editMode' && 'editImageContentData')
                    )"
                >
                    {{ texts.modalImagesMode.confirmActionUpdateCreate[modalMode] }}
                </button>
            </form-data>
        </modal>

        <modal
                height="300px"
                width="400px"
                :z-index="10001"
                v-if="modalDiscountMode === 'editMode' || modalDiscountMode === 'createMode'"
                @close="modalDiscountMode = '', clearForm('formDiscountContent')"
                :title="modalDiscountMode === 'createMode' ? 'добавить дисконт' : 'обновить дисконт'">
            <form-data ref="formDiscountDataContent">
                <input-component
                        v-model="formDiscountContent.amount.value"
                        :placeholder="formDiscountContent.amount.placeholder"
                        :validation="formDiscountContent.amount.validation"
                        :label="formDiscountContent.amount.label"
                        :type="formDiscountContent.amount.type"
                >
                </input-component>
                <div class="datapicker-container">
                    <input-component
                            v-model="formDiscountContent.expires_at.value"
                            :placeholder="formDiscountContent.expires_at.placeholder"
                            @click="openPicker()"
                            :validation="formDiscountContent.expires_at.validation"
                            :disabled="formDiscountContent.expires_at.disabled"
                            :label="formDiscountContent.expires_at.label"
                            :type="formDiscountContent.expires_at.type"
                    >
                    </input-component>
                    <datepicker
                            format="yyyy-MMM-dd"
                            ref="formDiscountDataContentDatepicker"
                            @input="formDiscountContent.expires_at.value = formatPicker($event)"
                            :value="formDiscountContent.expires_at.value"
                            name="uniquename">
                    </datepicker>
                </div>
                <button

                        @click="productDiscount(modalDiscountMode === 'editMode')"
                >
                    {{ texts.discount[modalDiscountMode] }}
                </button>
            </form-data>
        </modal>
        <modal
                :z-index="10000"
                height="80vh"
                width="80vw"
                v-if="modalMode === 'editMode' || modalMode === 'createMode'"
                @close="modalMode = '',clearForm()"
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

                <vue-editor
                        v-model="form.description.value"
                        @input="form.description.value = $event">
                </vue-editor>
                <input-component
                        v-model="form.description.value"
                        :placeholder="form.description.placeholder"
                        :validation="form.description.validation"
                        :label="form.description.label"
                        :type="form.description.type"
                        :disabled="true"
                >
                </input-component>
                <input-component
                        v-model="form.cost.value"
                        :placeholder="form.cost.placeholder"
                        :validation="form.cost.validation"
                        :label="form.cost.label"
                        :type="form.cost.type"
                >
                </input-component>
                <input-component
                        v-model="form.amount.value"
                        :placeholder="form.amount.placeholder"
                        :validation="form.amount.validation"
                        :label="form.amount.label"
                        :type="form.amount.type"
                >
                </input-component>
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
                <input-component
                        v-model="form.banner_image.value"
                        :placeholder="form.banner_image.placeholder"
                        :validation="form.banner_image.validation"
                        :label="form.banner_image.label"
                        :type="form.banner_image.type"
                >
                </input-component>
                <img v-if="form.banner_image.value" :src="form.banner_image.value" width="400px">
                <input-component
                        v-model="form.product_info_image.value"
                        :placeholder="form.product_info_image.placeholder"
                        :validation="form.product_info_image.validation"
                        :label="form.product_info_image.label"
                        :type="form.product_info_image.type"
                >
                </input-component>
                <img v-if="form.product_info_image.value" :src="form.product_info_image.value" width="400px">
                <dropdown
                    :options="productStatuses"
                    :value="form.status_id.value"
                    :validation="form.status_id.validation"
                    label="Статус продукта"
                    display-name="name"
                    display-value="id"
                    @input="form.status_id.value = $event">
                </dropdown>
                <dropdown
                    :options="productCategories"
                    :value="form.category_ids.value"
                    :validation="form.category_ids.validation"
                    label="Категория продукта"
                    display-name="name"
                    display-value="id"
                    @input="form.category_ids.value = $event">
                </dropdown>
                <div>
                    <h1 >
                        {{ texts.modalMode.content }}
                    </h1>

                    <button

                            @click="modalContentMode = 'createMode'"
                    >
                        {{ texts.tableActions.create }}
                    </button>

                    <table class="table-custom-content">
                        <tr>
                            <th  v-for="item in contentTable" :key="item.value">{{ item.name }}</th>
                        </tr>
                        <tr v-for="(item, indData) in form.content.value" :key="item.id">
                            <td v-for="(c_item) in contentTable" :key="c_item.value + item.id">
                                <div v-if="c_item.value !== 'actions'">{{ item[c_item.value] }} </div>
                                <div v-else>
                                    <button

                                            @click="editContent(item)"
                                    >
                                        {{ texts.tableActions.edit }}
                                    </button>
                                    <button

                                            @click="deleteContentData(indData)"
                                    >
                                        {{ texts.tableActions.delete }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div>
                        <h1 >
                            {{ texts.modalMode.images }}
                        </h1>

                        <button

                                @click="modalImagesMode = 'createMode'"
                                v-if="form.images_content.value.length < 10"
                        >
                            {{ texts.modalImagesMode.createMode }}
                        </button>

                        <table class="table-custom-content">
                            <tr>
                                <th  v-for="item in contentImagesTable" :key="item.value">{{ item.name }}</th>
                            </tr>
                            <tr v-for="(item, indData) in form.images_content.value" :key="item.id">
                                <td v-for="(c_item) in contentImagesTable" :key="c_item.value + item.id">
                                    <div v-if="c_item.value === 'main'">
                                       <button :style="{background: item[c_item.value] ? 'red' : 'inherit'}" @click="checkImageAsMain(indData)">
                                           main
                                       </button>
                                    </div>
                                    <img
                                            v-else-if="c_item.value === 'link'"
                                            :src="item[c_item.value]"
                                            width="100px">
                                    <div
                                            v-else-if="c_item.value !== 'actions' && c_item.value !== 'link'">
                                        {{ item[c_item.value] }}
                                    </div>
                                    <div v-else>
                                        <button

                                                @click="editImageContent(item)"
                                        >
                                            {{ texts.tableActions.edit }}
                                        </button>
                                        <button

                                                @click="form.images_content.value.splice(indData, 1)"
                                        >
                                            {{ texts.tableActions.delete }}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </table>
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
    import { CommonHelperModule } from "../helpers/common.helper.module";
    import Datepicker from "vuejs-datepicker";
    import VueEditor from "../components/molecules/VueEditor";

    const getDiscountFromCategory = (product) => {
        return product && product.product_categories[0].discounts && product.product_categories[0].discounts[ 0 ] && product.product_categories[0].discounts[ 0 ].amount
    };

    const getDiscount = (product) =>{
        return getDiscountFromCategory(product) || (product.discounts && product.discounts[ 0 ] && product.discounts[ 0 ].amount)
    };

    export default {
        mixins: [ PageComponent ],
        components: {
            FormData,
            Pagination,
            VueTableDynamic,
            Modal,
            Dropdown,
            Datepicker,
            VueEditor,
            InputComponent: Input
        },
        data:() => ({
            form: {
                name: {
                    value: '',
                    label: 'Имя',
                    placeholder: 'ремень',
                    type: 'text',
                    validation: [Validation.required, Validation.maxLength(255)],
                    defValue: ''
                },
                cost: {
                    value: 15,
                    label: 'Стоимость',
                    placeholder: '15',
                    type: 'number',
                    validation: [Validation.required],
                    defValue: 1
                },
                amount: {
                    value: 1,
                    label: 'Количество',
                    placeholder: '10',
                    type: 'number',
                    validation: [Validation.required],
                    defValue: 1
                },
                description: {
                    value: '',
                    label: 'Описание',
                    placeholder: 'тестовый ремень',
                    type: 'textarea',
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
                banner_image: {
                    value: '',
                    label: 'Заглавная картинка',
                    placeholder: 'https://test.png',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
                    defValue: ''
                },
                product_info_image: {
                    value: '',
                    label: 'Картинка на продукте картинка',
                    placeholder: 'https://test.png',
                    type: 'text',
                    validation: [Validation.required, Validation.link],
                    defValue: ''
                },
                status_id: {
                    value: '',
                    label: 'Статус продукта',
                    placeholder: '1',
                    type: 'text',
                    validation: [Validation.required],
                    defValue: ''
                },
                category_ids: {
                    value: '',
                    label: 'Категория продукта',
                    placeholder: 'Категория продукта',
                    type: 'text',
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
                images_content: {
                    value: [],
                    label: 'Контент картинок',
                    placeholder: 'Контент картинок',
                    validation: [Validation.required],
                    defValue: []
                },
                published: {
                    value: false,
                    label: 'published',
                    placeholder: 'published',
                    defValue: false
                },
            },
            formContent: {
                name: {
                    value: '',
                    label: 'Имя',
                    placeholder: 'name',
                    type: 'text',
                    validation: [ Validation.required ],
                    defValue: ''
                },
                valueN: {
                    value: 1,
                    label: 'Значение число',
                    placeholder: '1',
                    type: 'number',
                    validation: [ Validation.required ],
                    defValue: 1
                },
                valueT: {
                    value: '',
                    label: 'Значение текст',
                    placeholder: 'тестовый текст',
                    type: 'text',
                    validation: [ Validation.required ],
                    defValue: ''
                },
                dataType: {
                    value: 'number',
                    label: 'Тип данных',
                    placeholder: 'Номер',
                    type: 'text',
                    validation: [ Validation.required ],
                    defValue: 'number'
                },
                id: {
                    value: '',
                    label: 'id',
                    placeholder: 'id',
                    type: 'text',
                    defValue: ''
                },
            },
            formImages: {
                link: {
                    value: '',
                    label: 'Имя',
                    placeholder: 'Имя',
                    type: 'text',
                    validation: [ Validation.required, Validation.link],
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
            formDiscountContent: {
                amount: {
                    value: '',
                    label: 'Количество',
                    placeholder: 'Количество',
                    type: 'number',
                    validation: [ Validation.required],
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
                id: {
                    value: '',
                    label: 'id',
                    placeholder: 'id',
                    type: 'text',
                    defValue: ''
                },
            },
            filterFields: {
                product_category_id:  '',
                product_status_id:  '',
                order_by:  '',
                name:  '',
                published: '',
            },
            customFilterFields: {
                priceStart: '',
                priceFinish: ''
            },
            productCategories: [],
            productStatuses: [],
            orderTypes: [
                { name: 'Все', id: '' },
                { name: "desc", id: 1 },
                { name: "asc", id: 2 },
            ],
            genderTypes: [
                { name: 'Все', id: '' },
                { name: "Мужчина", id: "Мужчина" },
                { name: "Женщина", id: "Женщина" },
                { name: "Унисекс", id: "Унисекс" },
            ],
            colorTypes: [
                { name: 'Все', id: '' },
                { name: "red", id: "red" },
                { name: "blue", id: "blue" },
                { name: "gray", id: "gray" },
            ],
            dataType: [
                { name: "number", id: 1 },
                { name: "string", id: 2 }
            ],
            contentTable: [
                {name: 'id', value: 'id'},
                {name: 'Имя', value: 'name'},
                {name: 'Тип значения', value: 'dataType'},
                {name: 'Значение', value: 'value'},
                {name: 'Действие', value: 'actions'},
            ],
            contentImagesTable: [
                {name: 'id', value: 'id'},
                {name: 'Сылка', value: 'link'},
                {name: 'Главная картинка', value: 'main'},
                {name: 'Действие', value: 'actions'},
            ],
            modalContentMode :'',
            modalImagesMode :'',
            modalDiscountMode :'',
            records: [
                { name: 'Все', id: '' },
                { name: 'Неопубликованые', id: '0' },
                { name: "опубликованые", id: '1' },
            ]
        }),
        methods: {
            $init() {

                this.list = this.$updateList(this.$route.meta?.products?.data);

                this.productCategories = [
                    { name: 'Все', id: '' },
                    ...(this.$route.meta?.productCategories?.data || [])
                ];
                this.productStatuses = [
                    { name: 'Все', id: '' },
                    ...(this.$route.meta?.productStatuses?.data || [])
                ];

                this.filterFields = {
                    ...this.filterFields,
                    ...this.$route.query
                };
                const [ priceStart, priceFinish ] = this.$route.query.price
                    ? this.$route.query.price.split(',')
                    : [];
                this.customFilterFields.priceStart = priceStart || '';
                this.customFilterFields.priceFinish = priceFinish || '';
            },

            $getData () {
                const { priceStart, priceFinish } = this.customFilterFields;
                const price = priceStart && priceFinish
                    ? `${ priceStart },${ priceFinish }`
                    : '' ;
                return this.$request.getAll({
                    ...this.getQuery(),
                    price
                })
            },

            $getOneData (id) {
                return this.$request.getOne(id)
            },

            $createData () {
                const data = this.getFormData();

                data.content = this.localIDToggle(data.content, 'id', 'delete');
                data.images_content = this.localIDToggle(data.images_content, 'id', 'delete');

                return this.$request.create({
                    ...data,
                    content: data.content.reduce((val, cur) => ({
                        ...val,
                        [cur.name]:cur
                    }), {}),
                    category_ids: [data.category_ids]
                })
            },

            $updateOneData () {
                const data = this.getFormData();

                data.content = this.localIDToggle(data.content, 'id', 'delete');
                data.images_content = this.localIDToggle(data.images_content, 'id', 'delete');

                return this.$request.update(this.selectElement, {
                    ...data,
                    content: data.content.reduce((val, cur) => ({
                        ...val,
                        [cur.name]:cur
                    }), {}),
                    category_ids: [data.category_ids]
                })
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
                        linkPreview: `${process.env.VUE_APP_BASE_URL_PRODUCT_PREVIEW}/${item.id}`,
                        link: `${process.env.VUE_APP_BASE_URL_PRODUCT}/${item.id}`
                    },
                    discounts: {
                        getDiscount: getDiscount(item),
                        getDiscountFromCategory: getDiscountFromCategory(item),
                        discount: item.discounts[0]
                    }
                }));
            },

            addContentData() {
                this.form.content.value.push({
                    name: this.formContent.name.value,
                    id: CommonHelperModule.generateUUID(10),
                    dataType: this.formContent.dataType.value,
                    value: this.formContent[this.formContent.dataType.value === 'number' ? 'valueN' : 'valueT'].value
                });
                this.clearForm('formContent');
                this.modalContentMode = '';
                this.$toast.success(this.texts.handleActionContent.addContentData);
            },
            addImageContentData() {
                this.form.images_content.value.push({
                    link: this.formImages.link.value,
                    id: CommonHelperModule.generateUUID(10),
                });
                this.clearForm('formImages');
                this.modalImagesMode = '';
                this.$toast.success(this.texts.handleActionContent.addContentData);
            },
            editContent(data) {
                this.modalContentMode = 'editMode';
                this.formContent.name.value = data.name;
                this.formContent.dataType.value = data.dataType;
                this.formContent.id.value = data.id;
                this.formContent[data.dataType === 'number' ? 'valueN' : 'valueT'].value = data.value;
                this.$toast.warning(this.texts.handleActionContent.editContent);
            },
            deleteContentData(index) {
                this.$toast.success(this.texts.handleActionContent.deleteContentData);
                this.form.content.value.splice(index, 1)
            },
            editImageContent(data) {
                this.modalImagesMode = 'editMode';
                this.formImages.id.value = data.id;
                this.formImages.link.value = data.link;
                this.$toast.warning(this.texts.handleActionContent.editContent);
            },
            editImageContentData() {
                const findData = this.form.images_content.value.find((item) => this.formImages.id.value === item.id);
                if(!findData) {
                    return;
                }
                findData.link = this.formImages.link.value;

                this.modalImagesMode = '';
                this.clearForm('formImages');
                this.$toast.success(this.texts.handleActionContent.editContentData);
            },
            editContentData() {
                const findData = this.form.content.value.find((item) => this.formContent.id.value === item.id);
                if(!findData) {
                    return;
                }
                findData.name = this.formContent.name.value;
                findData.dataType = this.formContent.dataType.value;
                findData.value = this.formContent[this.formContent.dataType.value === 'number' ? 'valueN' : 'valueT'].value;
                this.modalContentMode = '';
                this.clearForm('formContent');
                this.$toast.success(this.texts.handleActionContent.editContentData);
            },
            submitContentData (funcName) {
                const test = this.$refs.formDataContent.getValidation();
                if(test.isValid) {
                    this[funcName] && this[funcName]();
                } else {
                    this.$toast.error(this.texts.errorValidation);
                }
            },
            submitImagesContentData (funcName) {
                const test = this.$refs.formImagesDataContent.getValidation();
                if(test.isValid) {
                    this[funcName] && this[funcName]();
                } else {
                    this.$toast.error(this.texts.errorValidation);
                }
            },
            $setForm(data) {
                return {
                    ...data,
                    status_id: data.product_status_id,
                    category_ids: data.product_categories[0] && data.product_categories[0].id,
                    content:  this.localIDToggle(
                        Object
                            .keys(data.content)
                            .map((item) => data.content[item]),
                        'id',
                        'create'
                    ),
                    images_content: this.localIDToggle(data.images_content, 'id', 'create')
                };
            },

            checkImageAsMain(index) {
                this.form.images_content.value = this.form.images_content.value.map((item) => ({
                    ...item,
                    main: false
                }));
                this.form.images_content.value[index].main = true;
            },


            $deleteSelectedData() {
                return this.$request.deleteSelected(this.selectionIds)
            },

            discount(props) {
                const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
                const keyData = props.rowData[keyIndex];

                if(!keyData) {
                    return console.error('there is no data with such a $keyName')
                }

                this.selectElement = keyData.data;

                const findRow = this.list.find(item => keyData.data === item.id);


                const discount = findRow?.discounts[0];

                this.modalDiscountMode = 'createMode';

                if(discount) {
                    this.modalDiscountMode = 'editMode';
                    this.setFormLite(discount, 'formDiscountContent')
                }

                this.$toast.success(this.modalDiscountMode === 'createMode'
                    ? this.texts.discountAction.action.creationDiscount
                    : this.texts.discountAction.action.editionDiscount
                );
            },

            productDiscount(isEdit) {

                const test = this.$refs.formDiscountDataContent.getValidation();
                if(test.isValid) {
                    window.startSpinner();
                    this[ !isEdit ? 'createDiscount' : 'editDiscount']()
                        .then(this.getData.bind(this))
                        .then(() => {
                            this.clearForm('formDiscountContent');
                            this.modalDiscountMode = '';
                            this.selectElement = null;
                            window.finishSpinner();

                            this.$toast.success(!isEdit
                                ? this.texts.discountAction.request.createdDiscount
                                : this.texts.discountAction.request.editedDiscount
                            );

                        })
                } else {
                    this.$toast.error(this.texts.errorValidation);
                }
            },

            createDiscount() {
                return this
                    .$request
                    .createProductDiscount(
                        this.selectElement,
                        this.getFormData(null, 'formDiscountContent')
                    )
            },


            editDiscount() {
                const data = this.getFormData(null, 'formDiscountContent');
                return this
                    .$request
                    .updateProductDiscount(
                        data.id,
                        data
                    )
            },

            deleteProductDiscount(data) {
                window.startSpinner();
                this.$request
                    .deleteProductDiscount(data.id)
                    .then(this.getData.bind(this))
                    .then(window.finishSpinner)
                    .then(() => this.$toast.success(this.texts.discountAction.request.deletedDiscount))
            },

            openPicker() {
                this.$refs.formDiscountDataContentDatepicker.showCalendar();

                this.$nextTick(() => {
                    this.$refs.formDiscountDataContent.$el.parentNode.scrollTo(0, this.$refs.formDiscountDataContent.$el.parentNode.scrollHeight);
                });
            },
            formatPicker(trackedDate){
                const date = new Date(trackedDate);
                return `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
            },

            $handleDeleteSelectedData () {
                this.$toast.success(this.texts.handleRequest.$handleDeleteSelectedData);
            },

        },
        computed: {
            $headers: () => ['id', 'published', 'amount', 'created_at', 'cost','description', 'name',
                'product_categories','product_status','links', 'discounts', 'discounts', 'discounts', 'action', 'action'],
            $keyName: () => 'id',
            $standartPagination: () => false,
            $request: () => $api.productsRequest,
            texts(){
                return this.getTexts('ProductTexts')
            },
            $selectedNameFieldForDelete: () => 'name',
            $params: () => ({
                showCheck: true
            })
        }
    }

</script>
<style lang="scss">
    .vdp-datepicker {
        .vdp-datepicker__calendar {
            margin-top: -16px;
        }
        input {
            display: none;
        }
    }
</style>
