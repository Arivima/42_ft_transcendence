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
		return {
			...(await this.prisma.player.findUnique({
				where: { id },
			})),
			...this.connections.get(id),
		};
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
