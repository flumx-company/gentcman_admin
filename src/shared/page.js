import { Texts } from "./text-consts";
import { CommonHelperModule } from "../helpers/common.helper.module";

export const PageComponent = {
    created() {
        this.$init()
    },
    data: () => ({
        paginate: {},
        defaultPage: 1,
        list: [],
        modalMode: '',
        selectElement: null,
        form: {},
        rawOne: {},
        filterFields: {},
        selectionIds: []
    }),
    computed: {
        $headers: () => [],
        $keyName() {
            console.warn('Please implement $keyName computed in component');
            return '';
        },
        $standartPagination() {
            console.warn('Please implement $standartPagination computed in component');
            return true;
        },
        page: {
            get() {
                return (
                    (this.filterFields && Number(this.filterFields.page)) ||
                    this.defaultPage
                );
            },
            set(value) {
                if (this.page === value) return;
                this.filterFields.page = value;
                this.getData(value);
            },
        },
        totalPage() {
            return this.paginate?.last_page || 1;
        },
        params() {
            const listLocal = [];

            this.list.forEach((item) => {
                const arr = [];
                this.$headers.forEach((key) => arr.push(item[key]));
                listLocal.push(arr);
            });


            const $params = typeof this.$params === 'object' ? this.$params : {}

            return {
                data: [
                    this.$headers,
                    ...listLocal
                ],
                header: 'row',
                border: true,
                ...(this.$standartPagination ? {
                    pagination: true,
                    pageSize: 20,
                    pageSizes: [5, 10, 20, 50]
                } : {}),
                ...$params
            }
        },
        getSelectedDataName () {
            return this.list
                .filter(item => this.selectionIds.includes(item.id))
                .map(item => item[this.$selectedNameFieldForDelete])
                .filter(item => !!item)
        }
    },
    methods: {

        getTexts: (name) => Texts[name] || {},

        $init() {
            console.warn('Please implement $init function in component')
        },

        $updateList(list) {
            console.warn('Please implement $init function in component');
            return list;
        },

        submit (funcName) {
            const test = this.$refs.formData.getValidation();
            if(test.isValid) {
                this[funcName] && this[funcName]();
            } else {
                this.$toast.error('Пожалуйста заполните валидно данные'); // TODO
            }
        },

        clearForm(formName = 'form') {
            Object.keys(this[formName]).forEach((key) => {
                const newValue = this[formName][key].defValue;
                this[formName][key].value = typeof newValue === 'object'
                    ? JSON.parse(JSON.stringify(newValue))
                    : newValue;
            })
        },

        clearData() {
            this.modalMode = '';
            this.selectElement = null;
            this.clearForm();
            this.selectionIds = [];
            this.$clearForm();
        },

        $setForm(data) {
            return data;
        },

        $clearForm(data) {
            return data;
        },

        setForm(data, formName = 'form') {
            data = this.$setForm(data);
            this.setFormLite(data, formName)
        },

        setFormLite(data, formName = 'form') {
            Object
                .keys(data)
                .forEach((key) => {

                    if(!this[formName] || !this[formName][key]) {
                        return;
                    }
                    this[formName][key].value = data[key]
                });
        },

        getFormData(properties, formName = 'form') {

            const form  = this[formName];

            if(!form) {
                return {};
            }

            const props = properties && properties.length ? properties : Object.keys(form);

            return props
                .reduce((acc, key) => {
                    return {
                        ...acc,
                        [key]: form[key] && form[key].value
                    }
                }, {});
        },

        localIDToggle (array, fieldName = '', type) {
            if(!Array.isArray(array)) {
                return [];
            }

            const isCreate = type === 'create';
            const isDelete = type === 'delete';

            if(typeof type !== 'string' && (!isDelete || !isCreate)) {
                console.warn('localIDToggle:type', 'type wrong', type);
                return [];
            }

            if(typeof fieldName !== 'string') {
                console.warn('localIDToggle:fieldName', 'fieldName not string', fieldName);
                return array;
            }

            return array.map((item) => {
                if(!item) {
                    return item;
                }

                if(isCreate) {
                    item[fieldName] = CommonHelperModule.generateUUID(10)
                }

                if(isDelete) {
                    delete item[fieldName];
                }

                return item;
            })
        },

        editData(props) {

            const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
            const keyData = props.rowData[keyIndex];

            if(!keyData) {
                return console.error('there is no data with such a $keyName')
            }

            this.getOneData(keyData.data)
                .then(() => {
                    this.modalMode = 'editMode'
                })
        },

        deleteData(props) {
            const keyIndex = this.$headers.findIndex((item) => item.includes(this.$keyName));
            const keyData = props.rowData[keyIndex];

            if(!keyData) {
                return console.error('there is no data with such a $keyName')
            }

            this.getOneData(keyData.data)
                .then(() => {
                    this.modalMode = 'confirmDeleteMode'
                })
        },

        getQuery (cbFilter) {
            const queryObj = typeof this.filterFields === 'object' ? this.filterFields : {};
            const query = Object.keys(queryObj)
                .filter(typeof cbFilter === 'function' ? cbFilter : (item) => !!queryObj[item])
                .reduce( typeof cbFilter === 'function' ? cbFilter : (prev, cur) => ({
                    ...prev,
                    [cur]: queryObj[cur]
                }), {});


            this.$router
                .replace({
                    path: this.$route.path,
                    query
                })
                .catch(err=>err);

            return query;
        },

        onSelectionChange(checkedDatas, checkedIndexs, checkIndex) {
            this.selectionIds = this.$onSelectionChange(checkedDatas, checkedIndexs, checkIndex);
        },

        $onSelectionChange (checkedDatas) {
            const [ headerTable ] = checkedDatas;

            const indexIdColumn = (headerTable || [])
                .findIndex(item => item === 'id');

            return checkedDatas
                .map((item, index) => index > 0 && checkedDatas[index] && checkedDatas[index][indexIdColumn])
                .filter((item) =>  typeof item === 'number')
        },

        /**
         *
         * get paginate list data
         *
         * */

        reformatDetails(message) {
            message = typeof message === 'string'? message : '';

            if(message.includes('already been taken')) {
                return 'такое название уже существует в базе данных, введите уникальное значение';
            }

            if(message.includes('required')) {
                return 'это обязательное поле';
            }

            return message
        },

        $getData() {
            return Promise.reject('Please implement $getData function in component')
        },

        $handleErrorData (res) {
            const data = typeof res === 'object' && typeof res.data === 'object' ? res.data : {};

            if(data.error === 'Validation Error.' || data.error.details === 'Validation Error.') {
                const arrayError = Object
                    .keys(data.error.message)
                    .map((item) => [`Ошибка в поле ${item}`]
                        .concat(
                            data.error.message[item].map(this.reformatDetails)
                        )
                        .join(', ')
                    )
                    .reduce((acc, cur) => acc.concat(cur), []);

                if(arrayError[0]) {
                    this.$toast.error(arrayError[0]);
                }
            }
            return console.warn('Please implement $handleErrorGetData function in component')
        },

        $handleGetData () {
            return console.warn('Please implement $handleErrorGetData function in component')
        },

        async getData () {
            window.startSpinner();
            return this.$getData()
                .then((result) => {
                    this.list = this.$updateList(result.data);
                    this.$handleGetData(result);
                    window.finishSpinner();
                }).catch((error) => {
                    console.error(error);
                    this.$handleErrorData(error);
                    window.finishSpinner();
                });

        },

        /**
         *
         * get data by id
         *
         * */

        $getOneData(id) {
            return Promise.reject(`Please implement $getOneData function in component, get data by Id ${id}`)
        },

        $handleGetOneData () {
            return console.warn('Please implement $handleGetOneData function in component')
        },

        getOneData (id) {
            window.startSpinner();
            return this.$getOneData(id)
                .then((result) => {
                    this.setForm(result.data);
                    this.selectElement = id;
                    this.rawOne = result.data;
                    this.$handleGetOneData(result.data);
                    window.finishSpinner();
                })
                .catch((error) => {
                    console.error(error);
                    this.$handleErrorData(error);
                    window.finishSpinner();
                });
        },


        /**
         *
         * update data by id
         *
         * */

        $updateOneData() {
            return Promise.reject(`Please implement $updateOneData function in component, get data by Id`)
        },

        $handleUpdateOneData () {
            return console.warn('Please implement $handleUpdateOneData function in component')
        },

        updateOneData (id) {
            window.startSpinner();
            return this.$updateOneData(id)
                .then((result) => this.$handleDataBeforeFinish(result))
                .then((result) => {
                    this.$requestResIntersept(result)
                    this.$handleUpdateOneData(result);
                    window.finishSpinner();
                })
                .catch((error) => {
                    console.error(error);
                    this.$handleErrorData(error);
                    window.finishSpinner();
                });
        },



        /**
         *
         * delete data by id
         *
         * */

        $deleteOneData(id) {
            return Promise.reject(`Please implement $deleteOneData function in component, get data by Id ${id}`)
        },

        $handleDeleteOneData () {
            return console.warn('Please implement $handleGetDeleteData function in component')
        },

        deleteOneData (id) {
            window.startSpinner();
            return this.$deleteOneData(id)
                .then((result) => this.$handleDataBeforeFinish(result))
                .then((result) => {
                    this.$requestResIntersept(result)
                    this.$handleDeleteOneData(result);
                    window.finishSpinner();
                })
                .catch((error) => {
                    console.error(error);
                    this.$handleErrorData();
                    window.finishSpinner();
                });
        },

        /**
         *
         * delete data by ids
         *
         * */

        deleteSelectedData() {
            debugger
            window.startSpinner();
            this.$deleteSelectedData()
                .then((result) => this.$handleDataBeforeFinish(result))
                .then((result) => {
                    this.$requestResIntersept(result)
                    this.$handleDeleteSelectedData(result);
                    window.finishSpinner();
                })
                .catch((error) => {
                    console.error(error);
                    this.$handleErrorDeleteSelectedData();
                    window.finishSpinner();
                });
        },

        $deleteSelectedData() {
            return Promise.reject('Please implement $deleteSelectedData function in component')
        },


        $handleDeleteSelectedData(ids) {
            return console.warn(`Please implement $handleDeleteSelectedData function in component, get data by Ids ${ids}`)
        },

        $handleErrorDeleteSelectedData () {
            return console.warn('Please implement $handleErrorDeleteSelectedData function in component')
        },

        /**
         *
         * create data
         *
         * */

        $createData() {
            return Promise.reject(`Please implement $createData function in component`)
        },

        $handleCreateData () {
            return console.warn('Please implement $handleCreateData function in component')
        },

        $handleDataBeforeFinish () {
            this.rawOne = {};
            return this.getData();
        },

        createData () {
            window.startSpinner();
            return this.$createData()
                .then((result) => this.$handleDataBeforeFinish(result))
                .then((result) => {
                    this.$handleCreateData(result);
                    this.$requestResIntersept(result);
                    window.finishSpinner();
                })
                .catch((error) => {
                    console.error(error);
                    this.$handleErrorData(error);
                    window.finishSpinner();
                });
        },

        $requestResIntersept(){
            this.clearData()
        }
    }
};
