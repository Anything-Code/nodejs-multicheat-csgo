import Vue from 'vue'
import router from './routes.js'
import VueSocketIO from 'vue-socket.io'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

import App from './views/App'

Vue.use(Vuetify, {
    theme: {
        primary: colors.amber.base,
        //secondary: '#424242',
        accent: colors.cyan.base,
        //error: '#FF5252',
        //info: '#2196F3',
        //success: '#4CAF50',
        //warning: '#FFC107'
    }
})
Vue.use(new VueSocketIO({
    connection: 'http://localhost'
}))

new Vue({
    el: '#app',
    components: { App },
    router
});