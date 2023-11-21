/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayerStore.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 20:18:38 by earendil          #+#    #+#             */
/*   Updated: 2023/11/21 22:19:05 by mmarinel         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { defineStore, type StoreDefinition } from 'pinia'
import axios from 'axios'
import {io, Socket} from 'socket.io-client'
import router from '@/router'

axios.defaults.baseURL = 'http://' + location.hostname + ':' + import.meta.env.VITE_BACKEND_PORT

const debug = true

export enum PlayerStatus {
	offline = 'offline',
	online = 'online',
	playing = 'playing'
}

export class FriendRequest {
	public requestorID: number;
	public requestorUsername: string;
	public requestorAvatar: string;
	public recipientID: number;

	constructor() {
		this.requestorID = -1;
		this.requestorUsername = 'NaN';
		this.requestorAvatar = 'NaN';
		this.recipientID = -1;
	}
}

//? TOGLIERE
export class FriendRequestStatus {
	public status: 'loading' | 'accepted' | 'rejected';

	constructor() {this.status = 'loading';}
}

export class FriendshipRejectAccept {
	public requestorID: number;
	public recipientID: number;

	constructor() {
		this.requestorID = -1;
		this.recipientID = -1;
	}
}

export class BlockedFriendship {
	public requestorID: number;
	public recipientID: number;
	public requestor_blacklisted: boolean;
	public recipient_blacklisted: boolean;

	constructor() {
		this.requestorID = -1;
		this.requestor_blacklisted = false;
		this.recipientID = -1;
		this.recipient_blacklisted = false;
	}
}

export class FriendRequestUpdate {
	public are_friends: boolean;
	public pending_friendship: boolean;
	public requestor_blacklisted: boolean;
	public recipient_blacklisted: boolean;
	public requestorID: number;
	public recipientID: number;

	constructor() {
		this.are_friends = false;
		this.pending_friendship = false;
		this.requestor_blacklisted = false;
		this.recipient_blacklisted = false;
		this.requestorID = -1;
		this.recipientID = -1;
	}
}

export class FriendRequestError {
	public msg: string;
	public requestorID: number;
	public recipientID: number;

	constructor() {
		this.msg = 'NaN';
		this.requestorID = -1;
		this.recipientID = -1;
	}
}

export class Player {
	public id: number;
	public username: string;
	public avatar: string;
	public firstName: string;
	public lastName: string;
	public playing: boolean | undefined;
	public status: PlayerStatus;
	public my_friend: boolean;
	public notificationsSocket: Socket | null;
	public gameSocket: Socket | null;
	public token:	string | null;
	public twofaSecret: string//?RIMUOVERE;
	public profile_completed: boolean;

	constructor() {
		this.id = -1;
		this.username = 'Nan';
		this.avatar = 'Nan';
		this.firstName = 'Nan';
		this.lastName = 'Nan';
		this.playing = undefined;
		this.status = PlayerStatus.offline;
		this.my_friend = true;
		this.notificationsSocket = null;
		this.gameSocket = null;
		this.token = null;
		this.twofaSecret = 'NaN';
		this.profile_completed = false;
	}
};

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

export class Achievement {
	public name: string;
	public description: string;
	public picture: string;

	constructor() {
		this.name = 'Nan';
		this.description = 'Nan';
		this.picture = 'Nan';
	}
};

export class Game {
	public createdAt: string;
	public dateString: string;
	public host: string;
	public guest: string;
	public host_score: number;
	public guest_score: number;

	constructor() {
		this.createdAt = 'NaN';
		this.dateString = 'Nan';
		this.host = 'Nan';
		this.guest = 'NaN';
		this.host_score = 0;
		this.guest_score = 1;
	}
};

// GAME STRUCTURES

// frame.dto.ts
export class PlayerGameData {
	public paddle: {
		w: number,
		h: number
		sx: number,
		sy: number,
		y: number
	};
	public score: number;

	constructor() {
		this.paddle = {
			w: -1,
			h: -1,
			sx: -1,
			sy: -1,
			y: -1
		};
		this.score = -1;
	}
};

const emptyPlayerGameData = {
	paddle: {
		w: 0,
		h: 0,
		sx: 0,
		sy: 0,
		y: 0,
	},
	score: 0,
};

// frame.dto.ts
export class FrameData {
	public canvas: {
		w: number,
		h: number
	};
	public ball: {
		radius: number;
		sx: number, sy: number;
		x: number, y: number;
		dx: number, dy: number;
	};
	public host: PlayerGameData;
	public guest: PlayerGameData;

	constructor() {
		this.canvas = {
			w: -1,
			h: -1,
		};
		this.ball = {
			radius: 0,
			sx: 0, sy: 0,
			x: 0, y: 0,
			dx: 0, dy: 0,
		};
		this.host = new PlayerGameData();
		this.guest = new PlayerGameData();
	}
}

export class InviteDto {
	hostID: number;
	guestID: number;
	constructor(){
		this.hostID = -1;
		this.guestID = -1;
	}
};

export class CustomizationOptions {
	public pitch_color: string;
	public paddle_color: string;
	public ball_color: string;
	constructor() {
		this.pitch_color = '#FFFFFF';
		this.paddle_color = '#000000';
		this.ball_color = '#000000';
	}
};

export class FrameDto {
	public hostId? : number;
	public guestID? : number;
	public seq : number;
	public data : FrameData;
	constructor(){
		this.hostId = 0;
		this.guestID = 0;
		this.seq = 0;
		this.data = new FrameData();
	}
};

export class Invite {
	public received : boolean;
	public senderID : number;
	public senderUsername : string;
	public sent : boolean;
	public recipientID : number;
	constructor(){
		this.received = false;
		this.senderID = 0;
		this.senderUsername = '';
		this.sent = false;
		this.recipientID = 0;
	}
};

export class GameInfo {
	public hostID : number;
	public guestID : number;
	public watcher : boolean;
	constructor () {
		this.hostID = 0;
		this.guestID = 0;
		this.watcher = false;
	}
};

export class currentGame {
	public host: Player;
	public guest: Player;
	public gameInfo: GameInfo
	public customizations: CustomizationOptions
	public frame: FrameDto
	public invite : Invite
	public status: 'undefined' | 'building' | 'playing' | 'end';
	public waiting: 'undefined' | 'matchmaking' | 'invite' | 'streaming' | 'customization' | 'playing';
	public endReason : 'undefined' | 'hostWin' | 'guestWin' | 'userLeft' | 'aPlayerLeft' | 'opponentLeft';
	public finalScore : { host : number, guest : number};
	
	constructor(){
		this.host = new Player();
		this.guest = new Player();
		this.gameInfo = new GameInfo();
		this.customizations = new CustomizationOptions();
		this.frame = new FrameDto();
		this.invite = new Invite();
		this.status = 'undefined';
		this.waiting = 'undefined';
		this.endReason = 'undefined';
		this.finalScore = { host : 0, guest : 0};
	}
};


// endGame.dto.ts
export class endGameDto {
	public hostWin: boolean;
	public guestWin: boolean;
	public hostScore: number;
	public guestScore: number;

	constructor() {
		this.hostWin = false;
		this.guestWin = false;
		this.hostScore = 0;
		this.guestScore = 0;
	}
};


//?: make multiple players store
export const usePlayerStore: StoreDefinition<any> = defineStore('PlayerStore', {
		state: (): {
			user: Player,
			currentGame: currentGame
			loading: boolean, //TODO ? forse rimuovere
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
				user: new Player(),
				currentGame: new currentGame(),
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
				
				if (!this.user.gameSocket)
					console.log(`user socket is undefined`);
				console.log(`user socket: ${this.user.gameSocket}`);
				console.log(`socketID: ${this.user.gameSocket?.id}`);
				this.user.gameSocket?.emit('matchMaking', {
					userID: this.user.id
				});
				this.currentGame.waiting = 'matchmaking'
			},
			// maybe delete acknoledgements
			cancelMatchMakingRequest() {
				if (debug) console.log("/Store/ cancelMatchMakingRequest");
				
				this.user.gameSocket?.emit('cancelMatchMaking', {
					userID: this.user.id
				});
				this.currentGame.waiting = 'undefined'

				// this.user.gameSocket?.timeout(5000).emit('cancelMatchMaking', {
				// 	userID: this.user.id
				// }, (response: boolean) => {
				// 	console.log('Cancel Matchmaking acknowledgment:', response);
				// 	console.log('this.currentGame.waiting', this.currentGame.waiting);
				// 	if (response == true) {
				// 		this.currentGame.waiting = 'undefined';
				// 	}
				// 	 else {
				// 	}
				// 	console.log('this.currentGame.waiting', this.currentGame.waiting);
				// });
				

			},

			// invitation : Sender
			sendInvitation(guestID : number) {
				if (debug) console.log(`/Store/ sendInvitation from user ${this.user.id} to ${guestID} `);
				this.user.gameSocket?.emit('sendInvite', { 
					invite : {
						hostID: this.user.id,
						guestID: guestID,					
					}
				});
				if (debug) console.log(`/Store/ emit: sendInvite`);
				this.currentGame.waiting = 'invite'
				this.currentGame.invite.sent = true
				this.currentGame.invite.recipientID = guestID

				// this.user.gameSocket?.timeout(5000).emit('sendInvite', {
				// 	hostID: this.user.id,
				// 	guestID: guestID,
				// }, (response: boolean) => {
				// 	console.log('sendInvitation() acknowledgment:', response);
				// 	if (response == true) {
				// 		this.currentGame.waiting = 'invite'
				// 	}
				// });


			},
			cancelInvitation() {
				if (debug) console.log(`/Store/ cancelInvitation from user ${this.user.id} to ${this.currentGame.invite.recipientID} `);
				this.user.gameSocket?.emit('cancelInvite', {
					invite : {
						hostID: this.user.id,
						guestID: this.currentGame.invite.recipientID,					
					}
				});
				if (debug) console.log(`/Store/ emit: cancelInvite`);
				this.currentGame.waiting = 'undefined'
				this.currentGame.invite.sent = false
				this.currentGame.invite.recipientID = 0
				this.currentGame.invite.recipientUsername = ''
			},

			// invitation : Receiver
			acceptInvitation() {
				if (debug) console.log(`/Store/ acceptInvitation from user ${this.user.id} to ${this.currentGame.invite.senderID}`);
				this.user.gameSocket?.emit('acceptInvite', {
					invite : {
						hostID: this.currentGame.invite.senderID,
						guestID: this.user.id,					
					}
				});
				if (debug) console.log(`/Store/ emit: acceptInvite`);
				this.currentGame.invite.received = false
				this.currentGame.invite.senderID = 0
				this.currentGame.invite.senderUsername = ''
			},
			rejectInvitation() {
				if (debug) console.log(`/Store/ rejectInvitation from user ${this.user.id} to ${this.currentGame.invite.senderID}`);
				this.user.gameSocket?.emit('rejectInvite', {
					invite : {
						hostID: this.currentGame.invite.senderID,
						guestID: this.user.id,					
					}
				});
				if (debug) console.log(`/Store/ emit: rejectInvite`);
				this.currentGame.invite.received = false
				this.currentGame.invite.senderID = 0
				this.currentGame.invite.senderUsername = ''
			},

			// streaming
			sendStreamingRequest(playerID: number) {
				if (debug) console.log("/Store/ sendStreamingRequest");
				this.user.gameSocket?.emit('joinGame', {
					userID: this.user.id,
					playerID,
				});

				// this.user.gameSocket?.timeout(5000).emit('joinGame', {
				// 	userID: this.user.id,
				// 	playerID,
				// }, (response: boolean) => {
				// 	console.log('sendStreamingRequest() acknowledgment:', response);
				// 	if (response == false) {
				// 		//! snackbar couldn't load live game
				// 		console.log(`user : ${this.user.id} could not load live game (player: ${playerID})`)
				// 	}
				// });

			},

			// game
			sendCustomizationOptions(customization: CustomizationOptions) {
				if (debug) console.log("/Store/ sendCustomizationOptions");
				
				this.currentGame.customizations = customization

				this.user.gameSocket?.emit('sendCustomizationOptions', {
					customization: this.currentGame.customizations,
					gameInfo: this.currentGame.gameInfo,
					userID: this.user.id
				});
				this.currentGame.waiting = 'customization'

			},

			sendFrame(frame: FrameDto) {
				if (debug) console.log("/Store/ sendFrame");
				this.user.gameSocket?.emit('newFrame', frame);
			},

			exitGame() {
				if (debug) console.log("/Store/ exitGame");
				this.user.gameSocket?.emit("leaveGame", {
					userID: this.user.id
				})
				this.currentGame.waiting = 'undefined'
				if (this.currentGame.status == 'building' || this.currentGame.status == 'playing' ) {
					this.currentGame.status = 'end'
					this.currentGame.endReason = 'userLeft'
				}
			},


			resetUser(user : Player){
				user.id = -1
				user.username = 'Nan'
				user.avatar = 'Nan'
				user.firstName = 'Nan'
				user.lastName = 'Nan'
				user.playing = undefined
				user.status = PlayerStatus.offline
				user.my_friend = true
				user.notificationsSocket = null
				user.gameSocket = null
				user.token = null
				user.twofaSecret = 'Nan'
				user.profile_completed = false
			},


			resetGame() {
				if (debug) console.log("/Store/ resetGame");
				// this.currentGame = emptyCurrentGame;

				// empty struct are not working
				this.currentGame.host = new Player();
				this.currentGame.guest = new Player();
				// Object.assign(this.currentGame.host, emptyUser);
				// Object.assign(this.currentGame.guest, emptyUser);

				// this.resetUser(this.currentGame.host)
				// this.resetUser(this.currentGame.guest)
				
				this.currentGame.gameInfo = new GameInfo();
				// Object.assign(this.currentGame.gameInfo, emptyGameInfo);

				// this.currentGame.gameInfo.hostID = 0
				// this.currentGame.gameInfo.guestID = 0
				// this.currentGame.gameInfo.watcher = false

				this.currentGame.customizations = new CustomizationOptions()
				// Object.assign(this.currentGame.customizations, emptyCustomizationOptions);

				// this.currentGame.customizations.pitch_color = '#FFFFFF'
				// this.currentGame.customizations.paddle_color = '#000000'
				// this.currentGame.customizations.ball_color = '#000000'

				// empty struct are not working
				this.currentGame.frame = new FrameDto()
				// Object.assign(this.currentGame.frame, emptyFrameDto);

				// this.currentGame.frame =  emptyFrameDto,

				this.currentGame.invite.received = false
				this.currentGame.invite.senderID = 0
				this.currentGame.invite.senderUsername = ''
				this.currentGame.invite.sent = false
				this.currentGame.invite.recipientID = 0
				this.currentGame.invite.recipientUsername = ''

				this.currentGame.status =  'undefined'
				this.currentGame.waiting =  'undefined'
				this.currentGame.endReason  =  'undefined'

				this.currentGame.finalScore.host = 0
				this.currentGame.finalScore.guest = 0
			},

			//! to delete
			updateWaitingTesting(value : 'undefined'  | 'matchmaking' | 'invite' | 'streaming' | 'customization' | 'playing',){
				this.currentGame.waiting = value;
			},
			updateStatusTesting(value : 'undefined' | 'building' | 'playing' | 'end'){
				this.currentGame.status = value;
			},
			updateInviteTesting(value : boolean){
				this.currentGame.invite.received = value;
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
					this.user.gameSocket?.on('deleteInvite', handleDeleteInvite.bind(this));
					this.user.gameSocket?.on('rejectedInvite', handleRejectedInvite.bind(this));
					this.user.gameSocket?.on('newGame', handleNewGame.bind(this));
					this.user.gameSocket?.on('startGame', handleStart.bind(this));
					this.user.gameSocket?.on('endGame', handleEnd.bind(this));
					this.user.gameSocket?.on('newFrame', handlenewFrame.bind(this));
					this.user.gameSocket?.on('connect_error', (err) => {
						console.log(`connect error: ${err}`);
					})

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

	if (id <= 0)
		return user

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

// Received events : Game Sockets
// Invites
async function handleNewInvite(this: any, invite : InviteDto) : Promise<boolean> {
	if (debug) console.log("/Store/ handleNewInvite()");
	if (this.currentGame.invite.received == false){
		this.currentGame.invite.received = true
		this.currentGame.invite.senderID = invite.hostID
		this.currentGame.invite.senderUsername = (await fetchPlayer(invite.hostID)).username	
		return true	
	}
	return false
}
async function handleDeleteInvite(this: any, invite : InviteDto) {
	if (debug) console.log("/Store/ handleDeleteInvite()");
	if (invite.hostID == this.currentGame.invite.senderID){
		this.currentGame.invite.received = false
		this.currentGame.invite.senderID = 0
		this.currentGame.invite.senderUsername = ''		
	}
}
async function handleRejectedInvite(this: any) {
	if (debug) console.log("/Store/ handleRejectedInvite()");
	//! here we should have some sort of snackbar on host session : guest rejected offer
	this.currentGame.waiting = 'undefined'
	this.currentGame.invite.sent = false
	this.currentGame.invite.recipientID = 0
	this.currentGame.invite.recipientUsername = ''
}

// Game
async function handleNewGame(this: any, game: {hostID : number, guestID : number, watcher : boolean}) {
	if (debug) console.log("/Store/ handleNewGame()");

	if(this.currentGame.invite.sent){
		this.currentGame.invite.sent = false
		this.currentGame.invite.recipientID = 0
	}
	if(this.currentGame.invite.received){
		this.currentGame.invite.received = false
		this.currentGame.invite.senderID = 0
		this.currentGame.invite.senderUsername = ''		
	}

	this.currentGame.gameInfo.hostID = game.hostID;
	this.currentGame.gameInfo.guestID = game.guestID;
	this.currentGame.gameInfo.watcher = game.watcher;

	// this.currentGame.host = (this.user.id == game.hostID)? this.user : (await fetchPlayer(game.hostID))
	Object.assign(this.currentGame.host, (this.user.id == game.hostID)? this.user : (await fetchPlayer(game.hostID)));
	// this.currentGame.guest = (this.user.id == game.guestID)? this.user : (await fetchPlayer(game.guestID))
	Object.assign(this.currentGame.guest, (this.user.id == game.guestID)? this.user : (await fetchPlayer(game.guestID)));

	router.push('/game')
	this.user.status = 'playing'
	this.currentGame.status = 'building'
	this.currentGame.waiting = 'undefined'
}

async function handleStart(this: any, customization: CustomizationOptions) {
	if (debug) console.log("/Store/ handleStart()");

	// this.currentGame.customization = customization
	Object.assign(this.currentGame.customizations, customization);
	// this.currentGame.customizations.pitch_color = customization.pitch_color
	// this.currentGame.customizations.paddle_color = customization.paddle_color
	// this.currentGame.customizations.ball_color = customization.ball_color
	this.currentGame.status = 'playing'
	this.currentGame.waiting = 'undefined'
}

async function handlenewFrame(this: any, frame: FrameDto) {
	if (debug) console.log("/Store/ handlenewFrame()");
	this.currentGame.frame = frame
}

async function handleEnd(this: any, endGame : endGameDto) {
	if (debug) console.log("/Store/ handleEnd() current status : " + this.currentGame.status);
	this.user.gameSocket?.emit("leaveGame", {
		userID: this.user.id
	})	
	if (this.currentGame.status == 'building' || this.currentGame.status == 'playing'){
		this.currentGame.status = 'end'

		if (endGame.hostWin)
			this.currentGame.endReason = 'hostWin'
		else if (endGame.guestWin)
			this.currentGame.endReason = 'guestWin'
		else if (this.currentGame.gameInfo.watcher)
			this.currentGame.endReason = 'aPlayerLeft'
		else
			this.currentGame.endReason = 'opponentLeft'
	}
	
	this.currentGame.finalScore.host = endGame.hostScore
	this.currentGame.finalScore.guest = endGame.guestScore

	this.user.status = 'online'
}
