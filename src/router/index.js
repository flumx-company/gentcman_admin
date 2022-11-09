import Vue from 'vue'
import VueRouter from 'vue-router';
import BlogCategoriesPage from "../pages/BlogCategoriesPage";
import { resolver } from "../resolvers";
import { $api } from "../api";
import FaqCategoriesPage from "../pages/FaqCategoriesPage";
import ProductCategoriesPage from "../pages/ProductCategoriesPage";
import ProductStatusesPage from "../pages/ProductStatusesPage";
import Panel from "../components/atoms/Panel";
import FaqSubCategoriesPage from "../pages/FaqSubCategoriesPage";
import Login from "../components/atoms/Login";
import BlogPage from "../pages/BlogPage";
import ProductsPage from "../pages/ProductsPage";
import UsersPage from "../pages/UsersPage";
import TeamPage from "../pages/TeamPage";
import BannerPage from "../pages/BannerPage";
import CouponsPage from "../pages/CouponsPage";
import _IDProductCategoriesFilteringByOptionsPage from "../pages/_IDProductCategoriesFilteringByOptionsPage";
import AdminsPage from "../pages/AdminsPage";
import _IDUserManageCouponsPage from "../pages/_IDUserManageCouponsPage";
import ReportProblemPage from "../pages/ReportProblemPage";
import FaqPage from "../pages/FaqPage";
import Partners from "../pages/Partners";
import TemplateMessagesPage from "../pages/TemplateMessagesPage";
import PostOffersPage from "../pages/PostOffersPage";
import IdeaImprovements from "../pages/IdeaImprovements";
import DevelopmentIdeasPage from "../pages/DevelopmentIdeasPage";
import HomePage from "../pages/HomePage";
import Orders from "../pages/Orders";

Vue.use(VueRouter);
//
export const LOGIN_PATH = '/login';
export const PANEL_PATH = '/panel';

