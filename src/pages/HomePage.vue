<template>
    <div class="home">
        <ul class="dbl-border">
            <li v-for="item in list" :key="item.pageUrl" :class="[item.sub && 'sub']">
                <router-link :to="item.pageUrl"
                             v-slot="{ href, route, navigate, isActive }"
                             >
                    <a
                            :class="[isActive && 'active']"
                            :href="href"
                            @click="navigate">
                        {{ item.pageName }}
                    </a>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "home",
        data:() => ({
            list: [
                {pageName: 'Блог', pageUrl: '/panel/blog'},
                {pageName: 'Категории блога', pageUrl: '/panel/blog-categories', sub: true},

                {pageName: 'Faq заданные вопросы', pageUrl: '/panel/faq'},
                {pageName: 'Faq категории', pageUrl: '/panel/faq-categories', sub: true},
                {pageName: 'Faq под категории', pageUrl: '/panel/faq-sub-categories', sub: true},

                {pageName: 'Продукты', pageUrl: '/panel/products'},
                {pageName: 'Категории продуктов', pageUrl: '/panel/product-categories', sub: true},
                {pageName: 'Статусы продуктов', pageUrl: '/panel/product-statuses', sub: true},

                {pageName: 'Юзеры', pageUrl: '/panel/users'},
                {pageName: 'Админы', pageUrl: '/panel/admins', sub: true},
                {pageName: 'Команда', pageUrl: '/panel/team', sub: true},

                {pageName: 'Предложения постов', pageUrl: '/panel/post-offers'},
                {pageName: 'Предложения улучшений системы', pageUrl: '/panel/idea-improvements', sub: true},
                {pageName: 'Проблемы', pageUrl: '/panel/report-problem', sub: true},
                {pageName: 'Идеи разработки команды', pageUrl: '/panel/development-ideas', sub: true},

                {pageName: 'Баннеры', pageUrl: '/panel/banners'},

                {pageName: 'Партнеры', pageUrl: '/panel/partners'},

                {pageName: 'Купоны', pageUrl: '/panel/coupons'},

                {pageName: 'Шаблоны сообщений ', pageUrl: '/panel/template-messages'},


            ]
        })
    }
</script>

<style scoped lang="scss">
    .dbl-border {
        list-style: none;
        margin: 20px;
        padding: 0;
    }
    .dbl-border li {
        position: relative;
        display: inline-block;
        margin: 10px;
        &.sub {
            background: #fcecff;
            margin-left: -15px;
            a {
                border-left: none!important;
            }
        }
    }
    .dbl-border a {
        padding: 5px 10px;
        border-radius: 10px;
        color: #808285;
        text-decoration: none;
        border-left: 6px solid #ABC7EA;
        border-right: 1px solid grey;
        border-top: 1px solid grey;
        border-bottom: 1px solid grey;
        display: block;
        line-height: 44px;
        font-size: 20px;
        position: relative;
        transition: 0.3s linear;

    }
    .dbl-border a:hover {
        border-left: 6px solid #d97950;
        background: rgba(217, 121, 80, 0.27);
    }
    .dbl-border a.active {
        border-left: 6px solid  #58a2d9;
        background: rgba(88, 162, 217, 0.27);
    }
</style>
