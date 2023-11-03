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

const debug = true

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
			fetchFriends: (id: number) => Promise<Player[]>
			fetchAchievements: (id: number) => Promise<Achievement[]>
			achievements: Achievement[],
			notifications: {requestorID: number, requestorUsername: string, requestorAvatar: string}[],
		} => {
			return {
				user: emptyUser,
				friends: [],
				fetchGames: fetchGames.bind(this),
				fetchPlayer: fetchPlayer,
				fetchFriends: fetchFriends,
				fetchAchievements: fetchAchievements,
				achievements: [],
				notifications: [],
				loading: true
			}
		},
		actions: {

			sendFriendshipRequest(recipientID: number) {
				this.user.notificationsSocket?.emit('createFrienshipRequest', {
					id: this.user.id,
					recipientID: recipientID
				});
			},

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

			// NEW
			async updateAvatar(id? : number) : Promise<string> {
				if (debug) console.log("/Store/ updateAvatar(" + id + ')');
				try {
					const avatar = await fetchAvatar('/players/avatar/' + (id || this.user.id));
					this.user.avatar = avatar;
				} catch (error) {
					console.error('axios failed inside user store : updateAvatar()')
					console.error(this.user)
				}
				return this.user.avatar
			},

			// NEW
			// async updateUsername() : Promise<string> {
			// 	if (debug) console.log('/Store/ updateUsername()');
					
			// 	const username = (await axios
			// 		.get(`/players/username/${this.user.id}`)).data;
			// 	this.user.username = username;
			// 	console.log(`Store \ username update: ${this.user.username}`)
			// 	this.user.username = `pippo`;
			// 		// .then((response) => {
			// 		// 	console.log(typeof response.data)
			// 		// 	const username = response.data
			// 		// 	console.log(`debug: ${debug}`);
			// 		// 	if (debug) console.log('/Store/ updateUsername() username' + username);
			// 		// 	this.user.username = username
			// 		// })
			// 		// .catch((error) => {
			// 		// 	console.error('axios failed inside user store : updateUsername()')
			// 		// 	console.error(this.user)
			// 		// })
					

			// 	return this.user.username
			// },

			async fetchData(token: string) {
				if (debug) console.log("/Store/ usePlayerStore.fetchData()")
				if (false == this.loading)
					return this.user
				axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + token
				const player = (await axios.get('players/me')).data
				try {
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
					this.user.avatar = await fetchAvatar('/players/avatar/' + this.user.id);
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
						my_friend: true,
					}))
					this.friends.forEach(async (friend) => {
						friend.avatar = await fetchAvatar('/players/avatar/'+ friend.id);
					})
					this.achievements = (
						await axios.get(`players/achievements/${this.user.id}`)
					).data
					this.loading = false;
				} catch (_) {
					console.log('axios failed inside user store')
					console.log(this.user)
					this.user = emptyUser;
				}
				return this.user
			},

			visibility(id : number) : string {
				if (debug) console.log("/Store/ usePlayerStore.visibility(" + id + ')');
				
				let profileType = 'PublicProfile';
				for (const friend of this.friends) {
					if (friend.id == id)
						profileType = 'FriendProfile'
				}
				// TODO ADD BLOCKED USER
				if (id == this.user.id)
					profileType = 'MyProfile'
				return profileType
			},

			getToken(): string | null {
				if (debug) console.log("/Store/ usePlayerStore.getToken()");
				return this.user.token;
			},

			async logout(): Promise<void> {
				if (debug) console.log("/Store/ usePlayerStore.logout()");
				await axios.delete('auth/42')
				localStorage.removeItem(import.meta.env.JWT_KEY);
				this.user = emptyUser
			}
		}
	});

async function fetchGames(id: number): Promise<Game[]> {
	if (debug) console.log("/Store/ fetchGames(" + id + ')');
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
	if (debug) console.log("/Store/ fillNotifications()");
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
	if (debug) console.log("/Store/ notificationsError()");
	console.log(
		`frienship-error: {\n
			msg: ${data.msg},\n
			requestorID: ${data.requestorID},\n
			recipientID: ${data.recipientID}\n
		}`
	);
}
async function fetchPlayer(id: number): Promise<Player> {
	if (debug) console.log("/Store/ fetchPlayer(" + id + ')');
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

async function fetchFriends(id: number): Promise<Player[]> {
	if (debug) console.log("/Store/ fetchFriends(" + id + ')');
	const friends : Promise<Player[]> = (await axios.get(`players/friends/${id}`)).data
	return friends
}

async function fetchAchievements(id: number): Promise<Achievement[]> {
	if (debug) console.log("/Store/ fetchAchievements(" + id + ')');
	const achievements : Promise<Achievement[]> = (await axios.get(`players/achievements/${id}`)).data
	return achievements
}

// takes a string as following '/players/avatar/' + player.id
async function fetchAvatar(avatar: string): Promise<string> {
	if (debug) console.log("/Store/ fetchAvatar(" + avatar + ')');
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