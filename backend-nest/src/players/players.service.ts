import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';

@Injectable()
export class PlayersService {
	private connections: Set<number>;

	constructor(private readonly prisma: PrismaService) {
		this.connections = new Set<number>();
	}

	addConnection(userID: number) {
		console.log(
			`adding connection for user ${userID} with type ${typeof userID}`,
		);
		this.connections.add(userID);
	}

	removeConnection(userID: number) {
		this.connections.delete(userID);
	}

	isLoggedIn(userID: number): boolean {
		console.log(
			`checking connection for user ${userID} with type ${typeof userID}`,
		);
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
		return this.prisma.player.findMany();
	}

	async findOne(id: number): Promise<Player | null> {
		console.log('Calling prisma,findUnique with id : ');
		console.log(id);
		return this.prisma.player.findUnique({
			where: { id },
		});
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
