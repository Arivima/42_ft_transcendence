/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.gateway.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/18 10:15:07 by mmarinel          #+#    #+#             */
/*   Updated: 2023/11/19 17:24:02 by mmarinel         ###   ########.fr       */
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
		if (debug) console.log(`| GATEWAY GAME | socket: ${client.id}, userID: ${Number(user.sub)}, connected`)
		this.clients.set(Number(user.sub), client);
		
		console.log(`| GATEWAY GAME | socket: ${client.id}, userID: ${Number(user.sub)}, connected`);
		console.log(`| GATEWAY GAME | current queue : ${this.gameService.getQueue().size} `);
	}

	async handleDisconnect(client: any) {
		console.log(`| GATEWAY GAME | ${client.id} disconnected`);
		
		let key: number = -1;
		
		// deleting among the list of clients
		for (let [userID, csock] of this.clients) {
			if (client.id == csock.id) {
				key = userID;
				break ;
			}
		}

		if (-1 != key) {
			this.clients.delete(key);
		}
		
		this.gameService.endGame(client, this.server);
	}

	// joining game through invite
	@SubscribeMessage('sendInvite')
	sendInvite(
		@MessageBody('invite') invite: InviteDto
	)
	{
		let recipientSocket = this.clients.get(invite.guestID);

		if (recipientSocket)
		{
			this.server.to(`${invite.guestID}`).emit("newInvite", invite);
		}
	}
	
	@SubscribeMessage('cancelInvite')
	cancelInvite(@MessageBody('invite') invite: InviteDto )
	{
		let recipientSocket = this.clients.get(invite.guestID);

		if (recipientSocket)
		{
			this.server.to(`${invite.guestID}`).emit("deleteInvite", invite);
		}
	}
	@SubscribeMessage('rejectInvite')
	rejectInvite(@MessageBody('invite') invite: InviteDto )
	{
		let requestorSocket = this.clients.get(invite.guestID);

		if (requestorSocket)
		{
			this.server.to(`${invite.guestID}`).emit("deleteInvite", invite);
		}
	}

	@SubscribeMessage('acceptInvite')
	acceptInvite(@MessageBody() invite: InviteDto) {

		const host_socket = this.clients.get(invite.hostID);
		const guest_socket = this.clients.get(invite.guestID);
		
		// Create game instance
		let roomId = this.gameService.matchPlayers(
			invite.guestID, invite.hostID,
			host_socket, guest_socket
		);
		
		// start game
		this.server.to(roomId).emit("newGame", {
			hostID: invite.hostID,
			guestID: invite.guestID,
			watcher: false
		} as CreateGameDto);
		
	}

	// joining game through matchmaking
	@SubscribeMessage('matchMaking')
	async matchMaking(
		@MessageBody('userID') userID: number,
		@ConnectedSocket() userSocket: Socket
	)
	{
		console.log(`| GATEWAY GAME | 'matchMaking' |`);
		console.log(`| GATEWAY GAME | current queue : ${this.gameService.getQueue().size} `);
		console.log(`| GATEWAY GAME | current live games : ${this.gameService.getGames().size} `);
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
				console.log(`| GATEWAY GAME | 'matchMaking' | emit : 'newGame'`);

				// exit loop
				matched = true;
				break ;
			}
		}

		// add to queue if could not find match
		if (false == matched)
		{
			console.log(`| GATEWAY GAME | 'matchMaking' | not matched `);
			this.gameService.getQueue().set(userID, userSocket);
		}
		console.log(`| GATEWAY GAME | current queue : ${this.gameService.getQueue().size} `);
		console.log(`| GATEWAY GAME | current live games : ${this.gameService.getGames().size / 2} `);
	}

	@SubscribeMessage("cancelMatchMaking")
	cancelMatchMaking(
		@MessageBody('userID') userID: number,
		@ConnectedSocket() socket: Socket
	) {
		if(this.gameService.removeFromQueue(userID))
			this.server.to(socket.id).emit("cancelMatchMaking");
	}

	// customization
	@SubscribeMessage('sendCustomizationOptions')
	sendCustOptions(
		@MessageBody('customization') customization: CustomizationOptions,
		@MessageBody('gameInfo') game_info: CreateGameDto,
		@MessageBody('userID') userID: number
	) {
		const resp = this.gameService.sendCustomizationOptions(
			userID,
			game_info,
			customization
		);

		if (resp)
		{
			this.server.to(resp.roomId).emit('startGame', {
				customization: resp.final_customization
			})
		}
	}

	//joining game for livestream
	@SubscribeMessage('joinGame')
	joinGame(
		@MessageBody('userID') userID: number,
		@MessageBody('playerID') playerID: number,
		@ConnectedSocket() client: Socket
	) {
		const game = this.gameService.joinGame(userID, playerID, client);

		if (game)
		{
			// joining the room
			client.join(game.roomId);

			// emitting start
			this.server.to(`${userID}`).emit('startGame', {
				hostID: game.hostID,
				guestID: game.guestID,
				watcher: true
			} as CreateGameDto);
		}
	}

	@SubscribeMessage('newFrame')
	async getNewFrame(
		@MessageBody() frame: FrameDto,
		@MessageBody('userID') userID: number
	)
	{
		console.log(`| GATEWAY GAME | 'newFrame' | current queue : ${this.gameService.getQueue()} `);
		const	roomId: string = this.gameService.getGames().get(userID).roomId;
		const	currentFrame: FrameDto = this.gameService.getFrames().get(roomId);
		const	hostWin: boolean = (10 == frame.data.host.score);
		const	guestWin: boolean = (10 == frame.data.guest.score);

		if (frame.seq > currentFrame.seq)
		{
			// check end of game
			if (hostWin || guestWin)
			{
				this.server.to(roomId).emit("endGame", {
					hostWin,
					guestWin
				} as endGameDto);

				await this.gameService.setGameasFinished(frame);
			}
			// send next frame
			else
			{
				this.server.to(roomId).emit("newFrame", frame);
			}
			
			this.gameService.getFrames().set(roomId, frame);
		}
	}

	@SubscribeMessage("endGame")
	endGame(
		@MessageBody('userID') userID: number,
		@ConnectedSocket() socket: Socket
	) {
		this.gameService.endGame(socket, this.server);
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