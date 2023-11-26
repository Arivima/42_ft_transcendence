/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayerStore.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 20:18:38 by earendil          #+#    #+#             */
/*   Updated: 2023/11/26 13:01:21 by mmarinel         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { defineStore, type StoreDefinition } from 'pinia'
import axios from 'axios'
import {io, Socket} from 'socket.io-client'
import router from '@/router'

axios.defaults.baseURL = 'http://' + location.hostname + ':' + import.meta.env.VITE_BACKEND_PORT

const debug = false

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
	// reset(){
	// 	this.id = -1;
	// 	this.username = 'Nan';
	// 	this.avatar = 'Nan';
	// 	this.firstName = 'Nan';
	// 	this.lastName = 'Nan';
	// 	this.playing = undefined;
	// 	this.status = PlayerStatus.offline;
	// 	this.my_friend = true;
	// 	this.notificationsSocket = null;
	// 	this.gameSocket = null;
	// 	this.token = null;
	// 	this.twofaSecret = 'NaN';
	// 	this.profile_completed = false;
	// }
	// isEmpty() : boolean {
	// 		console.log('// PlayerStore | class Player | isEmpty()')
	// 	return (
	// 		this.id == -1 &&
	// 		this.username == 'Nan' &&
	// 		this.avatar == 'Nan' &&
	// 		this.firstName == 'Nan' &&
	// 		this.lastName == 'Nan' &&
	// 		this.playing == undefined &&
	// 		this.status == PlayerStatus.offline &&
	// 		this.my_friend == true &&
	// 		this.notificationsSocket == null &&
	// 		this.gameSocket == null &&
	// 		this.token == null &&
	// 		this.twofaSecret == 'NaN' &&
	// 		this.profile_completed == false
	// 	)
	// }
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

export class InviteDto {
	hostID: number;
	guestID: number;
	constructor(){
		this.hostID = -1;
		this.guestID = -1;
	}
};

export class CustomizationOptions {
	public customization : boolean;
	public pitch_color: string;
	public paddle_color: string;
	public ball_color: string;

	constructor() {
		if (debug) console.log('/Store/ class CustomizationOptions | constructor()')
		this.customization = false;
		this.pitch_color = '#FFFFFF'; /*white*/
		this.paddle_color = '#800080'; /*purple*/ /*'#000000'; black*/
		this.ball_color = '#800080'; /*purple*/ /*'#000000'; black*/
	}
	reset(){
		if (debug) console.log('/Store/ class CustomizationOptions | reset()')
		this.customization = false;
		this.pitch_color = '#FFFFFF';
		this.paddle_color = '#800080';
		this.ball_color = '#800080';
	}
};


export class PaddleDto {
	public w: number;
	public h: number;
	public x: number;
	public y: number;
	public color: string;
	constructor() {
		this.w = 2/100;
		this.h = 20/100;
		this.x = 0;
		this.y = 0.5 - this.h / 2;
		this.color = '#800080';
	}
}

export class BallDto {
	public radius: number;
	public color: string;
	public x: number;
	public y: number;
	public dx: number;
	public dy: number;
	constructor() {
		this.radius = 1/64;
		this.color = '#800080';
		this.x = Math.random();
		this.y = Math.random();
		this.dx = ((Math.random() * 100 ) % 2) ? 1 : -1;
		this.dy = ((Math.random() * 100 ) % 2) ? 1 : -1;
	}
}

export class PlayerGameData {
	public paddle: PaddleDto
	public score: number;

	constructor() {
		this.paddle = new PaddleDto();
		this.score = 0;
	}
};

export class FrameData {
	public ball: BallDto;
	public host: PlayerGameData;
	public guest: PlayerGameData;

	constructor() {
		this.ball = new BallDto();
		this.host = new PlayerGameData();
		this.guest = new PlayerGameData();

		this.host.paddle.x = 0
		this.guest.paddle.x = 1 - this.guest.paddle.w
	}
}
export class FrameDto {
	public hostID : number;
	public guestID : number;
	public seq : number;
	public data : FrameData;

