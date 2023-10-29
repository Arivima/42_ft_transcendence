import { Injectable } from '@nestjs/common';
import { CreateFrienshipDto } from './dto/create-frienship.dto';
import { UpdateFrienshipDto } from './dto/update-frienship.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';

@Injectable()
export class FrienshipsService {

	constructor(private readonly prisma: PrismaService) {}

	createFrienshipRequest(userID : number, recipientID: number) {
		this.prisma.beFriends.create({
			data: {
				requestorID: userID,
				recipientID: recipientID
			},
		})
	}

	async findAllFrienshipRequests(userID: number): Promise<Player[]> {
		const requestorsIDs = await this.prisma.beFriends.findMany({
				where: {
					recipientID: userID,
					are_friends: false,
					pending_friendship: true,
				},
				select: {
					requestorID: true,
				},
		});

		let requestors: Player[] = [];
		let recordFound: Player | null;
		for (let requestorID of requestorsIDs) {
			recordFound = await this.prisma.player.findUnique({
				where: {
					id: requestorID.requestorID
				},
			});
			if (null != recordFound)
				requestors.push(recordFound);
		}
		return requestors;
	}

	async updateFrienshipRequest(updateFrienshipDto: UpdateFrienshipDto) {
		await this.prisma.beFriends.update({
			where: {
				requestorID_recipientID: {
					requestorID: updateFrienshipDto.requestorID,
					recipientID: updateFrienshipDto.recipientID
				}
			},
			data: {
				are_friends: updateFrienshipDto.are_friends,
				pending_friendship: updateFrienshipDto.pending_friendship,
				requestor_blacklisted: updateFrienshipDto.requestor_blacklisted,
				recipient_blacklisted: updateFrienshipDto.recipient_blacklisted,
			}
		});
	}
}
