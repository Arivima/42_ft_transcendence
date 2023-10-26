import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';

export class Connection {
	playing: boolean;
}

@Injectable()
export class PlayersService {
	private connections: Map<number, Connection>;

	constructor(private readonly prisma: PrismaService) {
		this.connections = new Map<number, Connection>();
	}

	addConnection(userID: number) {
		this.connections.set(userID, { playing: false });
	}

	removeConnection(userID: number) {
		this.connections.delete(userID);
	}

	isLoggedIn(userID: number): boolean {
		return this.connections.has(userID);
	}

	// async downloadFile(url: path)

	async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
        console.log('DEBUG | Players.Service | create() : called');


		return this.prisma.player.create({
			data: {
				id: createPlayerDto.id,
				username: createPlayerDto.username,
				avatar: createPlayerDto.avatar,
				firstName: createPlayerDto.firstName,
				lastName: createPlayerDto.lastName,
				profileIntra: createPlayerDto.profileIntra,
			},
		});
	}

	async findAll(): Promise<Player[]> {
		const players = await this.prisma.player.findMany();

		for (let player of players) {
			player = {
				...player,
				...this.connections.get(player.id),
			};
		}
		return players;
	}

	async findOne(id: number): Promise<Player & Connection> {
		const player = {
			...(await this.prisma.player.findUnique({
				where: { id },
			})),
			...this.connections.get(id),
		};

		return JSON.stringify(player) == '{}' ? null : player;
	}

	async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
		try {
			return await this.prisma.player.update({
				where: { id },
				data: updatePlayerDto,
			});
		} catch (error: any) {
			return null;
		}
	}

	async remove(id: number): Promise<Player> {
		try {
			return await this.prisma.player.delete({
				where: { id },
			});
		} catch (error: any) {
			return null;
		}
	}

	async getAllFriends(userID: number): Promise<(Player & Connection)[]> {
        console.log(`DEBUG | Players.Service | getAllFriends | userID: ${userID}`);
		const friendsAsRequestorIDs = await this.prisma.beFriends.findMany({
			where: {
				requestorID: userID,
				are_friends: true,
			},
			select: {
				recipientID: true,
			},
		});
		const friendsAsRecipientIDs = await this.prisma.beFriends.findMany({
			where: {
				recipientID: userID,
				are_friends: true,
			},
			select: {
				requestorID: true,
			},
		});

		const friendsIDs: number[] = [];
		for (const friend of friendsAsRequestorIDs) {
			friendsIDs.push(friend.recipientID);
		}
		for (const friend of friendsAsRecipientIDs) {
			friendsIDs.push(friend.requestorID);
		}
        console.log(`DEBUG | Players.Service | getAllFriends | friendsIDs: ${friendsIDs}`);
		const friends = [];
		for (const friendID of friendsIDs) {
			friends.push(await this.findOne(friendID));
		}

		return friends;
	}

	// TODO make achievementName unique

	async getAllAchievements(userID: number): Promise<(Player & Connection)[]> {
        console.log(`DEBUG | Players.Service | getAllAchievements | userID: ${userID}`);
		const achievementNames = await this.prisma.achieved.findMany({
			where: {
				playerID: userID,
			},
			select: {
				achievementName: true,
			},
		});

        console.log(`DEBUG | Players.Service | getAllAchievements | achievementNames: ${achievementNames}`);
		const achievements = [];
		for (const achievementName of achievementNames) {
			achievements.push(
				await this.prisma.achievement.findUnique({
					where: {
						name: achievementName.achievementName,
					},
					select: {
						name: true,
						description: true,
						picture: true,
					},
				}),
			);
		}
		return achievements;
	}

	//TODO
	//DONE	1 : modify Plays table and Migrate
	//DONE	2 : finish this endpoint
	//DONE but improve	2.1 : AVOID USING STORE in front
	//DONE		2.2: MatchHistory: use Server Side table with seb socket (socket.io)
	//DONE	5 : Do 2FA auth on the frontend
	//DONE	7 : Implement Logout
	//DONE	8 : add type spec to this endpoint handler
	//?	3 : Add "insert into Achievements.." script by hand
	//?	4 : TEST
	//?	7 : Handle Images url to png (or blob) files in db
	//?	6 : Rethink Vue pinia Stores.
	async getAllGames(
		userID: number,
		limit: number = Infinity,
	): Promise<
		{
			createdAt: Date;
			host: string;
			guest: string;
			host_score: number;
			guest_score: number;
		}[]
	> {
		const gamesAsHost = await this.prisma.plays.findMany({
			where: {
				hostID: userID,
			},
			select: {
				createdAt: true,
				hostID: true,
				guestID: true,
				score_host: true,
				score_Guest: true,
			},
		});
		const gamesAsGuest = await this.prisma.plays.findMany({
			where: {
				guestID: userID,
			},
			select: {
				createdAt: true,
				guestID: true,
				hostID: true,
				score_host: true,
				score_Guest: true,
			},
		});

		let games = [];
		for (const game of gamesAsHost) {
			games.push({
				createdAt: game.createdAt,
				host: (await this.findOne(game.hostID)).username,
				guest: (await this.findOne(game.guestID)).username,
				host_score: game.score_host,
				guest_score: game.score_Guest,
			});
		}
		for (const game of gamesAsGuest) {
			games.push({
				createdAt: game.createdAt,
				host: (await this.findOne(game.hostID)).username,
				guest: (await this.findOne(game.guestID)).username,
				host_score: game.score_host,
				guest_score: game.score_Guest,
			});
		}
		games = games.slice(0, limit);
		// const games = gamesAsGuest
		// 	.map(async (el) => {
		// 		host: (await this.findOne(el.hostID)).username;
		// 		guest: (await this.findOne(el.guestID)).username;
		// 		host_score: el.score_host;
		// 		guest_score: el.score_Guest;
		// 	})
		// 	.concat(
		// 		gamesAsHost.map(async (el) => {
		// 			host: (await this.findOne(el.hostID)).username;
		// 			guest: (await this.findOne(el.guestID)).username;
		// 			host_score: el.score_host;
		// 			guest_score: el.score_Guest;
		// 		}),
		// 	)
		// 	.slice(0, limit);
        console.log(`DEBUG | Players.Service | getAllGames | games : ` + games);

		return games;
	}

	// async addFriend(recpientID: number, requestorID: number) {}

	// async acceptFriendship(recpientID: number, requestorID: number) {}

	// async getChats(
	// 	id: number,
	// 	limit: number,
	// ): Promise<
	// 	{
	// 		name: string;
	// 		dm: boolean;
	// 		avatar: string;
	// 	}[]
	// > {
	// 	console.log(id);
	// 	console.log(limit);

	// 	// this.prisma.

	// 	return [
	// 		{
	// 			name: '',
	// 			dm: false,
	// 			avatar: '',
	// 		},
	// 		{
	// 			name: '',
	// 			dm: false,
	// 			avatar: '',
	// 		},
	// 	];
	// }
}