	constructor(){
		if (debug) console.log('/Store/ class FrameDto | constructor()')
		this.hostID = 0;
		this.guestID = 0;
		this.seq = 0;
		this.data = new FrameData();
	}
	reset(){
		if (debug) console.log('/Store/ class FrameDto | reset()')
		this.hostID = 0;
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
	public recipientUsername : string;

	constructor(){
		if (debug) console.log('/Store/ class Invite | constructor()')
		this.received = false;
		this.senderID = 0;
		this.senderUsername = '';

		this.sent = false;
		this.recipientID = 0;
		this.recipientUsername = '';
	}
	reset(){
		if (debug) console.log('/Store/ class Invite | reset()')
		this.received = false;
		this.senderID = 0;
		this.senderUsername = '';

		this.sent = false;
		this.recipientID = 0;
		this.recipientUsername = '';
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

export class CurrentGame {
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
		if (debug) console.log('/Store/ class CurrentGame | constructor()')
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
	reset(){
		if (debug) console.log('/Store/ class CurrentGame | reset()')
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

export class ActiveGameDto
{
	public roomId: string
	public hostID: number
	public guestID: number
	public customization: CustomizationOptions

	public hostUsername: string
	public hostAvatar: string
	public guestUsername: string
	public guestAvatar: string

	constructor() {
		this.roomId = '-1';
		this.hostID = -1;
		this.guestID = -1;
		this.customization = new CustomizationOptions();

		this.hostUsername = '';
		this.guestUsername = '';
		this.hostAvatar = '';
		this.guestAvatar = '';
	}
};


//?: make multiple players store
export const usePlayerStore: StoreDefinition<any> = defineStore('PlayerStore', {
		state: (): {
			user: Player,
			currentGame: CurrentGame
			liveStreams : ActiveGameDto[]
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
			fetchAvatar: (avatar: string) => Promise<string>
			achievements: Achievement[],
			notifications: (FriendRequest & FriendRequestStatus)[],
		} => {
			return {
				user: new Player(),
				currentGame: new CurrentGame(),
				liveStreams: [] as ActiveGameDto[],
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
				fetchAvatar: fetchAvatar,
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
				if (debug) console.log(`/Store/ sendFriendshipRequest: ${recipientID}`);
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
				if (debug) console.log(`/Store/ blockUser: emitting to backend: profileID: ${profileID}; ${block}`);
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
					if (debug) console.log(`/Store/ user socket is undefined`);
				if (debug) console.log(`/Store/ user socket: ${this.user.gameSocket}`);
				if (debug) console.log(`/Store/ socketID: ${this.user.gameSocket?.id}`);
				this.user.gameSocket?.emit('matchMaking', {
					userID: this.user.id
				});
				if (debug) console.log('%c emit("matchMaking")', 'background: blue; color: white')
				this.currentGame.waiting = 'matchmaking'
			},
			// maybe delete acknoledgements
			cancelMatchMakingRequest() {
				if (debug) console.log("/Store/ cancelMatchMakingRequest");
				
				this.user.gameSocket?.emit('cancelMatchMaking', {
					userID: this.user.id
				});
				if (debug) console.log('%c emit("cancelMatchMaking")', 'background: blue; color: white')
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
				if (debug) console.log('%c emit("sendInvite")', 'background: blue; color: white')
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
				if (debug) console.log('%c emit("cancelInvite")', 'background: blue; color: white')
				this.currentGame.invite.reset()
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
				if (debug) console.log('%c emit("acceptInvite")', 'background: blue; color: white')
				this.currentGame.invite.reset()

			},
			rejectInvitation() {
				if (debug) console.log(`/Store/ rejectInvitation from user ${this.user.id} to ${this.currentGame.invite.senderID}`);
				this.user.gameSocket?.emit('rejectInvite', {
					invite : {
						hostID: this.currentGame.invite.senderID,
						guestID: this.user.id,					
					}
				});
				if (debug) console.log('%c emit("rejectInvite")', 'background: blue; color: white')
				this.currentGame.invite.reset()

			},

			// streaming
			sendGetActiveGames() {
				console.log(`/ Store / emit getActiveGames`);
				this.user.gameSocket?.emit('getActiveGames');
			},

			sendStreamingRequest(playerID: number) {
				console.log("/Store/ sendStreamingRequest from "  + this.user.id + " to " + playerID);
				this.user.gameSocket?.emit('joinGame', {
					userID: this.user.id,
					playerID,
				});
				console.log('%c emit("joinGame")', 'background: blue; color: white')

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
				if (debug) console.log('%c emit("sendCustomizationOptions")', 'background: blue; color: white')
				this.currentGame.waiting = 'customization'

			},

			sendFrame(frame: FrameDto) {
				if (debug) console.log("/Store/ sendFrame");
				this.user.gameSocket?.emit('newFrame', {
					frame: frame, 
					userID: this.user.id,
				});
				if (debug) console.log(`%c emit("newFrame") #${frame.seq}`, 'background: blue; color: white')
			},

			exitGame() {
				if (debug) console.log("/Store/ exitGame");

				this.user.gameSocket?.emit("leaveGame", {
					userID: this.user.id
				})
				if (debug) console.log('%c emit("leaveGame")', 'background: red; color: black')
				this.currentGame.waiting = 'undefined'
				if (this.currentGame.status == 'building' || this.currentGame.status == 'playing' ) {
					this.currentGame.status = 'end'
					if (this.currentGame.endReason == 'undefined')
						this.currentGame.endReason = 'userLeft'
				}
				// this.user.status = PlayerStatus.online
			},

			forceCanvasUnmount() {
				if (debug) console.log("/Store/ showEndDialog");
				this.currentGame.waiting = 'undefined'
				this.currentGame.status = 'undefined'
			},

			resetGame() {
				if (debug) console.log("/Store/ resetGame");
				if (debug) console.log('%c currentGame RESET', 'background: red; color: black')
				this.currentGame.reset()
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

					this.user.gameSocket?.on('getActiveGames', handleNewActiveGames.bind(this));
					// this.user.gameSocket?.on('newStream', handleNewStream.bind(this));
					// this.user.gameSocket?.on('endStream', handleEndStream.bind(this));
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
					// this.user.reset();
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
				// this.user.reset()
				Object.assign(this.user, emptyUser);
				// this.user = emptyUser;
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

	// let user : Player = new Player()
	let user : Player = emptyUser

	if (id <= 0)
		return user

		let player : Player = (await axios.get(`players/${id}`)).data
	// 	let player : Player = new Player()
	// player = (await axios.get(`players/${id}`)).data
	user = {
		...player,
		status:
			player.playing === undefined
				? PlayerStatus.offline
				: true === player.playing
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
	if (debug) console.log(`/Store/ new-friendship-request emitted from the server`);

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
	// if (usr.isEmpty() == false){
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
	if (debug) console.log(`/Store/ handleFriendshipAccept: {requestorID: ${data.requestorID}, recipientID: ${data.recipientID}}`);
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
	// if (newFriend.isEmpty() == false){
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
	// if (newPublic.isEmpty() == false){
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

	if (debug) console.log('/Store/ toggle-block-user: emitting from backend');

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
		if (debug) console.log(`/Store/ some user got blocked`);
		if (-1 != asPublic_index) {
			if (debug) console.log(`/Store/ removing from public users`);
			this.publicUsers.splice(asPublic_index, 1);
		}
	}
	else {
		const affectedUser = await fetchPlayer(affectedUserID);
		// if (affectedUser.isEmpty() == false)
			if (JSON.stringify(emptyUser) != JSON.stringify(affectedUser))
			this.publicUsers.push(affectedUser);
	}

	// if blocked, add to blocked users, otherwise remove from it
	if (userBlocked) {
		const affectedUser = await fetchPlayer(affectedUserID);
		// if (affectedUser.isEmpty() == false){
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
	//! in this part we should have snackbar to better handle UE
async function handleNewInvite(this: any, invite : InviteDto) : Promise<boolean> {
	if (debug) console.log("/Store/ handleNewInvite()");
	if (debug) console.log('%c received("newInvite")', 'background: purple; color: white')
	// can receive new invites only if has not sent any AND is not already handling invites
	if (this.currentGame.invite.received == false && this.currentGame.invite.sent == false){
		this.currentGame.invite.received = true
		this.currentGame.invite.senderID = invite.hostID
		this.currentGame.invite.senderUsername = (await fetchPlayer(invite.hostID)).username	
		return true	
	}
	return false
}
async function handleDeleteInvite(this: any, invite : InviteDto) {
	if (debug) console.log("/Store/ handleDeleteInvite()");
	if (debug) console.log('%c received("deletedInvite")', 'background: purple; color: white')
	if (invite.hostID == this.currentGame.invite.senderID){
		this.currentGame.invite.reset()	
	}
}
async function handleRejectedInvite(this: any) {
	if (debug) console.log("/Store/ handleRejectedInvite()");
	if (debug) console.log('%c received("rejectedInvite")', 'background: purple; color: white')
	//! in this part we should have some sort of snackbar on host session : guest rejected offer
	this.currentGame.waiting = 'undefined'
	this.currentGame.invite.reset()
}

// Game
async function handleNewGame(this: any, game: {hostID : number, guestID : number, watcher : boolean}) {
	console.log("/Store/ handleNewGame()");
	console.log('%c received("newGame")', 'background: purple; color: white')

	if(this.currentGame.invite.sent || this.currentGame.invite.received){
		this.currentGame.invite.reset()
	}

	this.currentGame.frame.hostID = game.hostID;
	this.currentGame.frame.guestID = game.guestID;

	this.currentGame.gameInfo.hostID = game.hostID;
	this.currentGame.gameInfo.guestID = game.guestID;
	this.currentGame.gameInfo.watcher = game.watcher;

	Object.assign(this.currentGame.host, (this.user.id == game.hostID)? this.user : (await fetchPlayer(game.hostID)));
	Object.assign(this.currentGame.guest, (this.user.id == game.guestID)? this.user : (await fetchPlayer(game.guestID)));

	router.push('/game')
	// this.user.status = PlayerStatus.playing
	this.currentGame.status = 'building'
	this.currentGame.waiting = 'undefined'
}

async function handleStart(this: any, customization: CustomizationOptions) {
	console.log("/Store/ handleStart()");
	console.log('%c received("startGame")', 'background: purple; color: white')

	Object.assign(this.currentGame.customizations, customization);

	this.currentGame.status = 'playing'
	this.currentGame.waiting = 'undefined'
}

async function handlenewFrame(this: any, frame: FrameDto) {
	if (debug) console.log("/Store/ handlenewFrame()");
	if (debug) console.log(`%c received("newFrame") #${frame.seq}`, 'background: cyan; color: white')

	this.currentGame.frame = frame
}

async function handleEnd(this: any, endGame : endGameDto) {
	if (debug) console.log("/Store/ handleEnd() current status : " + this.currentGame.status);
	if (debug) console.log('%c received("endGame")', 'background: purple; color: white')
	this.user.gameSocket?.emit("leaveGame", {
		userID: this.user.id
	})
	if (debug) console.log('%c emit("leaveGame")', 'background: red; color: black')

	this.currentGame.waiting = 'undefined'

	if (this.currentGame.status == 'building' || this.currentGame.status == 'playing'){
		this.currentGame.status = 'end'

		if (this.currentGame.endReason == 'undefined'){
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
	}
	this.user.status = PlayerStatus.online
}

async function handleNewActiveGames(this: any, activeGames: ActiveGameDto[]) {
	console.log(`/ Store / handleNewActiveGames`);

	for (const game of activeGames)
	{
		console.log(`next game: roomId: ${game.roomId}; hostID: ${game.hostID}; guestID: ${game.guestID}`);

		const host = await fetchPlayer(game.hostID);
		const guest = await fetchPlayer(game.guestID);

		game.hostUsername = host.username;
		game.hostAvatar = host.avatar;
		game.guestUsername = guest.username;
		game.guestAvatar = guest.avatar;
	}

	this.liveStreams = activeGames;
}

// async function handleNewStream(this: any, game: {hostID : number, guestID : number, watcher : boolean}) {
// 	console.log("/Store/ handleNewStream()");
// 	console.log('%c received("newStream")', 'background: yellow; color: black')

// 	if (!this.liveStreams.has(game.hostID) || this.liveStreams.get(game.hostID) !== game.guestID)
// 	{
// 		console.log(`adding game instance to streaming list`);
// 		this.liveStreams.set(game.hostID, game.guestID);
// 	}
// }

// async function handleEndStream(this: any, game: {hostID : number, guestID : number, watcher : boolean}) {
// 	console.log("/Store/ handleEndStream()");
// 	console.log('%c received("endStream")', 'background: yellow; color: black')

// 	console.log('number of live games')
// 	console.log(this.liveStreams.size)

// 	this.liveStreams.delete(game.hostID);
// }
