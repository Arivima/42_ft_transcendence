import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FrameDto } from './dto/frame.dto';

@Injectable()
export class GameService {

	constructor(private readonly prisma: PrismaService) {}

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

	/**
	 * @brief this function updates db MatchHistory info AND PlayerStats info.
	 * @param finalFrame 
	 */
	async setGameasFinished(finalFrame: FrameDto)
	{
		const winnerID: number = finalFrame.data.host.score > finalFrame.data.guest.score ?
			finalFrame.hostId :
			finalFrame.guestID;
		const loserID: number = finalFrame.data.host.score < finalFrame.data.guest.score ?
			finalFrame.hostId :
			finalFrame.guestID;
		
		// updating match info
		await this.prisma.plays.create({
			data: {
				score_host: finalFrame.data.host.score,
				score_Guest: finalFrame.data.guest.score,

				hostID: finalFrame.hostId,
				guestID: finalFrame.guestID
			}
		})

		// updating player stats
		await this.prisma.player.update({
			where: {
				id: winnerID
			},
			data: {
				wins: {increment: 1}
			}
		});
		await this.prisma.player.update({
			where: {
				id: loserID
			},
			data: {
				losses: {increment: 1}
			}
		});
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