export default new VueRouter({
    base: '/admin',
    routes: [
        { path: LOGIN_PATH, component: Login },
        {
            path: PANEL_PATH,
            component: Panel,
            children: [
                {
                    path: 'home',
                    component: HomePage,
                    beforeEnter: resolver(() => ({}))
                },{
                    path: 'blog-categories',
                    component: BlogCategoriesPage,
                    beforeEnter: resolver((to) => ({
                        blogCategories: () => $api.blogCategoriesRequest.getAll(to.query)
                    }))
                },
                {
                    path: 'faq-categories',
                    component: FaqCategoriesPage,
                    beforeEnter: resolver((to) => ({
                        faqCategories: () => $api.faqCategoriesRequest.getAll(to.query)
                    }))
                },
                {
                    path: 'product-categories',
                    component: ProductCategoriesPage,
                    beforeEnter: resolver((to) => ({
                        productCategories: () => $api.productCategoriesRequest.getAll(to.query)
                    }))
                },
                {
                    path: 'product-categories/:id',
                    component: _IDProductCategoriesFilteringByOptionsPage,
                    beforeEnter: resolver((to) => ({
                        productCategory: () => $api.productCategoriesRequest.getOne(to.params.id)
                    }))
                }, {
                    path: 'product-statuses',
                    component: ProductStatusesPage,
                    beforeEnter: resolver((to) => ({
                        productStatuses: () => $api.productStatusesRequest.getAll(to.query)
                    }))
                }, {
                    path: 'faq-sub-categories',
                    component: FaqSubCategoriesPage,
                    beforeEnter: resolver((to) => ({
                        faqSubCategories: () => $api.faqSubCategoriesRequest.getAll(to.query),
                        faqCategories: () => $api.faqCategoriesRequest.getAll(),
                    }))
                }, {
                    path: 'blog',
                    component: BlogPage,
                    beforeEnter: resolver((to) => ({
                        blogCategories: () => $api.blogCategoriesRequest.getAll(),
                        blog: () => $api.blogRequest.getAll({
                            ...to.query
                        }),
                    }))
                }, {
                    path: 'products',
                    component: ProductsPage,
                    beforeEnter: resolver((to) => ({
                        productCategories: () => $api.productCategoriesRequest.getAll(),
                        productStatuses: () => $api.productStatusesRequest.getAll(),
                        products: () => $api.productsRequest.getAll(to.query),
                    }))
                }, {
                    path: 'users',
                    component: UsersPage,
                    beforeEnter: resolver((to) => ({
                        users: () => $api.usersRequest.getAll({
                            ...to.query,
                            isAdmin: 0
                        }),
                    }))
                },{
                    path: 'users/:id/manage-coupons',
                    component: _IDUserManageCouponsPage,
                    beforeEnter: resolver((to) => ({
                        user: () => $api.usersRequest.getOne(to.params.id),
                        // userCoupons: () => $api.usersRequest.getCouponsDataByUserId(to.params.id),
                        coupons: () => $api.couponsRequest.getAll(),
                    }))
                },
                {
                    path: 'admins',
                    component: AdminsPage,
                    beforeEnter: resolver((to) => ({
                        admins: () => $api.usersRequest.getAll({
                            ...to.query,
                            isAdmin: 1
                        }),
                    }))
                }, {
                    path: 'team',
                    component: TeamPage,
                    beforeEnter: resolver((to) => ({
                        developers: () => $api.developersRequest.getAll(to.query),
                    }))
                },{
                    path: 'banners',
                    component: BannerPage,
                    beforeEnter: resolver((to) => ({
                        banners: () => $api.bannersRequest.getAll(to.query),
                    }))
                },{
                    path: 'report-problem',
                    component: ReportProblemPage,
                    beforeEnter: resolver((to) => ({
                        reportProblem: () => $api.reportProblemRequest.getAll({
                            ...to.query,
                            orderBy: 'desc'
                        }),
                        messageTemplates: () => $api.templateMessagesRequest.getAll(),
                    }))
                },{
                    path: 'partners',
                    component: Partners,
                    beforeEnter: resolver((to) => ({
                        partners: () => $api.partnersRequest.getAll(to.query),
                    }))
                },{
                    path: 'faq',
                    component: FaqPage,
                    beforeEnter: resolver((to) => ({
                        faq: () => $api.faqRequest.getAll(to.query),
                        messageTemplates: () => $api.templateMessagesRequest.getAll(),
                    }))
                },{
                    path: 'coupons',
                    component: CouponsPage,
                    beforeEnter: resolver((to) => ({
                        coupons: () => $api.couponsRequest.getAll(to.query),
                    }))
                },{
                    path: 'template-messages',
                    component: TemplateMessagesPage,
                    beforeEnter: resolver(() => ({
                        messageTemplates: () => $api.templateMessagesRequest.getAll(),
                    }))
                },{
                    path: 'post-offers',
                    component: PostOffersPage,
                    beforeEnter: resolver((to) => ({
                        postOffers: () => $api.postOffersRequest.getAll(to.query),
                        messageTemplates: () => $api.templateMessagesRequest.getAll(),
                    }))
                },{
                    path: 'idea-improvements',
                    component: IdeaImprovements,
                    beforeEnter: resolver((to) => ({
                        ideaImprovements: () => $api.ideaImprovementsRequest.getAll(to.query),
                        messageTemplates: () => $api.templateMessagesRequest.getAll(),
                    }))
                },{
                    path: 'development-ideas',
                    component: DevelopmentIdeasPage,
                    beforeEnter: resolver((to) => ({
                        developmentIdeas: () => $api.developmentIdeasRequest.getAll(to.query),
                        messageTemplates: () => $api.templateMessagesRequest.getAll(),
                    }))
                },{
                    path: 'orders',
                    component: Orders,
                    beforeEnter: resolver((to) => ({
                        orders: () => $api.ordersRequest.getAll({
                            ...to.query,
                            sort_by: 'desc'
                        }),
                        messageTemplates: () => $api.templateMessagesRequest.getAll(),
                    }))
                },
                { path: '', redirect: 'home' },
            ],
        },
        { path: '**', redirect: PANEL_PATH },
    ],
    mode: 'history'
})
