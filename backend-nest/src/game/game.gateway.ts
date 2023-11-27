/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.gateway.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/18 10:15:07 by mmarinel          #+#    #+#             */
/*   Updated: 2023/11/26 16:49:58 by mmarinel         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { GameService, GameSocket } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PlayerDto } from './dto/player.dto';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { FrameDto } from './dto/frame.dto';
import { CustomizationOptions } from './dto/customization.dto';
import { endGameDto } from './dto/endGame.dto';
import { InviteDto } from './dto/invite.dto';
import { PlayersService } from 'src/players/players.service';

// TODO
// TODO		1.1 move maps in service
// TODO		1.2 move code in service
// TODO		1.3 make endGame a function
// TODO			and keep disconnection simple
// TODO		1.4 

const debug = false;

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_URL
	},
	namespace: "game"
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	private server: Server;
	private clients: Map<number, Socket>;

	constructor(
		private readonly gameService: GameService,
		private readonly jwtService: JwtService,
		private readonly pservice: PlayersService
		)
	{
		this.clients = new Map<number, Socket>();
	}

	async handleConnection(client: Socket, ...args: any[]) {
		// validating user
		const user = await this.jwtService.verifyAsync(client.handshake.auth.token, {
			secret: process.env.JWT_SECRET
		});

		// setting user socket
		this.clients.set(Number(user.sub), client);
		
		if (debug) console.log(`| GATEWAY GAME | socket: ${client.id}, userID: ${Number(user.sub)}, connected`);
		if (debug) console.log(`| GATEWAY GAME | current queue : ${this.gameService.getQueue().size} `);
	}

	async handleDisconnect(client: any) {
		if (debug) console.log(`| GATEWAY GAME | ${client.id} disconnected`);
		
		let key: number = -1;
		
		// deleting among the list of clients
		for (let [userID, csock] of this.clients) {
			if (client.id == csock.id) {
				key = userID;
				break ;
			}
		}
		
		if (-1 != key) {
			if (debug) console.log(`GAME GATEWAY | disconnecting user ${key}`);
			this.clients.delete(key);
		}
		
		this.gameService.leaveGame(client, this.server);
	}

	@SubscribeMessage('getActiveGames')
	getActiveGames(
		@ConnectedSocket() client: Socket
	) {
		if (debug) console.log(`GAME | getActiveGames`);

		const activeGames = this.gameService.getActiveGames();

		this.server.to(client.id).emit('getActiveGames',activeGames);
	}

	// joining game through invite
	// from sender to receiver
	@SubscribeMessage('sendInvite')
	sendInvite(
		@MessageBody('invite') invite: InviteDto
	){
		if (debug) console.log(`| GATEWAY GAME | 'sendInvite'`);
		if (debug) console.log(invite)

		if (!invite?.hostID || !invite?.guestID)
			return

		let recipientSocket = this.clients.get(invite?.guestID);

		if (debug) console.log(`recipient socket : ${recipientSocket.id}`)

		if (recipientSocket)
		{
			this.server.to(`${recipientSocket.id}`).emit("newInvite", invite);
			if (debug) console.log(`| GATEWAY GAME | 'sendInvite' | emit : 'newInvite'`);
			// here handle if emit failed
		}
	}
	@SubscribeMessage('cancelInvite')
	cancelInvite(@MessageBody('invite') invite: InviteDto )
	{
		if (debug) console.log(`| GATEWAY GAME | 'cancelInvite'`);
		if (debug) console.log(invite)

		if (!invite?.hostID || !invite?.guestID)
			return

			let recipientSocket = this.clients.get(invite?.guestID);

			if (debug) console.log(`recipient socket : ${recipientSocket?.id}`)

		if (recipientSocket)
		{
			this.server.to(`${recipientSocket.id}`).emit("deleteInvite", invite);
			if (debug) console.log(`| GATEWAY GAME | 'cancelInvite' | emit : 'deleteInvite'`);
		}
	}
	// from receiver to sender
	@SubscribeMessage('rejectInvite')
	rejectInvite(@MessageBody('invite') invite: InviteDto )
	{
		if (debug) console.log(`| GATEWAY GAME | 'rejectInvite'`);
		if (debug) console.log(invite)

		if (!invite?.hostID || !invite?.guestID)
			return

		let requestorSocket = this.clients.get(invite?.hostID);
		if (debug) console.log(`recipient requestorSocket : ${requestorSocket.id}`)

		if (requestorSocket)
		{
			this.server.to(`${requestorSocket.id}`).emit("rejectedInvite", invite);
			if (debug) console.log(`| GATEWAY GAME | 'rejectInvite' | emit : 'rejectedInvite'`);
		}
	}
	@SubscribeMessage('acceptInvite')
	acceptInvite(@MessageBody('invite') invite: InviteDto ) {
		if (debug) console.log(`| GATEWAY GAME | 'acceptInvite'`);
		if (debug) console.log(invite)

		if (!invite?.hostID || !invite?.guestID)
			return

		const host_socket = this.clients.get(invite?.hostID);
		const guest_socket = this.clients.get(invite?.guestID);
		if (debug) console.log(`host_socket : ${host_socket?.id}`)
		if (debug) console.log(`guest_socket : ${guest_socket?.id}`)
		
		// Create game instance
		let roomId = this.gameService.matchPlayers(
			invite?.guestID, invite?.hostID,
			host_socket, guest_socket
		);
		
		// start game
		this.server.to(roomId).emit("newGame", {
			hostID: invite?.hostID,
			guestID: invite?.guestID,
			watcher: false
		} as CreateGameDto);
		if (debug) console.log(`| GATEWAY GAME | 'acceptInvite' | emit : 'newGame'`);

		// add to streaming list
		this.server.emit("newStream", {
			hostID: invite?.hostID,
			guestID: invite?.guestID,
			watcher: false
		} as CreateGameDto);
		if (debug) console.log(`| GATEWAY GAME | 'joinGame' | emit : 'newStream'`);
	}

	// joining game through matchmaking
	@SubscribeMessage('matchMaking')
	async matchMaking(
		@MessageBody('userID') userID: number,
		@ConnectedSocket() userSocket: Socket
	)
	{
		if (debug) console.log(`| GATEWAY GAME | 'matchMaking' |`);
		if (!userID || !userSocket)
			return

		if (debug) console.log(`| GATEWAY GAME | 'matchMaking' |`);
		if (debug) console.log(`| GATEWAY GAME | current queue : ${this.gameService.getQueue().size} `);
		if (debug) console.log(`| GATEWAY GAME | current live games : ${this.gameService.getGameInstances().size} `);
		let matched: boolean = false;
		let roomId: string;
		
		for (let [hostID, hostSocket] of this.gameService.getQueue()) {
			if (await this.gameService.playerMatch(hostID, userID))
			{
				// create match
				roomId = this.gameService.matchPlayers(userID, hostID, hostSocket, userSocket);

				// emit event in the room
				this.server.to(roomId).emit('newGame', {
					hostID,
					guestID: userID,
					watcher: false
				} as CreateGameDto);
				if (debug) console.log(`| GATEWAY GAME | 'matchMaking' | emit : 'newGame'`);

				// add to streaming list
				this.server.emit("newStream", {
					hostID,
					guestID: userID,
					watcher: false
				} as CreateGameDto);
				if (debug) console.log(`| GATEWAY GAME | 'matchMaking' | emit : 'newStream'`);


				// exit loop
				matched = true;
				break ;
			}
		}

		// add to queue if could not find match
		if (false == matched)
		{
			if (debug) console.log(`| GATEWAY GAME | 'matchMaking' | not matched `);
			this.gameService.getQueue().set(userID, userSocket);
		}
		if (debug) console.log(`| GATEWAY GAME | current queue : ${this.gameService.getQueue().size} `);
		if (debug) console.log(`| GATEWAY GAME | current live games : ${this.gameService.getGameInstances().size / 2} `);
	}

	@SubscribeMessage("cancelMatchMaking")
	cancelMatchMaking(
		@MessageBody('userID') userID: number,
		@ConnectedSocket() socket: Socket
	) {
		if (!userID)
			return 
		if (debug) console.log(`| GATEWAY GAME | 'cancelMatchMaking'`);

		// if(this.gameService.removeFromQueue(userID))
		// 	this.server.to(socket.id).emit("cancelMatchMaking");

		this.gameService.removeFromQueue(userID);
	}

	// customization
	@SubscribeMessage('sendCustomizationOptions')
	sendCustOptions(
		@MessageBody('customization') customization: CustomizationOptions,
		@MessageBody('gameInfo') gameInfo: CreateGameDto,
		@MessageBody('userID') userID: number
	) {
		if (!userID || !gameInfo || !customization)
			return
		if (debug) console.log(`| GATEWAY GAME | 'sendCustomizationOptions'`);
		if (debug) console.log(`${customization.ball_color}`);
		if (debug) console.log(`${customization.paddle_color}`);
		if (debug) console.log(`${customization.pitch_color}`);

		const resp = this.gameService.sendCustomizationOptions(
			userID,
			gameInfo,
			customization
		);

		if (resp)
		{
			// sending start game to participants
			this.server.to(resp.roomId).emit('startGame',
				resp.final_customization
			);
			
			// Sending updated list of active games to all
			this.gameService.calculateActiveGames();
			this.server.emit('getActiveGames', this.gameService.getActiveGames());
			
			// changin status of host and guest to 'Playing'
			this.pservice.changeConnection(gameInfo.hostID, {
				playing: true
			});
			this.pservice.changeConnection(gameInfo.guestID, {
				playing: true
			});
			
			if (debug) console.log(`| GATEWAY GAME | 'sendCustOptions' | emit : 'startGame'`);
		}
	}

	//joining game for livestream
	// SISTEMARE LE CHIAMATE CON UNA SOLA NUOVA PER IL STREAMING
	@SubscribeMessage('joinGame')
	joinGame(
		@MessageBody('userID') userID: number,
		@MessageBody('playerID') playerID: number,
		@ConnectedSocket() client: Socket
	) {
		if (!userID || !playerID || !client)
			return
		if (debug) console.log(`| GATEWAY GAME | 'joinGame'`);

		// fetching the room where playerID is playing
		const game = this.gameService.joinGame(userID, playerID, client);

		if (game)
		{
			// joining the room
			client.join(game.roomId);

			// setting up game
			this.server.to(`${client.id}`).emit("newGame", {
				hostID: game.hostID,
				guestID: game.guestID,
				watcher: true
			} as CreateGameDto);
			if (debug) console.log(`| GATEWAY GAME | 'joinGame' | emit : 'newGame'`);

			// share customization
			this.server.to(`${client.id}`).emit('startGame', {
				customization: game.customization
			})
			if (debug) console.log(`| GATEWAY GAME | 'joinGame' | emit : 'startGame'`);
		}
	}

	@SubscribeMessage('newFrame')
	async getNewFrame(
		@MessageBody('frame') frame: FrameDto,
		@MessageBody('userID') userID: number
	)
	{
		if (!userID || !frame)
			return
		// if (debug) console.log(`| GATEWAY GAME | 'newFrame'`);
		
		const	finished = (
			this.gameService.getGameInstances().get(frame.hostID).finished ||
			this.gameService.getGameInstances().get(frame.guestID).finished
		);
		const	roomId: string = this.gameService.getGameInstances().get(userID).roomId;
		const	currentFrame: FrameDto = this.gameService.getFrames().get(roomId);
		const	hostWin: boolean = (10 == frame?.data?.host?.score);
		const	guestWin: boolean = (10 == frame?.data?.guest?.score);
		const	hostScore: number = (frame?.data?.host?.score);
		const	guestScore: number = (frame?.data?.guest?.score);

		if (frame.seq > currentFrame.seq)
		{
			// check end of game
			if (hostWin || guestWin)
			{
				// emit last frame
				this.server.to(roomId).emit("newFrame", frame);
				if (debug) console.log(`| GATEWAY GAME | 'getNewFrame' | emit : 'newFrame' | last frame`);

				this.server.to(roomId).emit("endGame", {
					hostWin,
					guestWin,
					hostScore,
					guestScore
				} as endGameDto);
				if (debug) console.log(`| GATEWAY GAME | 'getNewFrame' | emit : 'endGame'`);

				if (false === finished) {
					this.gameService.getGameInstances().get(frame.guestID).finished = true;
					this.gameService.getGameInstances().get(frame.hostID).finished = true;
					await this.gameService.setGameasFinished(frame);
				}
				// await this.gameService.updateAchievements(frame, userID);

				// remove from streaming list
				this.server.emit("endStream", {
					hostID: currentFrame.hostID,
					guestID: currentFrame.guestID,
					watcher : false,
				} as CreateGameDto);
			}
			if (debug) console.log(`| GATEWAY GAME | 'getNewFrame' | emit : 'endStream'`);

			// send next frame
			else
			{
				this.server.to(roomId).emit("newFrame", frame);
				// if (debug) console.log(`| GATEWAY GAME | 'getNewFrame' | emit : 'newFrame'`);
			}
			
			this.gameService.getFrames().set(roomId, frame);
		}
	}

	@SubscribeMessage("leaveGame")
	leaveGame(
		@MessageBody('userID') userID: number,
		@ConnectedSocket() socket: Socket
	) {
		if (!userID || !socket)
			return

			if (debug) console.log(`| GATEWAY GAME | 'leaveGame' | ${userID} `);
		
		const game = this.gameService.getGameInstances().get(userID);
		// leaveGame gets called two times with current flow
		const shutdownRoom = game && (game.hostID == userID || game.guestID == userID);

		// deleting game instance of player
		this.gameService.leaveGame(socket, this.server);

		//TODO maybe add the active games as a data of class so that a game is valid
		//TODO only if it is there
		//! IMPORTANT use this check in 'joinGame' event as a user cannot join
		//! a game that has ended just right now
		//! (meaning, the opponent left, but not the user whose profile you are viewing)
		// send new active game list if one of host and guest left game
		if (shutdownRoom) {
			this.gameService.calculateActiveGames();
			this.server.emit('getActiveGames', this.gameService.getActiveGames());
		}

		for (let [userID, uSock] of this.clients) {
			if (debug) console.log(`found client`);
			if (debug) console.log(`userID: ${userID}; socket.id: ${uSock.id}`);
		}
	}

}
