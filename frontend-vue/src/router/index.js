import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue'; // Import your login page component

const routes = [
  // Define your routes here
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;