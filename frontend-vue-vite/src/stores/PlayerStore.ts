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
}

//? TOGLIERE
export interface FriendRequestStatus {
	status: 'loading' | 'accepted' | 'rejected'
}

export interface FriendshipRejectAccept {
	requestorID: number,
	recipientID: number
}

export interface BlockedFriendship {
	requestorID: number,
	recipientID: number,
	requestor_blacklisted: boolean,
	recipient_blacklisted: boolean
}

export interface FriendRequestUpdate {
	are_friends: boolean,
	pending_friendship: boolean,
	requestor_blacklisted: boolean,
	recipient_blacklisted: boolean,
	requestorID: number,
	recipientID: number,
}

export interface FriendRequestError {
	msg: string,
	requestorID: number,
	recipientID: number
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
	profile_completed: boolean
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
	profile_completed: false,
};

//?: make multiple players store
export const usePlayerStore: StoreDefinition<any> = defineStore('PlayerStore', {
		state: (): {
			user: Player
			loading: boolean //TODO ? forse rimuovere
			friends: Player[],
			blockedUsers: Player[],
			fetchGames: (id: number) => Promise<Game[]>
			fetchPlayer: (id: number) => Promise<Player>
			fetchFriends: (id: number) => Promise<Player[]>
			fetchAchievements: (id: number) => Promise<Achievement[]>
			achievements: Achievement[],
			notifications: (FriendRequest & FriendRequestStatus)[],
		} => {
			return {
				user: emptyUser,
				friends: [],
				blockedUsers: [],
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

			isProfileCompleted() {
				return this.user.profile_completed;
			},

			async setProfileAsComplete() {
				await axios.get('players/me/completeProfile');
			},

			sendFriendshipRequest(recipientID: number) {
				console.log(`sendFriendshipRequest: ${recipientID}`);
				this.user.notificationsSocket?.emit('createFrienshipRequest', {
					id: this.user.id,
					recipientID: recipientID
				});
			},

			sendFriendshipConsent(requestorID: number) {
				this.user.notificationsSocket?.emit('acceptFriendship', {
					requestorID: requestorID,
					recipientID: this.user.id,
				});
			},

			sendFriendshipRejection(friendID: number) {
				this.user.notificationsSocket?.emit('rejectFrienship', {
					userID: this.user.id,
					friendID
				});
				// this.user.notificationsSocket?.emit('updateFrienshipRequest', {
				// 	bearerID: this.user.id,
				// 	recipientID: this.user.id,
				// 	requestorID: requestorID,
				// 	are_friends: false,
				// 	pending_friendship: false,
				// 	requestor_blacklisted: false,
				// 	recipient_blacklisted: false,
				// });
			},

			toggleBlockUser(profileID: number, block: boolean) {
				console.log(`blockUser: emitting to backend: profileID: ${profileID}; ${block}`);
				this.user.notificationsSocket?.emit('ToggleBlockUser', {
					userID: this.user.id,
					friendID: profileID,
					block: block
				});
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
						notificationsSocket: io(`ws://${location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`, {
							transports: ['websocket'],
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
					this.user.notificationsSocket?.on('new-friendship-request', handleNewRequest.bind(this));
					this.user.notificationsSocket?.on('reject-friendship-request', handleFriendshipReject.bind(this))
					this.user.notificationsSocket?.on('accept-friendship', handleFriendshipAccept.bind(this));
					this.user.notificationsSocket?.on('toggle-block-user', handleBlockedUser.bind(this));
					this.user.notificationsSocket?.on('frienship-error', handleNotificationsError.bind(this));
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
						friend.avatar = await fetchAvatar(friend.avatar);//'/players/avatar/'+ friend.id);
					})
					this.blockedUsers = (await axios.get('players/blocked')).data;
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
				if (id == this.user.id)
					profileType = 'MyProfile'
				for (const friend of this.friends) {
					if (friend.id == id) {
						profileType = 'FriendProfile'
						break ;
					}
				}
				for (const blocked of this.blockedUsers) {
					if (id == blocked.id) {
						profileType = 'BlockedProfile';
						break ;
					}
				}
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

async function fetchPlayer(id: number): Promise<Player> {
	if (debug) console.log("/Store/ fetchPlayer(" + id + ')');
	let user : Player = emptyUser
	let player : Player = (await axios.get(`players/${id}`)).data
	user = {
		...player,
		status:
			player.playing === undefined
				? PlayerStatus.offline
				: player.playing
				? PlayerStatus.playing
				: PlayerStatus.online /* playing | online | offline */,
	}
	try {
		user.avatar = await fetchAvatar(user.avatar);
	}
	catch (_) {
		user.avatar = '';
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

//Ws events

//Friendships
async function fillNotifications(this: any, data: {requests: FriendRequest[]}) {
	if (debug) console.log("/Store/ fillNotifications()");

	this.notifications.splice(0);
	data.requests.forEach(async (req) => {
		this.notifications.push({
			requestorID: req.requestorID,
			requestorUsername: req.requestorUsername,
			requestorAvatar: await fetchAvatar(req.requestorAvatar),
			status: 'pending'
		});
	})
}

async function handleNewRequest(this: any, data: FriendRequest) {
	console.log(`new-friendship-request emitted from the server`);
	const index = this.notifications.findIndex(
		(request: (FriendRequest & FriendRequestStatus)) => data.requestorID == request.requestorID
	)

	if (-1 == index) {
		this.notifications.push({
			requestorID: data.requestorID,
			requestorUsername: data.requestorUsername,
			requestorAvatar: await fetchAvatar(data.requestorAvatar),
			status: 'pending'
		});
	}
}

async function handleFriendshipAccept(
	this: any,
	data: FriendshipRejectAccept
)
{
	let newFriendID: number;

	//remove notification
	console.log(`handleFriendshipAccept: {requestorID: ${data.requestorID}, recipientID: ${data.recipientID}}`);
	if (data.recipientID == this.user.id) {
		const index = this.notifications.findIndex(
			(request: (FriendRequest & FriendRequestStatus)) => {
				return data.requestorID == request.requestorID
			}
		);

		if (-1 != index)
			this.notifications.splice(index, 1);
		
		newFriendID = data.requestorID;
	}
	else {
		newFriendID = data.recipientID;
	}

	const newFriend = await fetchPlayer(newFriendID);
	if (JSON.stringify(emptyUser) != JSON.stringify(newFriend)) {
		this.friends.push(newFriend);
	}
}

function handleFriendshipReject(
	this: any,
	data: FriendshipRejectAccept
)
{
	if (data.recipientID == this.user.id)
	{
		const index = this.notifications.findIndex(
			(request: (FriendRequest & FriendRequestStatus)) => {
				return data.requestorID == request.requestorID
			}
		)

		if (-1 != index) {
			this.notifications.splice(index, 1);
		}
	}
	
	const index = this.friends.findIndex(
		(friend: Player) => {
			return (
				this.user.id == data.recipientID ?
					(data.requestorID == friend.id)
					: (data.recipientID == friend.id)
			);
		}
	)
	
	if (-1 != index)
		this.friends.splice(index, 1);
}

async function handleBlockedUser(
	this: any,
	data: BlockedFriendship
)
{
	let index: number;
	let affectedUserID: number;
	let userBlocked: boolean;

	console.log('toggle-block-user: emitting from backend');
	if (data.recipientID == this.user.id) {
		// remove notification && get friend (profile, index in friends array, and wether it is blocked or not)
		let notificationsIndex = this.notifications.findIndex(
			(request: (FriendRequest & FriendRequestStatus)) => {
				return data.requestorID = request.requestorID
			}
		);
		if (-1 != notificationsIndex)
			this.notifications.splice(notificationsIndex, 1);
		
		affectedUserID = data.requestorID;
		userBlocked = data.requestor_blacklisted;
		index = this.friends.findIndex(
			(friend: Player) => {
				return data.requestorID == friend.id
			}
		);
	}
	else {
		// get friend (profile, index in friends array, and wether it is blocked or not)
		affectedUserID = data.recipientID;
		userBlocked = data.recipient_blacklisted;
		index = this.friends.findIndex(
			(friend: Player) => {
				return data.recipientID == friend.id
			}
		);
	}

	// delete from friends if exists
	if (-1 != index)
		this.friends.splice(index, 1);
	
	// if blocked, add to blocked users
	if (userBlocked) {
		const affectedUser = await fetchPlayer(affectedUserID);
		if (JSON.stringify(emptyUser) != JSON.stringify(affectedUser)) {
			this.blockedUsers.push(affectedUser);
		}
	}
	// if unblocked, remove from blocked users
	else {
		const index = this.blockedUsers.findIndex(
			(user: Player) => {
				return affectedUserID == user.id;
			}
		)

		if (-1 != index) {
			this.blockedUsers.splice(index, 1);
		}
	}
}

// function updateNotifications(
// 	this: any,
// 	data: FriendRequestUpdate
// )
// {
// 	console.log('update-friendship-request emitted from the server');
// 	// ACCEPT friendship succeeded
// 	if (this.user.id == data.recipientID && false == data.pending_friendship)
// 	{
// 		const requestID = this.notifications.findIndex((request: (FriendRequest & FriendRequestStatus)) =>
// 			data.requestorID == request.requestorID
// 		);
			
// 		if (-1 != requestID)
// 			this.notifications.splice(requestID, 1);
// 	}
// 	//TODO handle all other kinds of update events: blocked user, etc. (look into db table to think about all possibilities)
// }

//TODO continue
async function handleNotificationsError(this: any, data: FriendRequestError) {
	if (debug) console.log("/Store/ notificationsError()");
	console.log(
		`frienship-error: {\n
			msg: ${data.msg},\n
			requestorID: ${data.requestorID},\n
			recipientID: ${data.recipientID}\n
		}`
	);
}
