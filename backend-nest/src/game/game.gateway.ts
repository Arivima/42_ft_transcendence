/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.gateway.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/18 10:15:07 by mmarinel          #+#    #+#             */
/*   Updated: 2023/11/19 14:32:40 by mmarinel         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PlayerDto } from './dto/player.dto';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { FrameDto } from './dto/frame.dto';
import { CustomizationOptions } from './dto/customization.dto';
import { endGameDto } from './dto/endGame.dto';
import { InviteDto } from './dto/invite.dto';

export class GameSocket {
	user_socket: Socket
	roomId: string

	customization: CustomizationOptions
	hostID: number
	guestID: number
};

// TODO
// TODO		1.1 move maps in service
// TODO		1.2 move code in service
// TODO		1.3 make endGame a function
// TODO			and keep disconnection simple
// TODO		1.4 



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

	/**
	 * key: userID
	 * value: user socket
	 */
	private queue: Map<number, Socket>;
	/**
	 * key: userID
	 * value: sockets + game info
	 */
	private games: Map<number, GameSocket>;
	/**
	 * key: roomID
	 * value: next frame data
	 */
	private frames: Map<string, FrameDto>;

	constructor(
		private readonly gameService: GameService,
		private readonly jwtService: JwtService
		)
	{
		this.clients = new Map<number, Socket>();

		this.queue = new Map<number, Socket>();
		this.games = new Map<number, GameSocket>();
		this.frames = new Map<string, FrameDto>();
	}

	async handleConnection(client: Socket, ...args: any[]) {
		const user = await this.jwtService.verifyAsync(client.handshake.auth.token, {
			secret: process.env.JWT_SECRET
		});

		this.clients.set(Number(user.sub), client);
		
		console.log(`| GATEWAY GAME | socket: ${client.id}, userID: ${Number(user.sub)}, connected`);
		// this.queue.set(Number(user.sub), client);
		console.log(`| GATEWAY GAME | current queue : ${this.queue.size} `);
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
		key = -1;
		
		// make endGame a function
		// make endGame a function
		// make endGame a function
		// make endGame a function
		for (let [userID, csock] of this.queue) {
			if (client.id == csock.id) {
				key = userID;
				break ;
			}
		}

		if (-1 != key) {
			console.log(`| GATEWAY GAME | ser ${key} socket removed`);
			this.queue.delete(key);
			return ;
		}

		for (let [userID, {user_socket: csock, ...rest}] of this.games) {
			if (client.id == csock.id) {
				key = userID;
				break ;
			}
		}

		if (-1 != key) {
			console.log(`| GATEWAY GAME | ser ${key} socket removed`);
			
			let game = this.games.get(key);
			const roomId = game.roomId;
		
			// leave the room
			game.user_socket.leave(roomId);

			// signaling end of game to whole room
			this.server.to(roomId).emit("endGame", {
				hostWin: false,
				guestWin: false,
			} as endGameDto)

			// deleting user game
			this.games.delete(key);

			// deleting room if all players left
			for (let [userID, game] of this.games) {
				if (roomId === game.roomId)
					return ;
			}
			this.frames.delete(roomId);
		}

		console.log(`| GATEWAY GAME | current queue : ${this.queue.size} `);
	}

	@SubscribeMessage('createGame')
	create(@MessageBody() createGameDto: CreateGameDto) {
		console.log(`| GATEWAY GAME | createGame |`);
		return this.gameService.create(createGameDto);
	}

	@SubscribeMessage('findAllGame')
	findAll() {
	console.log(`| GATEWAY GAME | findAllGame |`);
		return this.gameService.findAll();
	}

	@SubscribeMessage('findOneGame')
	findOne(@MessageBody() id: number) {
		console.log(`| GATEWAY GAME | findOneGame |`);
		return this.gameService.findOne(id);
	}

	@SubscribeMessage('updateGame')
	update(@MessageBody() updateGameDto: UpdateGameDto) {
		console.log(`| GATEWAY GAME | updateGame |`);
		return this.gameService.update(updateGameDto.id, updateGameDto);
	}

	@SubscribeMessage('removeGame')
	remove(@MessageBody() id: number) {
		console.log(`| GATEWAY GAME | removeGame |`);
		return this.gameService.remove(id);
	}

	//TODO was doing this
	// joining game through invite
	// @SubscribeMessage('sendInvite')
	// sendInvite(
	// 	@MessageBody('invite') invite: InviteDto
	// )
	// {
	// 	this.server.
	// }




	

	
	// @SubscribeMessage('cancelInvite')
	// cancelInvite(@MessageBody() playerDto: PlayerDto) {
	// 	return this.gameService.cancelInvite(playerDto);
	// }

	// @SubscribeMessage('rejectInvite')
	// rejectInvite(@MessageBody() playerDto: PlayerDto) {
	// 	return this.gameService.rejectInvite(playerDto);
	// }

	// @SubscribeMessage('acceptInvite')
	// acceptInvite(@MessageBody() playerDto: PlayerDto) {
	// 	return this.gameService.acceptInvite(playerDto);
	// }

	// joining game through matchmaking
	@SubscribeMessage('matchMaking')
	async matchMaking(
		@MessageBody('userID') userID: number,
		@ConnectedSocket() playerSocket: Socket
	)
	{
		console.log(`| GATEWAY GAME | 'matchMaking' |`);
		console.log(`| GATEWAY GAME | current queue : ${this.queue.size} `);
		console.log(`| GATEWAY GAME | current live games : ${this.games.size} `);
		let matched: boolean = false;
		
		for (let [hostID, hostSocket] of this.queue) {
			if (await this.gameService.playerMatch(hostID, userID))
			{
				// create the room
				let roomId = `${userID}:${hostID}`;
				hostSocket.join(roomId);
				playerSocket.join(roomId);
				console.log(`| GATEWAY GAME | 'matchMaking' | ${hostSocket} & ${playerSocket} joined ${roomId} `);

				// update data structures
				let hostGameSocket: GameSocket = {
					user_socket: hostSocket,
					roomId,
					customization: {} as CustomizationOptions,
					hostID,
					guestID: userID
				};
				let guestGameSocket: GameSocket = {
					user_socket: playerSocket,
					roomId,
					customization: {} as CustomizationOptions,
					hostID,
					guestID: userID
				};
				this.queue.delete(hostID);
				this.games.set(hostID, hostGameSocket);
				this.games.set(userID, guestGameSocket);

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
			this.queue.set(userID, playerSocket);
		}
		console.log(`| GATEWAY GAME | current queue : ${this.queue.size} `);
		console.log(`| GATEWAY GAME | current live games : ${this.games.size / 2} `);
	}

	// customization
	@SubscribeMessage('sendCustomizationOptions')
	sendCustOptions(
		@MessageBody('customization') customization: CustomizationOptions,
		@MessageBody('gameInfo') game_info: CreateGameDto,
		@MessageBody('userID') userID: number
	) {
		const other_customizations = this.games.get(
			userID == game_info.hostID ?
			game_info.guestID :
			game_info.hostID
		).customization;
		
		if (JSON.stringify({}) != JSON.stringify(other_customizations))
		{
			const roomId = this.games.get(userID).roomId;
			const final_customization = {
				pitch_color: Math.random() * 1024 % 2 == 0 ?
					other_customizations.pitch_color :
					customization.pitch_color,
				paddle_color: Math.random() * 1024 % 2 == 0 ?
					other_customizations.paddle_color :
					customization.paddle_color,
				ball_color:  Math.random() * 1024 % 2 == 0 ?
					other_customizations.ball_color :
					customization.ball_color,
			} as CustomizationOptions;

			this.server.to(roomId).emit('startGame', {
				customization: final_customization
			})
		}
		Object.assign(this.games.get(userID).customization, customization);
	}

	//joining game for livestream
	@SubscribeMessage('joinGame')
	joinGame(
		@MessageBody('userID') userID: number,
		@MessageBody('playerID') playerID: number,
		@ConnectedSocket() client: Socket
	) {
		const game = this.games.get(playerID);

		if (game)
		{
			const roomId = game.roomId;
			let my_gameSocket: GameSocket = {} as GameSocket;

			// updating structures
			Object.assign(my_gameSocket, game);
			my_gameSocket.user_socket = client;
			this.games.set(userID, my_gameSocket);

			// joining the room
			client.join(roomId);

			// emitting start
			this.server.to(`${userID}`).emit('newGame', {
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
		console.log(`| GATEWAY GAME | 'newFrame' | current queue : ${this.queue} `);
		const	roomId: string = this.games.get(userID).roomId;
		const	currentFrame: FrameDto = this.frames.get(roomId);
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
			
			this.frames.set(roomId, frame);
		}
	}

}

// @SubscribeMessage('newFrame')
// async getNewFrame(
// 	@MessageBody() frame: FrameDto,
// 	@MessageBody('userID') userID: number
// )
// {
// 	console.log(`| GATEWAY GAME | 'newFrame' | current queue : ${this.queue} `);
// 	const	roomId: string = this.games.get(userID).roomId;
// 	const	currentFrame: FrameDto = this.frames.get(roomId);

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

// 			this.frames.set(roomId, frame);
// 			this.server.to(roomId).emit("newFrame", frame);
// 		}

// 	}
// }

// }
