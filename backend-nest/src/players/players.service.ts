import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';

@Injectable()
export class PlayersService {

	constructor(
	  // @InjectRepository(Player)
	  private readonly prisma : PrismaService//playerRepository: Repository<Player>,
	) {}

	async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
		return this.prisma.player.create({
		  data: createPlayerDto,
		});
	}

	// returns empty
	async findAll() : Promise<Player[]>{
		return this.prisma.player.findMany();
	}

	// returns null
	async findOne(id: number) : Promise<Player | null> {
		return this.prisma.player.findUnique({
			where : {id}
		});
	}

	// update(id: number, updatePlayerDto: UpdatePlayerDto) {
	//   return `This action updates a #${id} player`;
	// }
	//! throws exceptions
	async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
		return this.prisma.player.update({
			where : {id},
			data : updatePlayerDto
		});
	}

	// remove(id: number) {
	//   return `This action removes a #${id} player`;
	// }
	//! throws exceptions
	async remove(id: number): Promise<Player> {
		return this.prisma.player.delete({
			where : {id}
		});
	}
}
