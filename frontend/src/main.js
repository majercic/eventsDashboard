import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { reactive } from 'vue'

const globalState = reactive({
    country: '',
    countryCode: ''
})

axios.interceptors.request.use(config => {
    if (config.url.includes('/api')) {
        config.headers['x-country-code'] = globalState.countryCode
    }
    return config
})

axios.get('http://ip-api.com/json').then(response => {
    const app = createApp(App)
    globalState.country = response.data.country;
    globalState.countryCode = response.data.countryCode;
    app.config.globalProperties.$globalState = globalState
    app.config.globalProperties.$axios = axios
    app.use(router)
    app.mount('#app')

}).catch(error => {
    console.error('Failed to initialize application', error);
});





