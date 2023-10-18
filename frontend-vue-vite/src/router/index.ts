import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import GameView from '../views/GameView.vue'
import ChatView from '../views/ChatView.vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://' + location.hostname + ':' + import.meta.env.VITE_BACKEND_PORT

const router = createRouter({
	history: createWebHistory(import.meta.env.VITE_BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: GameView
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView
		},
		{
			path: '/profile',
			name: 'profile',
			component: ProfileView
		},
		{
			path: '/game',
			name: 'game',
			component: GameView
		},
		{
			path: '/chat',
			name: 'chat',
			component: ChatView
		}
	]
})

const checkLogIn = () => new Promise((resolve, reject) => {
	const token = localStorage.getItem('token')
	if (!token) reject('token not found')
	else
		axios
			.get('players/me')//, {headers: {Authorization: 'Bearer ' + token.toString()}})
			.then((res) => resolve(res))
			.catch((err) => reject(err))
})

router.beforeEach((to, from, next) => {
	if (to.query.token) {
		localStorage.setItem('token', to.query.token.toString())
		axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + localStorage.getItem('token')
	}
	checkLogIn()
	.then((_) => {
			if ('login' == to.name || 'home' == to.name) next({name: 'profile'})
			else next()
	})
	.catch((_) => {
			if ('login' == to.name) next()
			else next({ name: 'login' })
	})
})

export default router
