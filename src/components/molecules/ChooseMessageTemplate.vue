<template>
    <div class="choose-message-templates">
        <button @click="activeChoose = !activeChoose">
            выбрать шаблон сообщения из доступных
        </button>
        <div v-if="activeChoose">
            <dropdown
                    :options="getTypes"
                    :value="form.type.value"
                    label="type"
                    display-name="type"
                    display-value="id"
                    @input="form.type.value = $event">
            </dropdown>
            <dropdown
                    :options="getItemsForType"
                    :value="form.message.value"
                    label="items"
                    display-name="name"
                    display-value="message"
                    @input="form.message.value = $event">
            </dropdown>
        </div>
    </div>
</template>

<script>

    import Dropdown from "./Dropdown";

    export default {
        components: {
            Dropdown
        },
        data:() => ({
            form: {
                message: {
                    value: '',
                    label: 'message',
                    placeholder: 'message'
                },
                type: {
                    value: '',
                    label: 'type',
                    placeholder: 'type'
                }
            },
            activeChoose :false
        }),
        name: "ChooseMessageTemplate",
        props: ['messageTemplates'],
        computed: {
            getTypes() {
                return [{
                    type: 'All',
                    id: ''
                }].concat(Array.isArray(this.messageTemplates) ? this.messageTemplates.map(item => ({
                    type: item.type,
                    id: item.type
                })) : [])
            },
            getItemsForType () {
                const type = Array.isArray(this.messageTemplates) && this.messageTemplates.find(item => item.type === this.form.type.value);
                return type ? type.items : [];
            }
        },
        watch: {
            'form.message.value' () {
                if(this.form.message.value) {
                    this.$emit('change', this.form.message.value);

                    this.form.message.value = '';
                    this.form.type.value = '';
                    this.activeChoose = false;
                }
            },
            'activeChoose' () {
                if(!this.activeChoose) {
                    this.form.message.value = '';
                    this.form.type.value = '';
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .choose-message-templates {
        padding: 10px;
        border: 1px solid black;
        margin: 10px 0 ;
    }
</style>
