import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';

@Injectable()
export class PlayersService {

	constructor(private readonly prisma : PrismaService) {}

	async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
		return this.prisma.player.create({
		//   data: {
		// 	id : createPlayerDto.id,
		// 	username : createPlayerDto.username,
		// 	avatar : createPlayerDto.avatar
		//   },
		});
	}

	async findAll() : Promise<Player[]>{
		return this.prisma.player.findMany();
	}

	async findOne(id: number) : Promise<Player | null> {
		return this.prisma.player.findUnique({
			where : {id}
		});
	}

	async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
		try {
			return await this.prisma.player.update({
				where : {id},
				data : updatePlayerDto
			});
		}
		catch (error : any) {
			return null;
		}
	}

	async remove(id: number): Promise<Player> {
		try {
			return await this.prisma.player.delete({
				where : {id},
			});
		}
		catch (error : any) {
			return null;
		}
	}
}
