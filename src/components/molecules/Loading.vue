<template>
    <div class="page-loader" v-if="loading">
        <div class="container">
            <div class="item item-1"></div>
            <div class="item item-2"></div>
            <div class="item item-3"></div>
            <div class="item item-4"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'loading',
        data: () => ({
            loading: false
        }),
        methods: {
            start () {
                this.loading = true
            },
            finish () {
                this.loading = false
            }
        }
    }
</script>

<style scoped>
    .page-loader{
        background: rgba(50, 64, 91, 0.25);
        position: fixed;
        height: 100%;
        width: 100%;
        z-index: 50000;
        top: 0;
    }

    .container {
        position: absolute;
        width: 100px;
        height: 100px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }

    .item {
        width: 50px;
        height: 50px;
        position: absolute;
    }

    .item-1 {
        background-color: #32405B;
        top: 0;
        left: 0;
        z-index: 1;
        animation: item-1_move 1.8s cubic-bezier(.6,.01,.4,1) infinite;
    }

    .item-2 {
        background-color: #91A0BC;
        top: 0;
        right: 0;
        animation: item-2_move 1.8s cubic-bezier(.6,.01,.4,1) infinite;
    }

    .item-3 {
        background-color: #CA4635;
        bottom: 0;
        right: 0;
        z-index: 1;
        animation: item-3_move 1.8s cubic-bezier(.6,.01,.4,1) infinite;
    }

    .item-4 {
        background-color: #D4D7DE;
        bottom: 0;
        left: 0;
        animation: item-4_move 1.8s cubic-bezier(.6,.01,.4,1) infinite;
    }

    @keyframes item-1_move {
        0%, 100% {transform: translate(0, 0)}
        25% {transform: translate(0, 50px)}
        50% {transform: translate(50px, 50px)}
        75% {transform: translate(50px, 0)}
    }

    @keyframes item-2_move {
        0%, 100% {transform: translate(0, 0)}
        25% {transform: translate(-50px, 0)}
        50% {transform: translate(-50px, 50px)}
        75% {transform: translate(0, 50px)}
    }

    @keyframes item-3_move {
        0%, 100% {transform: translate(0, 0)}
        25% {transform: translate(0, -50px)}
        50% {transform: translate(-50px, -50px)}
        75% {transform: translate(-50px, 0)}
    }

    @keyframes item-4_move {
        0%, 100% {transform: translate(0, 0)}
        25% {transform: translate(50px, 0)}
        50% {transform: translate(50px, -50px)}
        75% {transform: translate(0, -50px)}
    }
</style>
