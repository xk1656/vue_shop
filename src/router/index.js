/* eslint-disable indent */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/Users.vue'
import Rights from '../components/Authority/Rights.vue'
import Roles from '../components/Authority/Roles.vue'
import Category from '../components/Product/Category.vue'
import Params from '../components/Product/Params.vue'
import List from '../components/Product/List.vue'
import Add from '../components/Product/Add.vue'
import Order from '../components/Order/Order.vue'
import Report from '../components/Report/Report.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            redirect: '/welcome',
            component: Home,
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Category },
                { path: '/params', component: Params },
                { path: '/goods', component: List },
                { path: '/goods/add', component: Add },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.token
    if (!tokenStr) return next('/login')
    next()
})

export default router