import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router configuration
// import 'dotenv/config';

const app = createApp(App);

// Access environment variables and store them as constants
const apiKey = process.env.VUE_APP_API_URL;

app.config.globalProperties.$apiKey = apiKey;

app.use(router); // Use the router

app.mount('#app');