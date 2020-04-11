import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Features from './views/Features'
import Config from './views/Config'

const router = new VueRouter({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'features',
      component: Features
    },
    {
      path: '/config',
      name: 'config',
      component: Config
    },
  ],
})

export default router