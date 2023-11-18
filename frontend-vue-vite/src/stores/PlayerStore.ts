/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayerStore.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 20:18:38 by earendil          #+#    #+#             */
/*   Updated: 2023/11/18 21:46:25 by mmarinel         ###   ########.fr       */
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
	recipientID: number
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


export interface PlayerGameData {
	paddle: {
		w: number
		h: number
		sx: number
		sy: number
		y: number
	}
	score: number
}

export interface Frame {
	seq: number,
	ball: {
		radius: number
		sx: number, sy: number
		x: number, y: number
		dx: number, dy: number
	}
	host: PlayerGameData
	guest: PlayerGameData
}

export interface CustomizationOptions {
	pitch_color: string,
	paddle_color: string,
	ball_color: string
}

export interface GameInfo {
	hostID: number,
	hostName: string,
	guestID: number,
	guestName: string
}

export interface currentGame {
	gameInfo: GameInfo,
	customizations: CustomizationOptions,
	frame: Frame
}

const emptyCurrentGame = {
	gameInfo: {hostID: -1, hostName: 'N/A', guestID: -1, guestName: 'N/A'},
	customizations: {pitch_color: 'N/A', paddle_color: 'N/A', ball_color: 'N/A'},
	frame: {seq: -1, ball: {radius: -1, sx: -1, sy: -1, x: -1, y: -1, dx: -1, dy: -1} }
} as currentGame;


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
	gameSocket: Socket | null
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
	gameSocket: null,
	token: null,
	twofaSecret: 'Nan',
	profile_completed: false,
};

