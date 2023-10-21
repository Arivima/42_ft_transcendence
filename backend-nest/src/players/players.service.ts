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

	async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
		console.log('DEBUG | PlayersService | create() : called');

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

	async getAllFriends(userID: number) : Promise<(Player & Connection)[]> {
		console.log(`userID: ${userID}`);
		const friendsAsRequestorIDs = await this.prisma.beFriends.findMany({
			where: {
				requestorID: userID,
				are_friends: true
			},
			select: {
				recipientID: true
			}
		});
		const friendsAsRecipientIDs = await this.prisma.beFriends.findMany({
			where: {
				recipientID: userID,
				are_friends: true,
			},
			select: {
				requestorID: true
			}
		});

		const friendsIDs : number[] = [];
		for (const friend of friendsAsRequestorIDs) {
			friendsIDs.push(friend.recipientID);
		}
		for (const friend of friendsAsRecipientIDs) {
			friendsIDs.push(friend.requestorID);
		}
		console.log(`friendsIDs: ${friendsIDs}`);
		let	friends = [];
		for (const friendID of friendsIDs) {
			friends.push(
				await this.findOne(friendID)
			);
		}

		return (friends);
	}


// TODO make achievementName unique

	async getAllAchievements(userID: number) : Promise<(Player & Connection)[]> {
		console.log(`userID: ${userID}`);
		const achievementNames = await this.prisma.achieved.findMany({
			where: {
				playerID: userID,
			},
			select: {
				achievementName : true,
			}
		});

		console.log(`achievementNames: ${achievementNames}`);
		let	achievements = [];
		for (const achievementName of achievementNames) {
			achievements.push(
				await this.prisma.achievement.findUnique({
					where : {
						name: achievementName.achievementName,
					},
					select : {
						name : true,
						description : true,
						picture : true,
					}
				})
			);

		}
		return (achievements);
	}

	async addFriend(recpientID: number, requestorID: number) {
	}

	async acceptFriendship(recpientID: number, requestorID: number) {
	}

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
