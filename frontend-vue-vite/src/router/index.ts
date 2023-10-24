import { createRouter, createWebHistory } from 'vue-router'

import axios from 'axios'

axios.defaults.baseURL = 'http://' + location.hostname + ':' + import.meta.env.VITE_BACKEND_PORT

function lazyload(view: any) {
	return () => import(`@/views/${view}.vue`)
}

const router = createRouter({
	history: createWebHistory(import.meta.env.VITE_BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: lazyload('GameView')
		},
		{
			path: '/login',
			name: 'login',
			component: lazyload('LoginView')
		},
		{
			path: '/profile',
			name: 'profile',
			component: lazyload('ProfileView')
		},
		{
			path: '/game',
			name: 'game',
			component: lazyload('GameView')
		},
		{
			path: '/chat',
			name: 'chat',
			component: lazyload('ChatView')
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
			// if token is set redirect to OTP VIEW
			if ('login' == to.name) {
				if (!localStorage.getItem('token'))
					next();
				else
					next({name: 'otp-login'})
			}
			else next({ name: 'login' })
	})
})

export default router