//?: make multiple players store
export const usePlayerStore: StoreDefinition<any> = defineStore('PlayerStore', {
		state: (): {
			user: Player
			currentGame: currentGame
			loading: boolean //TODO ? forse rimuovere
			friends: Player[],
			blockedUsers: Player[],
			publicUsers: Player[],
			pendingUsers: Player[],
			fetchGames: (id: number) => Promise<Game[]>
			fetchPlayer: (id: number) => Promise<Player>
			fetchFriends: (id: number) => Promise<Player[]>
			fetchPublicUsers: (id: number) => Promise<Player[]>
			fetchPendingUsers: (id: number) => Promise<Player[]>
			fetchAchievements: (id: number) => Promise<Achievement[]>
			achievements: Achievement[],
			notifications: (FriendRequest & FriendRequestStatus)[],
		} => {
			return {
				user: emptyUser,
				currentGame: {} as currentGame,
				friends: [],
				blockedUsers: [],
				publicUsers: [],
				pendingUsers: [],
				fetchGames: fetchGames.bind(this),
				fetchPlayer: fetchPlayer,
				fetchFriends: fetchFriends,
				fetchPublicUsers: fetchPublicUsers,
				fetchPendingUsers: fetchPendingUsers,
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
				this.user.profile_completed = true;
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



			
			// game socket actions
			// matchmaking
			sendMatchMakingRequest() {
				if (debug) console.log("/Store/ sendMatchMakingRequest");
				
				this.user.gameSocket?.emit('matchMaking', {
					userID: this.user.id
				});
			},

			// invitation
			sendInvitation(guestID : number) {
				if (debug) console.log("/Store/ sendInvitation");
				this.user.gameSocket?.emit('sendInvite', {
					playerID: this.user.id,
					guestID: guestID,
				});
			},

			cancelInvitation(guestID : number) {
				if (debug) console.log("/Store/ cancelInvitation");
				this.user.gameSocket?.emit('cancelInvite', {
					playerID: this.user.id,
					guestID: guestID,
				});
			},

			acceptInvitation(guestID : number) {
				if (debug) console.log("/Store/ acceptInvitation");
				this.user.gameSocket?.emit('acceptInvite', {
					playerID: this.user.id,
					guestID: guestID,
				});
			},

			rejectInvitation(guestID : number) {
				if (debug) console.log("/Store/ rejectInvitation");
				this.user.gameSocket?.emit('rejectInvite', {
					playerID: this.user.id,
					guestID: guestID,
				});
			},

			// streaming
			sendStreamingRequest() {
				if (debug) console.log("/Store/ sendStreamingRequest");
				this.user.gameSocket?.emit('streaming', {
					playerID: this.user.id,
				});
			},

			// game
			sendCustomizationOptions(customization: CustomizationOptions) {
				if (debug) console.log("/Store/ sendCustomizationOptions");
				
				this.user.gameSocket?.emit('customization', {
					customization: customization,
					game_info: this.currentGame.gameInfo,
					userID: this.user.id
				});
			},

			sendFrame(frame: Frame) {
				if (debug) console.log("/Store/ sendFrame");
				this.user.gameSocket?.emit('newFrame', {
					frame: frame
				});
			},

			sendDisconnect() {
				if (debug) console.log("/Store/ sendDisconnect");
				this.user.gameSocket?.disconnect()
			},





			// profile actions
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

			async updateUsername() : Promise<string> {
				if (debug) console.log("/Store/ updateUsername()");
				try {
					const player = (await axios.get('players/me')).data
					this.user.username = player.username;
				} catch (error) {
					console.error('axios failed inside user store : updateUsername()')
					console.error(this.user)
				}
				return this.user.username
			},

			// NEW
			// async updateFriends() {
			// 	if (debug) console.log("/Store/ updateFriends()");
			// 	try {
			// 		let updateFriends  : Player[] = (await axios.get(`players/friends/${this.user.id}`, {params: {includePending: false}})).data
			// 		updateFriends = updateFriends.map((friend) => ({
			// 			...friend,
			// 			status:
			// 				friend.playing === undefined
			// 					? PlayerStatus.offline
			// 					: friend.playing
			// 					? PlayerStatus.playing
			// 					: PlayerStatus.online /* playing | online | offline */,
			// 			my_friend: true,
			// 		}))
			// 		updateFriends.forEach(async (friend) => {
			// 			friend.avatar = await fetchAvatar(friend.avatar);
			// 		})
			// 		this.friends = updateFriends
			// 	} catch (error) {
			// 		console.error('axios failed inside user store : updateFriends()')
			// 		console.error(this.user)
			// 	}
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
						notificationsSocket: io(`ws://${location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`, {
							transports: ['websocket'],
							auth: {
								'token': token
							}
						}),
						gameSocket: io(`ws://${location.hostname}:${import.meta.env.VITE_BACKEND_PORT}/game`,
							{
								transports: ['websocket'],
								auth: {'token': token}
							}
						),
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

					this.user.gameSocket?.on('newInvite', handleNewInvite.bind(this));
					this.user.gameSocket?.on('newGame', handleNewGame.bind(this));
					this.user.gameSocket?.on('start', handleStart.bind(this));
					this.user.gameSocket?.on('end', handleEnd.bind(this));
					this.user.gameSocket?.on('newFrame', handlenewFrame.bind(this));

					this.friends = (await axios.get(`players/friends/${this.user.id}`, {params: {includePending: false}})).data
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
					this.publicUsers = await fetchPublicUsers(this.user.id);
					this.pendingUsers = await fetchPendingUsers(this.user.id);
					this.blockedUsers = (await axios.get('players/blocked')).data;
					this.blockedUsers.forEach(
						async (blockedUser) => {
							blockedUser.avatar = await fetchAvatar(blockedUser.avatar)
						}
					);
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
	const friends : Promise<Player[]> = (await axios.get(`players/friends/${id}`, {params: {includePending: false}})).data
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

// fetch all public users (all app users exept me, my friends and users I blocked)
async function fetchPublicUsers(id: number): Promise<Player[]> {
	if (debug) console.log("/Store/ fetchPublicUsers(" + id + ')');
	try {
		const publicUsers : Player[] = (await axios.get(`players/publicUsers/${id}`)).data
		publicUsers.forEach(async (publicUser : Player) => {
			publicUser.avatar = await fetchAvatar(publicUser.avatar);
		})
		// const player/Ids: number[] = publicUsers.map(player => player.id);
		// console.log("/Store/ fetchPublicUsers(" + id + ') Value publicUsers :' + playerIds)
		return publicUsers
	}
	catch (error) {
		console.error(`fetchPublicUsers() Exception: ${error}`)
		return [];
	}
}

// fetch all pending requests users
async function fetchPendingUsers(id: number): Promise<Player[]> {
	if (debug) console.log("/Store/ fetchPendingUsers(" + id + ')');
	try {
		const pendingUsers : Player[] = (await axios.get(`players/pendingUsers/${id}`)).data
		pendingUsers.forEach(async (publicUser : Player) => {
			publicUser.avatar = await fetchAvatar(publicUser.avatar);
		})
		// const player/Ids: number[] = pendingUsers.map(player => player.id);
		// console.log("/Store/ fetchPendingUsers(" + id + ') Value pendingUsers :' + playerIds)
		return pendingUsers
	}
	catch (error) {
		console.error(`fetchPendingUsers() Exception: ${error}`)
		return [];
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

	let friendID : number;

	if (data.recipientID == this.user.id) {
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

		friendID = data.requestorID;
	}
	else {
		friendID = data.recipientID;
	}
	
	//updating public users...
	const index = this.publicUsers.findIndex(
		(user: Player) => {
			return user.id == friendID
		}
	);

	if (-1 != index)
		this.publicUsers.splice(index, 1);

	//updating pending users
	const usr = await fetchPlayer(friendID);
	if (JSON.stringify(emptyUser) != JSON.stringify(usr)) {
		this.pendingUsers.push(usr);
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

	// Adding to friends
	const newFriend = await fetchPlayer(newFriendID);
	if (JSON.stringify(emptyUser) != JSON.stringify(newFriend)) {
		this.friends.push(newFriend);
	}

	// removing from pending
	const index = this.pendingUsers.findIndex(
		(usr: Player) => newFriendID == usr.id
	);

	if (-1 != index)
		this.pendingUsers.splice(index, 1);
}

async function handleFriendshipReject(
	this: any,
	data: FriendshipRejectAccept
)
{
	let	friendID: number;

	if (data.recipientID == this.user.id)
	{
		// remove notification
		const index = this.notifications.findIndex(
			(request: (FriendRequest & FriendRequestStatus)) => {
				return data.requestorID == request.requestorID
			}
		)

		if (-1 != index) {
			this.notifications.splice(index, 1);
		}

		// take friendID
		friendID = data.requestorID;
	}
	else {
		// take friendID
		friendID = data.recipientID;
	}
	
	// add as public user
	const newPublic = await fetchPlayer(friendID);
	if (JSON.stringify(emptyUser) != JSON.stringify(newPublic)) {
		this.publicUsers.push(newPublic);
	}

	// remove as friend
	const asFriend_index = this.friends.findIndex(
		(friend: Player) => {
			return (
				this.user.id === friendID
			);
		}
	)
	
	if (-1 != asFriend_index)
		this.friends.splice(asFriend_index, 1);

	// removing as pending
	const asPending_index = this.pendingUsers.findIndex(
		(usr: Player) => friendID === usr.id
	);

	if (-1 != asPending_index)
		this.pendingUsers.splice(asPending_index, 1);
}

async function handleBlockedUser(
	this: any,
	data: BlockedFriendship
)
{
	let asFriend_index: number;
	let asPublic_index: number;
	let asPending_index: number;
	let affectedUserID: number;
	let userBlocked: boolean;

	console.log('toggle-block-user: emitting from backend');

	// we are recipient: remove notification && get friend info
	if (data.recipientID == this.user.id) {
		let notificationsIndex = this.notifications.findIndex(
			(request: (FriendRequest & FriendRequestStatus)) => {
				return data.requestorID = request.requestorID
			}
		);
		if (-1 != notificationsIndex)
			this.notifications.splice(notificationsIndex, 1);
		
		affectedUserID = data.requestorID;
		userBlocked = data.requestor_blacklisted;
		asFriend_index = this.friends.findIndex(
			(friend: Player) => {
				return data.requestorID == friend.id
			}
		);
		asPublic_index = this.publicUsers.findIndex(
			(user: Player) => {
				return data.requestorID == user.id
			}
		)
	}
	// We are requestor: get friend info
	else {
		affectedUserID = data.recipientID;
		userBlocked = data.recipient_blacklisted;
		asFriend_index = this.friends.findIndex(
			(friend: Player) => {
				return data.recipientID == friend.id
			}
		);
		asPublic_index = this.publicUsers.findIndex(
			(user: Player) => {
				return data.recipientID == user.id
			}
		)
	}

	// remove from pending
	asPending_index = this.pendingUsers.findIndex(
		(usr: Player) => affectedUserID == usr.id
	);

	if (-1 != asPending_index)
		this.pendingUsers.splice(asPending_index, 1);

	// delete from friends if exists
	if (-1 != asFriend_index)
		this.friends.splice(asFriend_index, 1);
	
	// if any user is blocked, remove from public users, otherwise add it
	if (data.requestor_blacklisted || data.recipient_blacklisted) {
		console.log(`some user got blocked`);
		if (-1 != asPublic_index) {
			console.log(`removing from public users`);
			this.publicUsers.splice(asPublic_index, 1);
		}
	}
	else {
		const affectedUser = await fetchPlayer(affectedUserID);
		if (JSON.stringify(emptyUser) != JSON.stringify(affectedUser))
			this.publicUsers.push(affectedUser);
	}

	// if blocked, add to blocked users, otherwise remove from it
	if (userBlocked) {
		const affectedUser = await fetchPlayer(affectedUserID);
		if (JSON.stringify(emptyUser) != JSON.stringify(affectedUser)) {
			this.blockedUsers.push(affectedUser);
		}
	}
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

// Game Sockets Events

async function handleNewInvite(this: any) {
	if (debug) console.log("/Store/ handleNewInvite()");
}

async function handleNewGame(this: any, game: {hostID : number, guestID : number}) {
	if (debug) console.log("/Store/ handleNewGame()");

	// let opponentID : number = (game.hostID == this.user.id)? game.guestID : game.hostID;
	// if (debug) console.log('opponentID : ' + opponentID)
	
	// this.OpponentName = (await fetchPlayer.value(opponentID)).username;
	// if (debug) console.log('OpponentName : ' + this.OpponentName)
	
	// this.foundOpponent = true;
	// if (debug) console.log('foundOpponent : ' + this.foundOpponent)

	// filling game info <--- game identifying data
	this.currentGame.game_info.hostID = game.hostID;
	this.currentGame.game_info.hostName = this.user.id == game.hostID ?
		this.user.username :
		(await fetchPlayer(game.hostID)).username;
	this.currentGame.game_info.guestID = game.guestID;
	this.currentGame.game_info.guestName = this.user.id == game.guestID ?
		this.user.username :
		(await fetchPlayer(game.guestID)).username;
}

async function handleStart(this: any) {
	if (debug) console.log("/Store/ handleStart()");
}

async function handleEnd(this: any) {
	if (debug) console.log("/Store/ handleEnd()");
}

async function handlenewFrame(this: any) {
	if (debug) console.log("/Store/ handlenewFrame()");
}

