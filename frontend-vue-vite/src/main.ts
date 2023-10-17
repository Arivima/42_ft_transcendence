import './assets/main.css'
// import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VuetifyInstance from './plugins/vuetify';

import App from './App.vue'
import router from './router'


const app = createApp(App)


app.use(createPinia())
app.use(router)
app.use(VuetifyInstance)
app.use(VueAxios, axios)
// app.provide('axios', app.config.globalProperties.axios) // composition api
app.config.globalProperties.$http = axios;

// axios.defaults.baseURL = "http://" + location.hostname + ":" + process.env.VUE_APP_BACKEND_PORT;
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

app.mount('#app')
