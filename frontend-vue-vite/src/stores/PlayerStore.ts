/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayerStore.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: earendil <earendil@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 20:18:38 by earendil          #+#    #+#             */
/*   Updated: 2023/10/23 18:48:38 by earendil         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { defineStore } from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = 'http://' + location.hostname + ':' + import.meta.env.VITE_BACKEND_PORT
axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + localStorage.getItem('token')

export enum PlayerStatus {
	offline = 'offline',
	online = 'online',
	playing = 'playing'
}

export interface Player {
	id: number
	username: string
	avatar: string
	firstName: string
	lastName: string
	twofaSecret: string
	playing: boolean | undefined
	status: PlayerStatus
	my_friend: boolean
}

export interface Achievement {
	name: string
	description: string
	picture: string
}

export interface Game {
	createdAt: string
	dateString: string
	host: string
	guest: string
	host_score: number
	guest_score: number
}

const emptyUser = {
	id: -1,
	username: 'Nan',
	avatar: 'Nan',
	firstName: 'Nan',
	lastName: 'Nan',
	twofaSecret: 'Nan',
	playing: undefined,
	status: PlayerStatus.offline,
	my_friend: true
};

//?: make multiple players store
export const usePlayerStore = async () => {
	const s = defineStore('PlayerStore', {
		state: (): {
			user: Player
			loading: boolean
			friends: Player[]
			fetchGames: (id: number) => Promise<Game[]>
			achievements: Achievement[]
		} => {
			return {
				user: emptyUser,
				friends: [],
				fetchGames: fetchGames,
				achievements: [],
				loading: true
			}
		},
		actions: {
			async fetchData() {
				try {
					this.user = {
						...(await axios.get('players/me')).data,
						status:
							this.user.playing === undefined
								? PlayerStatus.offline
								: this.user.playing
								? PlayerStatus.playing
								: PlayerStatus.online /* playing | online | offline */,
						my_friend: true
					}
					this.friends = (await axios.get(`players/friends/${this.user.id}`)).data
					this.friends = this.friends.map((friend) => ({
						...friend,
						status:
							friend.playing === undefined
								? PlayerStatus.offline
								: friend.playing
								? PlayerStatus.playing
								: PlayerStatus.online /* playing | online | offline */,
						my_friend: true
					}))
					this.achievements = (
						await axios.get(`players/achievements/${this.user.id}`)
					).data
				} catch (_) {
					console.log('axios failed inside user store')
					console.log(this.user)
				}
				return this.user
			},

			async logout(): Promise<void> {
				await axios.delete('auth/42')
				this.user = emptyUser
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

async function fetchGames(id: number): Promise<Game[]> {
	const games = (await axios.get(`players/games/${id}`, { params: { limit: Infinity } })).data

	const gamesDateReadable = games.map((game: any) => {
		return {
			createdAt: game.createdAt,
			dateString: new Date(game.createdAt).toLocaleString(),
			host: game.host,
			guest: game.guest,
			host_score: game.host_score,
			guest_score: game.guest_score
		}
	})
	return gamesDateReadable
}
