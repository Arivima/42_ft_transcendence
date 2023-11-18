import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {

	constructor(private readonly prisma: PrismaService) {}

	async playerMatch(hostID: number, guestID: number): Promise<boolean>
	{
		const friendship = await this.prisma.beFriends.findUnique({
			where: {
				requestorID_recipientID: {
					requestorID: hostID,
					recipientID: guestID,
				}
			}
		})
		||
		await this.prisma.beFriends.findUnique({
			where: {
				requestorID_recipientID: {
					requestorID: hostID,
					recipientID: guestID,
				}
			}
		});

		if (null == friendship)
			return true;
		if (friendship.recipient_blacklisted || friendship.requestor_blacklisted)
			return false;

		return true;
	}

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
