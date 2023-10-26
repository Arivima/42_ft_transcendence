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
	token:	string | null
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
	token: null,
	twofaSecret: 'Nan',
	playing: undefined,
	status: PlayerStatus.offline,
	my_friend: true
};

//?: make multiple players store
export const usePlayerStore = defineStore('PlayerStore', {
		state: (): {
			user: Player
			loading: boolean //TODO ? forse rimuovere
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
			async fetchData(token: string) {
				if (false == this.loading)
					return this.user
				axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + token
				const player = (await axios.get('players/me')).data
				try {
					this.user = {
						...player,
						token: token,
						status:
							player.playing === undefined
								? PlayerStatus.offline
								: player.playing
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
					this.loading = false;
				} catch (_) {
					console.log('axios failed inside user store')
					console.log(this.user)
				}
				return this.user
			},

			async fetchAvatar(): Promise<string> {
				try {
					const response = await axios.get(`players/avatar/${this.user.id}`, {
						responseType: 'arraybuffer'
					});
					const contentType = response.headers['content-type'];
					return `data:${contentType};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
				}
				catch (error) {
					console.log(`fetchAvatar() Exception: ${error}`)
					return '';
				}
			},


			getToken(): string | null {
				return this.user.token;
			},

			async logout(): Promise<void> {
				await axios.delete('auth/42')
				this.user = emptyUser
			}
		}
	});

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
