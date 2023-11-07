import { createRouter, createWebHistory } from 'vue-router'

import axios from 'axios'
import { usePlayerStore, type Player } from '@/stores/PlayerStore'

axios.defaults.baseURL = 'http://' + location.hostname + ':' + import.meta.env.VITE_BACKEND_PORT
const debug = false

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
			path: '/login-2fa',
			name: 'login-2fa',
			component: lazyload('Login2FAView')
		},
		{
			path: '/profile/:id?',
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
	if (debug) console.log('*Router* checkLogIn()')
	const token = localStorage.getItem(import.meta.env.JWT_KEY);

	if (!token) reject('token not found')
	else
		axios					//necessario perché se faccio reload perdo il vecchio axios con i defaults
			.get('players/me', {headers: {Authorization: 'Bearer ' + token.toString()}})
			.then((res) => {
				usePlayerStore()
					.fetchData(token as string)
					.then((res : Player) => resolve(res))
					.catch((err : Error) => reject(err))
			})
			.catch((err) => reject(err))
})

router.beforeEach((to, from, next) => {
	if (debug) console.log('*Router* beforeEach() | path :' + to.path)
	if (to.query.token) {
		localStorage.setItem(import.meta.env.JWT_KEY, to.query.token as string);
		axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + to.query.token as string
	}
	checkLogIn()
		.then((_) => {
			if ('login' == to.name || 'login-2fa' == to.name || 'home' == to.name)
				next({ name: `profile`})
			else next()
		})
		.catch((_) => {
			// if token is set redirect to OTP VIEW
			// important! Token is always loaded from localStorage into PlayerStore
			// inside the checkLogIn function executed before this step.
			if (null == usePlayerStore().getToken()) {
				if ('login' == to.name)
					next();
				else
					next({ name: 'login' })
			}
			else {
				if ('login-2fa' == to.name)
					next();
				else
					next({ name: 'login-2fa' })
			}
		})
})

export default router
