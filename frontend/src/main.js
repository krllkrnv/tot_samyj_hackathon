import { createApp } from 'vue'
import App from './App.vue'
import store from './vuex/index.js'
import './axios.js'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'





const vuetify = createVuetify({
    components,
    directives,
})


createApp(App)
    .use(store)
    .use(vuetify)
    .mount('#app')