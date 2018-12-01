/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

import Router from './routes.js';
import App from './components/App';

import axios from 'axios';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors'
import Auth from './packages/auth/Auth.js';

Vue.use(Auth);
Vue.use(Vuetify, {
    theme: {
        primary: colors.cyan.base,
        //secondary: '#424242',
        accent: colors.cyan.base,
        //error: '#FF5252',
        //info: '#2196F3',
        //success: '#4CAF50',
        //warning: '#FFC107'
    }
});

axios.defaults.baseURL = 'http://arriba.test';

Router.beforeEach(
    (to, from, next) => {
        if (to.matched.some(record => record.meta.forVisitors)) {
            if (Vue.auth.isAuthenticated()) {
                next({
                    path: '/admin/backend/dashboard'
                });
            } else next();
        }
        else if (to.matched.some(record => record.meta.forAuth)) {
            /*if (Vue.auth.isAuthenticated()) {
                if (Vue.auth.halfWay()) {
                    Vue.auth.refreshToken();
                }
            }*/
            if (Vue.auth.isAuthenticated()) {
                if (to.name == 'backend') {
                    next({
                        path: '/admin/backend/dashboard'
                    });
                }
            }
            
            if (!Vue.auth.isAuthenticated()) {
                next({
                    path: '/admin'
                });
            } else next();
        } else next()
    }
);

const app = new Vue({
    el: '#app',
    components: { App },
    router: Router,
});