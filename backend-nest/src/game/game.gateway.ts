/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.gateway.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/18 10:15:07 by mmarinel          #+#    #+#             */
/*   Updated: 2023/11/21 20:37:37 by mmarinel         ###   ########.fr       */
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

// TODO
// TODO		1.1 move maps in service
// TODO		1.2 move code in service
// TODO		1.3 make endGame a function
// TODO			and keep disconnection simple
// TODO		1.4 

const debug = true;

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
		private readonly jwtService: JwtService
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
			console.log(`GAME GATEWAY | disconnecting user ${key}`);
			this.clients.delete(key);
		}
		
		this.gameService.leaveGame(client, this.server);
	}

	// joining game through invite
	// from sender to receiver
	@SubscribeMessage('sendInvite')
	sendInvite(
		@MessageBody('invite') invite: InviteDto
	){
		if (debug) console.log(`| GATEWAY GAME | 'sendInvite'`);
		console.log(invite)

		if (!invite?.hostID || !invite?.guestID)
			return

		let recipientSocket = this.clients.get(invite?.guestID);

		console.log(`recipient socket : ${recipientSocket.id}`)

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
		console.log(invite)

		if (!invite?.hostID || !invite?.guestID)
			return

			let recipientSocket = this.clients.get(invite?.guestID);

		console.log(`recipient socket : ${recipientSocket?.id}`)

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
		console.log(invite)

		if (!invite?.hostID || !invite?.guestID)
			return

		let requestorSocket = this.clients.get(invite?.hostID);
		console.log(`recipient requestorSocket : ${requestorSocket.id}`)

		if (requestorSocket)
		{
			this.server.to(`${requestorSocket.id}`).emit("rejectedInvite", invite);
			if (debug) console.log(`| GATEWAY GAME | 'rejectInvite' | emit : 'rejectedInvite'`);
		}
	}
	@SubscribeMessage('acceptInvite')
	acceptInvite(@MessageBody('invite') invite: InviteDto ) {
		if (debug) console.log(`| GATEWAY GAME | 'acceptInvite'`);
		console.log(invite)

		if (!invite?.hostID || !invite?.guestID)
			return

		const host_socket = this.clients.get(invite?.hostID);
		const guest_socket = this.clients.get(invite?.guestID);
		console.log(`host_socket : ${host_socket?.id}`)
		console.log(`guest_socket : ${guest_socket?.id}`)
		
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
		if (debug) console.log(`| GATEWAY GAME | current live games : ${this.gameService.getGames().size} `);
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
		if (debug) console.log(`| GATEWAY GAME | current live games : ${this.gameService.getGames().size / 2} `);
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
			this.server.to(resp.roomId).emit('startGame',
				resp.final_customization
			)
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
		@MessageBody() frame: FrameDto,
		@MessageBody('userID') userID: number
	)
	{
		if (!userID || !frame)
			return
		if (debug) console.log(`| GATEWAY GAME | 'newFrame' | current queue : ${this.gameService.getQueue()} `);
		
		const	roomId: string = this.gameService.getGames().get(userID).roomId;
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
				this.server.to(roomId).emit("endGame", {
					hostWin,
					guestWin,
					hostScore,
					guestScore
				} as endGameDto);
				if (debug) console.log(`| GATEWAY GAME | 'getNewFrame' | emit : 'endGame'`);

				await this.gameService.setGameasFinished(frame);
			}
			// send next frame
			else
			{
				this.server.to(roomId).emit("newFrame", frame);
				if (debug) console.log(`| GATEWAY GAME | 'getNewFrame' | emit : 'newFrame'`);
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
		this.gameService.leaveGame(socket, this.server);
		for (let [userID, uSock] of this.clients) {
			console.log(`found client`);
			console.log(`userID: ${userID}; socket.id: ${uSock.id}`);
		}
	}

}

// @SubscribeMessage('newFrame')
// async getNewFrame(
// 	@MessageBody() frame: FrameDto,
// 	@MessageBody('userID') userID: number
// )
// {
// 	console.log(`| GATEWAY GAME | 'newFrame' | current queue : ${this.gameService.getQueue()} `);
// 	const	roomId: string = this.gameService.getGames().get(userID).roomId;
// 	const	currentFrame: FrameDto = this.gameService.getFrames().get(roomId);

// 	if (frame.seq > currentFrame.seq)
// 	{
// 		// update score
// 		if ((frame.data.ball.x + frame.data.ball.sx + frame.data.ball.radius) >=
// 			frame.data.canvas.w)
// 		{
// 			frame.data.host.score += 1;

// 			// check end of game
// 			if (10 == frame.data.host.score) {
// 				this.server.to(roomId).emit("endGame", {
// 					hostWin: true,
// 					guestWin: false
// 				} as endGameDto);

// 				// update db
// 				await this.gameService.setGameasFinished(frame);
// 			}
// 		}
// 		else
// 		if ((frame.data.ball.x + frame.data.ball.sx - frame.data.ball.radius) <= 0)
// 		{
// 			frame.data.guest.score += 1;
			
// 			// check end of game
// 			if (10 == frame.data.guest.score) {
// 				this.server.to(roomId).emit("endGame", {
// 					hostWin: false,
// 					guestWin: true
// 				} as endGameDto);

// 				// update db
// 				await this.gameService.setGameasFinished(frame);
// 			}
// 		}
// 		// send next frame
// 		else
// 		{

// 			// check guest collisions
// 			if (
// 				(
// 					(
// 						frame.data.ball.y + frame.data.ball.sy + frame.data.ball.radius >=
// 						frame.data.guest.paddle.y + frame.data.guest.paddle.sy &&
// 						frame.data.ball.y + frame.data.ball.sy - frame.data.ball.radius <=
// 						frame.data.guest.paddle.y + frame.data.guest.paddle.sy + frame.data.guest.paddle.h
// 					) &&
// 					(
// 						frame.data.ball.x + frame.data.ball.sx + frame.data.ball.radius >=
// 						frame.data.canvas.w - frame.data.guest.paddle.w
// 					)
// 				)
// 			) {
// 				frame.data.ball.dx
// 			}

// 			this.gameService.getFrames().set(roomId, frame);
// 			this.server.to(roomId).emit("newFrame", frame);
// 		}

// 	}
// }

// }

// STANDARD CRUD ENDPOINTS

// @SubscribeMessage('createGame')
// create(@MessageBody() createGameDto: CreateGameDto) {
// 	console.log(`| GATEWAY GAME | createGame |`);
// 	return this.gameService.create(createGameDto);
// }

// @SubscribeMessage('findAllGame')
// findAll() {
// console.log(`| GATEWAY GAME | findAllGame |`);
// 	return this.gameService.findAll();
// }

// @SubscribeMessage('findOneGame')
// findOne(@MessageBody() id: number) {
// 	console.log(`| GATEWAY GAME | findOneGame |`);
// 	return this.gameService.findOne(id);
// }

// @SubscribeMessage('updateGame')
// update(@MessageBody() updateGameDto: UpdateGameDto) {
// 	console.log(`| GATEWAY GAME | updateGame |`);
// 	return this.gameService.update(updateGameDto.id, updateGameDto);
// }

// @SubscribeMessage('removeGame')
// remove(@MessageBody() id: number) {
// 	console.log(`| GATEWAY GAME | removeGame |`);
// 	return this.gameService.remove(id);
// }