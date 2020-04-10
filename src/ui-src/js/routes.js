import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Visuals from './views/Visuals'
import Misc from './views/Misc'

const router = new VueRouter({
  mode: 'history',
  routes: [{
      path: '/visuals',
      name: 'visuals',
      component: Visuals
    },
    {
      path: '/misc',
      name: 'misc',
      component: Misc
    },
  ],
})

export default router