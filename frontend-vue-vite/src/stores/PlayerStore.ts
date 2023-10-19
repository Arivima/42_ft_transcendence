/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayerStore.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: earendil <earendil@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 20:18:38 by earendil          #+#    #+#             */
/*   Updated: 2023/10/19 21:10:13 by earendil         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { defineStore } from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = 'http://' + location.hostname + ':' + import.meta.env.VITE_BACKEND_PORT
axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + localStorage.getItem('token')

export interface Player {
	id: number
	username: string
	avatar: string
	firstName: string
	lastName: string
	playing: boolean | undefined
}

//?: make multiple players store
export const usePlayerStore = async () => {
	const s = defineStore('PlayerStore', {
		state: (): { user: Player; loading: boolean } => {
			return {
				user: {
					id: -1,
					username: 'Nan',
					avatar: 'Nan',
					firstName: 'Nan',
					lastName: 'Nan',
					playing: undefined
				},
				loading: true
			}
		},
		actions: {
			async fetchData() {
				try {
					this.user = (await axios.get('players/me')).data
					console.log(`axios return inside storeDIOCANE: ${this.user}`)
				} catch (_) {
					console.log('axios failed inside store')
				}
				return this.user
			}
		}
	})()
	if (s.loading) {
		console.log('loading')
		try {
			console.log('fetching data for user store')
			await s.fetchData()
			s.loading = false
		} catch (err) {
			console.log(err)
		}
	} else {
		console.log('not loading')
	}
	return s
}
