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

import { defineStore, type StoreDefinition } from 'pinia'
import axios from 'axios'
import {io, Socket} from 'socket.io-client'
// import type { Socket } from 'socket.io-client'

axios.defaults.baseURL = 'http://' + location.hostname + ':' + import.meta.env.VITE_BACKEND_PORT

export enum PlayerStatus {
	offline = 'offline',
	online = 'online',
	playing = 'playing'
}

export interface FriendRequest {
	requestorID: number
	requestorUsername: string
	requestorAvatar: string
	status: 'loading' | 'accepted' | 'rejected'
}

export interface Player {
	id: number
	username: string
	avatar: string
	firstName: string
	lastName: string
	playing: boolean | undefined
	status: PlayerStatus
	my_friend: boolean
	notificationsSocket: Socket | null
	token:	string | null
	twofaSecret: string//?RIMUOVERE
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
	playing: undefined,
	status: PlayerStatus.offline,
	my_friend: true,
	notificationsSocket: null,
	token: null,
	twofaSecret: 'Nan',
};

//?: make multiple players store
export const usePlayerStore: StoreDefinition<any> = defineStore('PlayerStore', {
		state: (): {
			user: Player
			loading: boolean //TODO ? forse rimuovere
			friends: Player[]
			fetchGames: (id: number) => Promise<Game[]>
			fetchPlayer: (id: number) => Promise<Player>
			fetchAchievements: (id: number) => Promise<Achievement[]>
			achievements: Achievement[],
			notifications: {requestorID: number, requestorUsername: string, requestorAvatar: string}[],
		} => {
			return {
				user: emptyUser,
				friends: [],
				fetchGames: fetchGames,
				fetchPlayer: fetchPlayer,
				fetchAchievements: fetchAchievements,
				achievements: [],
				notifications: [],
				loading: true
			}
		},
		actions: {

			sendFriendshipConsent(requestorID: number) {
				this.user.notificationsSocket?.emit('updateFrienshipRequest', {
					bearerID: this.user.id,
					recipientID: this.user.id,
					requestorID: requestorID,
					are_friends: true,
					pending_friendship: false,
					requestor_blacklisted: false,
					recipient_blacklisted: false,
				});
			},

			sendFriendshipRejection(requestorID: number) {
				this.user.notificationsSocket?.emit('updateFrienshipRequest', {
					bearerID: this.user.id,
					recipientID: this.user.id,
					requestorID: requestorID,
					are_friends: false,
					pending_friendship: false,
					requestor_blacklisted: false,
					recipient_blacklisted: false,
				});
			},

			updateNotifications(
				data: {
					are_friends: boolean,
					pending_friendship: boolean,
					requestor_blacklisted: boolean,
					recipient_blacklisted: boolean,
					requestorID: number,
					recipientID: number,
				}
			)
			{
				console.log('update-friendship-request emitted from the server');
				if (this.user.id == data.recipientID && false == data.pending_friendship)
				{
					const requestID = this.notifications.findIndex((request) =>
						data.requestorID == request.requestorID
					);
						
					if (-1 != requestID)
						this.notifications.splice(requestID, 1);
				}
				//TODO handle all other kinds of update events: blocked user, etc. (look into db table to think about all possibilities)
			},
			

			async fetchData(token: string) {
				if (false == this.loading)
					return this.user
				axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + token
				const player = (await axios.get('players/me')).data
				try {
					console.log('fetching data in store');
					this.user = {
						...player,
						token: token,
						notificationsSocket: io(`http://${location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`, {
							auth: {
								'token': token
							}
						}),
						status:
							player.playing === undefined
								? PlayerStatus.offline
								: player.playing
								? PlayerStatus.playing
								: PlayerStatus.online /* playing | online | offline */,
						my_friend: true
					}
					this.user.avatar = await this.fetchAvatar();
					this.user.notificationsSocket?.on('friendship-requests', fillNotifications.bind(this));
					this.user.notificationsSocket?.on('update-friendship-request', this.updateNotifications.bind(this));
					this.user.notificationsSocket?.on('frienship-error', notificationsError.bind(this));
					this.user.notificationsSocket?.emit('findAllFrienshipRequests', {id: this.user.id});
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
					console.log('loading set to false');
				} catch (_) {
					console.log('axios failed inside user store')
					console.log(this.user)
					this.user = emptyUser;
				}
				return this.user
			},

			async fetchAvatar(): Promise<string> {
				try {
					const response = await axios.get(this.user.avatar, {
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
				localStorage.removeItem(import.meta.env.JWT_KEY);
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

function fillNotifications(this: any, data: {requests: {requestorID: number, requestorUsername: string, requestorAvatar: string}[]}) {
	console.log("Ws: findAllFriendships ack");
	data.requests.forEach((request) => {
		console.log(`
			requestorUsername: ${request.requestorUsername},
			requestorID: ${request.requestorID},
			requestorAvatar: ${request.requestorAvatar}
		`);
	})
	this.notifications.splice(0);
	data.requests.forEach((el) => {
		this.notifications.push({
			requestorID: el.requestorID,
			requestorUsername: el.requestorUsername,
			requestorAvatar: el.requestorAvatar,
			status: 'pending'
		});
	})
}

async function notificationsError(this: any, data: {msg: string, requestorID: number, recipientID: number}) {
	console.log(
		`frienship-error: {\n
			msg: ${data.msg},\n
			requestorID: ${data.requestorID},\n
			recipientID: ${data.recipientID}\n
		}`
	);
}
async function fetchPlayer(id: number): Promise<Player> {
	let player : Player = (await axios.get(`players/${id}`)).data
	let user : Player = emptyUser
	try {
		user = {
			...player,
			status:
				player.playing === undefined
					? PlayerStatus.offline
					: player.playing
					? PlayerStatus.playing
					: PlayerStatus.online /* playing | online | offline */,
		}
		user.avatar = await fetchAvatar(user.avatar);
	} catch (_) {
		console.log('axios failed inside user store')
		console.log(user)
	}
	return user
}


async function fetchAchievements(id: number): Promise<Achievement[]> {
	const achievements : Promise<Achievement[]> = (await axios.get(`players/achievements/${id}`)).data
	return achievements
}

async function fetchAvatar(avatar: string): Promise<string> {
	try {
		const response = await axios.get(avatar, {
			responseType: 'arraybuffer'
		});
		const contentType = response.headers['content-type'];
		return `data:${contentType};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
	}
	catch (error) {
		console.log(`fetchAvatar() Exception: ${error}`)
		return '';
	}
}