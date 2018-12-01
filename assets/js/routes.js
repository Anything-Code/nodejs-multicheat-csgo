import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Visuals from './views/Visuals'

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'visuals',
            component: Visuals
        },
    ],
})

export default router