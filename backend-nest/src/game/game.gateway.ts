/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.gateway.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/18 10:15:07 by mmarinel          #+#    #+#             */
/*   Updated: 2023/11/18 21:18:29 by mmarinel         ###   ########.fr       */
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

export class GameSocket {
	user_socket: Socket
	roomId: string
	customization: CustomizationOptions
};

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_URL
	},
	namespace: "game"
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	private server: Server;
	private queue: Map<number, Socket>;
	private games: Map<number, GameSocket>;
	private frames: Map<string, FrameDto>;

	constructor(
		private readonly gameService: GameService,
		private readonly jwtService: JwtService
		)
	{
		this.queue = new Map<number, Socket>();
		this.games = new Map<number, GameSocket>();
		/**
		 * key: roomID
		 * value: next frame data
		 */
		this.frames = new Map<string, FrameDto>();
	}

	async handleConnection(client: Socket, ...args: any[]) {
		const user = await this.jwtService.verifyAsync(client.handshake.auth.token, {
			secret: process.env.JWT_SECRET
		});

		console.log(`| GATEWAY GAME | socket: ${client.id}, userID: ${Number(user.sub)}, connected`);
		// this.queue.set(Number(user.sub), client);
		console.log(`| GATEWAY GAME | current queue : ${this.queue.size} `);
	}

	async handleDisconnect(client: any) {
		console.log(`| GATEWAY GAME | ${client.id} disconnected`);
		
		let key: number = -1;
		
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
			this.games.delete(key);
			return ;
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

	/*
	// joining game through invite
	@SubscribeMessage('sendInvite')
	sendInvite(@MessageBody() playerDto: PlayerDto) {
		return this.gameService.sendInvite(playerDto);
	}

	@SubscribeMessage('cancelInvite')
	cancelInvite(@MessageBody() playerDto: PlayerDto) {
		return this.gameService.cancelInvite(playerDto);
	}

	@SubscribeMessage('rejectInvite')
	rejectInvite(@MessageBody() playerDto: PlayerDto) {
		return this.gameService.rejectInvite(playerDto);
	}

	@SubscribeMessage('acceptInvite')
	acceptInvite(@MessageBody() playerDto: PlayerDto) {
		return this.gameService.acceptInvite(playerDto);
	}*/
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
					customization: {} as CustomizationOptions
				};
				let guestGameSocket: GameSocket = {
					user_socket: playerSocket,
					roomId,
					customization: {} as CustomizationOptions
				};
				this.queue.delete(hostID);
				this.games.set(hostID, hostGameSocket);
				this.games.set(userID, guestGameSocket);

				// emit event in the room
				this.server.to(roomId).emit('newGame', {
					hostID,
					guestID: userID
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

	// joining game for livestream
	// @SubscribeMessage('joinGame')
	// joinGame(@MessageBody() playerDto: PlayerDto) {
	// 	return this.gameService.joinGame(playerDto);
	// }

	@SubscribeMessage('newFrame')
	getNewFrame(
		@MessageBody() frame: FrameDto
	)
	{
		console.log(`| GATEWAY GAME | 'newFrame' | current queue : ${this.queue} `);
		const	userID: number = frame.hostId || frame.guestID;
		const	roomId: string = this.games.get(userID).roomId;
		const	currentFrame: FrameDto = this.frames.get(roomId);
		let		nextFrame: FrameDto = {} as FrameDto;

		if (frame.seq > currentFrame.seq)
		{
			// update seq number
			Object.assign(nextFrame, currentFrame);
			nextFrame.seq += 1
			this.frames.set(roomId, nextFrame);

			this.server.to(roomId).emit("newFrame", nextFrame);
		}
	}

}