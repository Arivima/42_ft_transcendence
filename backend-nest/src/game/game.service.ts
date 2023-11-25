/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.service.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/19 15:32:39 by mmarinel          #+#    #+#             */
/*   Updated: 2023/11/25 18:12:24 by mmarinel         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { FrameDto } from './dto/frame.dto';
import { PlayerDto } from './dto/player.dto';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { CustomizationOptions } from './dto/customization.dto';
import { endGameDto } from './dto/endGame.dto';
import { InviteDto } from './dto/invite.dto';
import { FrameData } from './dto/frame.dto';
import { PlayersService } from 'src/players/players.service';

export class GameSocket {
	user_socket: Socket
	roomId: string

	customization: CustomizationOptions
	hostID: number
	guestID: number
};

@Injectable()
export class GameService {

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
		private readonly prisma: PrismaService,
		private readonly pservice: PlayersService
	) {
		this.queue = new Map<number, Socket>();
		this.games = new Map<number, GameSocket>();
		this.frames = new Map<string, FrameDto>();
	}

	/**
	 * 
	 * @returns map - key: userID, val: client socket
	 */
	getQueue(): Map<number, Socket> {
		return this.queue;
	}

	/**
	 * 
	 * @returns map - key: userID, val: game room info
	 */
	getGames(): Map<number, GameSocket> {
		return this.games;
	}

	/**
	 * 
	 * @returns map - key: roomId, val: frame data
	 */
	getFrames(): Map<string, FrameDto> {
		return this.frames;
	}

	leaveGame(client: Socket, server: Server) {
		
		let key: number = -1;
		
		// check in queue
		for (let [userID, csock] of this.queue) {
			if (client.id == csock.id) {
				key = userID;
				break ;
			}
		}

		if (-1 != key) {
			console.log(`| GATEWAY GAME | user ${key} socket removed from Queue`);
			this.queue.delete(key);
			console.log(`| GATEWAY GAME | current queue : ${this.queue.size} `);
			return ;
		}

		// check in active games
		for (let [userID, {user_socket: csock, ...rest}] of this.games) {
			if (client?.id == csock?.id) {
				key = userID;
				break ;
			}
		}

		if (-1 != key) {
			
			let game = this.games.get(key);
			const roomId = game.roomId;
			
			this.pservice.changeConnection(key, {
				playing: false
			});
			// leave the room
			game.user_socket.leave(roomId);
			console.log(`| GATEWAY GAME | user ${key} socket left ${roomId} `);

			if (key == game.hostID || key == game.guestID)
			{
				// signaling end of game to whole room
				server.to(roomId).emit("endGame", {
					hostWin: false,
					guestWin: false,
					hostScore: -1,
					guestScore: -1,
				} as endGameDto)
				console.log(`| GATEWAY GAME | leaveGame | emit : endGame`);
			}
			
			// deleting user game
			this.games.delete(key);
			console.log(`| GATEWAY GAME | user ${key} socket removed from games`);
			
			// deleting room if all players left
			for (let [userID, game] of this.games) {
				if (roomId === game.roomId)
					return ;
			}
			this.frames.delete(roomId);
			console.log(`| GATEWAY GAME | room ${roomId} removed from frames`);

			console.log(`currently ${this.queue.size} users in queue`);
			console.log(`currently ${this.games.size / 2} active games`);
			for (let [userID, gameSock] of this.games) {
				console.log(`Found Active Game`);
				console.log(`userID: ${userID}; roomId: ${roomId}`);
			}
		}
	}

	matchPlayers(
		userID: number,
		hostID: number,
		hostSocket: Socket,
		userSocket: Socket,
	): string {
		// create the room
		const roomId: string = `${userID}:${hostID}`;
		hostSocket?.join(roomId);
		userSocket?.join(roomId);
		console.log(`| GATEWAY GAME | 'matchMaking' | ${hostSocket?.id} & ${userSocket?.id} joined ${roomId} `);

		// update data structures
		let hostGameSocket: GameSocket = {
			user_socket: hostSocket,
			roomId,
			customization: {} as CustomizationOptions,
			hostID,
			guestID: userID
		};
		let guestGameSocket: GameSocket = {
			user_socket: userSocket,
			roomId,
			customization: {} as CustomizationOptions,
			hostID,
			guestID: userID
		};
		this.queue.delete(hostID);
		this.games.set(hostID, hostGameSocket);
		this.games.set(userID, guestGameSocket);

		return roomId;
	}

	removeFromQueue(userID: number): boolean
	{
		return this.queue.delete(userID);
	}
	
	async playerMatch(hostID: number, guestID: number): Promise<boolean>
	{
		console.log(`playerMatch: hostID: ${hostID} ${typeof hostID}, guestID: ${guestID} ${typeof guestID}`);

		let friendship = await this.prisma.beFriends.findUnique({
			where: {
				requestorID_recipientID: {
					requestorID: hostID,
					recipientID: guestID,
				}
			},
			select: {
				requestor_blacklisted: true,
				recipient_blacklisted: true
			}
		});

		if (null === friendship) {
			console.log(`frienship take 2`);
			friendship = await this.prisma.beFriends.findUnique({
					where: {
						requestorID_recipientID: {
							requestorID: guestID,
							recipientID: hostID,
						}
					},
					select: {
						requestor_blacklisted: true,
						recipient_blacklisted: true
					}
				});
		}

		if (null === friendship)
			return true;
		if (friendship.recipient_blacklisted || friendship.requestor_blacklisted)
		{
			console.log(`user blacklisted`)
			return false;
		}

		return true;
	}

	sendCustomizationOptions(
		userID: number,
		gameInfo: CreateGameDto,
		customization: CustomizationOptions
	): {roomId: string, final_customization: CustomizationOptions} | undefined
	{

		const other_customizations = this.games.get(
			userID == gameInfo.hostID ?
			gameInfo.guestID :
			gameInfo.hostID
		)?.customization || {} as CustomizationOptions;

		console.log(`User ${userID} customization`)
		console.log(customization)
		console.log(`Opponent ${userID == gameInfo.hostID ? gameInfo.guestID : gameInfo.hostID} customization`)
		console.log(other_customizations)
		
		if (JSON.stringify({}) != JSON.stringify(other_customizations))
		{
			const roomId = this.games.get(userID).roomId;
			const randN = Math.random() * 1024;
			const final_customization = {
				pitch_color: randN % 2 == 0 ?
					other_customizations.pitch_color :
					customization.pitch_color,
				paddle_color: randN % 2 == 0 ?
					other_customizations.paddle_color :
					customization.paddle_color,
				ball_color:  randN % 2 == 0 ?
					other_customizations.ball_color :
					customization.ball_color,
			} as CustomizationOptions;

			console.log(`Final customization`)
			console.log(final_customization)

			this.frames.set(roomId, {
				hostID: gameInfo.hostID,
				guestID: gameInfo.guestID,
				seq: -1,
				data: {} as FrameData
			} as FrameDto);
			Object.assign(this.games.get(userID).customization, customization);
			return {
				roomId,
				final_customization
			};
		}
		Object.assign(this.games.get(userID).customization, customization);
		return undefined;
	}

	/**
	 * 
	 * @param userID 
	 * @param playerID 
	 * @param user_socket 
	 * @returns the joining game if can be found
	 */
	joinGame(
		userID: number,
		playerID: number,
		user_socket: Socket
	): GameSocket | undefined {
		const game = this.games.get(playerID);

		if (game)
		{
			const roomId = game.roomId;
			let my_gameSocket: GameSocket = {} as GameSocket;

			// updating structures
			Object.assign(my_gameSocket, game);
			my_gameSocket.user_socket = user_socket;
			this.games.set(userID, my_gameSocket);

			return game;
		}
		return undefined;
	}

	
	/**
	 * @brief this function updates db MatchHistory info AND PlayerStats info.
	 * @param finalFrame 
	 */
	async setGameasFinished(finalFrame: FrameDto)
	{
		// const winnerID: number = finalFrame.data.host.score > finalFrame.data.guest.score ?
		// 	finalFrame.hostID :
		// 	finalFrame.guestID;
		// const loserID: number = finalFrame.data.host.score < finalFrame.data.guest.score ?
		// 	finalFrame.hostID :
		// 	finalFrame.guestID;
		// const winner = await this.prisma.player.findUnique({
		// 	where: {
		// 		id: winnerID
		// 	}
		// });
		// const loser = await this.prisma.player.findUnique({
		// 	where: {
		// 		id: loserID
		// 	}
		// });
		
		// updating match info
		await this.prisma.plays.create({
			data: {
				score_host: finalFrame.data.host.score,
				score_Guest: finalFrame.data.guest.score,

				hostID: finalFrame.hostID,
				guestID: finalFrame.guestID
			}
		})

		// updating player stats
		// let winnerGames = await this.prisma.plays.count({
		// 	where: {
		// 		OR: [
		// 			{hostID: winnerID},
		// 			{guestID: winnerID},
		// 		]
		// 	}
		// });
		// let loserGames = await this.prisma.plays.count({
		// 	where: {
		// 		OR: [
		// 			{hostID: loserID},
		// 			{guestID: loserID},
		// 		]
		// 	}
		// });
		// await this.prisma.player.update({
		// 	where: {
		// 		id: winnerID
		// 	},
		// 	data: {
		// 		wins: {increment: 1},
		// 		ladder_lvl: (
		// 			(winnerGames + 1) * (winner.wins + 1 + 1)/(winner.losses + 1)
		// 		)
		// 	}
		// });
		// await this.prisma.player.update({
		// 	where: {
		// 		id: loserID
		// 	},
		// 	data: {
		// 		losses: {increment: 1},
		// 		ladder_lvl: (
		// 			(loserGames + 1) * (loser.wins + 1)/(loser.losses + 1 + 1)
		// 		)
		// 	}
		// });
	}

	// async updateAchievements(finalFrame: FrameDto, userID: number)
	// {
	// 	// const winnerID: number = finalFrame.data.host.score > finalFrame.data.guest.score ?
	// 	// 	finalFrame.hostID :
	// 	// 	finalFrame.guestID;
	// 	// const loserID: number = finalFrame.data.host.score < finalFrame.data.guest.score ?
	// 	// 	finalFrame.hostID :
	// 	// 	finalFrame.guestID;
		
	// 	// if (userID != winnerID)
	// 	// 	return ;
	// 	// const player = await this.prisma.player.findUnique({
	// 	// 	where: {
	// 	// 		id: userID
	// 	// 	}
	// 	// });

	// 	// let achievementName: string | null = null;

	// 	// if (1 == player.wins)
	// 	// 	achievementName = 'promising kitty';
	// 	// else
	// 	// if (3 == player.wins)
	// 	// 	achievementName = 'Now feed me some good tuna!';
	// 	// else
	// 	// if (5 == player.wins)
	// 	// 	achievementName = 'I need no Catnip to win!';

	// 	// if (achievementName)
	// 	// 	this.prisma.achieved.create({
	// 	// 		data: {
	// 	// 			playerID: userID,
	// 	// 			achievementName: achievementName,
	// 	// 			date_of_issue: new Date(),
	// 	// 		}
	// 	// 	});
	// }

	create(createGameDto: CreateGameDto) {
		return 'This action adds a new game';
	}

	findAll() {
		return `This action returns all game`;
	}

	findOne(id: number) {
		return `This action returns a #${id} game`;
	}

	update(id: number, updateGameDto: UpdateGameDto) {
		return `This action updates a #${id} game`;
	}

	remove(id: number) {
		return `This action removes a #${id} game`;
	}
}
