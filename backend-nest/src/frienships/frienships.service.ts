import { Injectable } from '@nestjs/common';
import { CreateFrienshipDto } from './dto/create-frienship.dto';
import { UpdateFrienshipDto } from './dto/update-frienship.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BeFriends, Player } from '@prisma/client';
import { SendFriendshipRequestDto } from './dto/send-friendship-request.dto';

@Injectable()
export class FrienshipsService {

	constructor(private readonly prisma: PrismaService) {}

	//TODO CONTINUAREEEE
	async createFrienshipRequest(userID : number, recipientID: number): Promise<SendFriendshipRequestDto> {
		
		const requestor = await this.prisma.player.findUnique({
			where: {
				id: userID
			},
			select: {
				id: true,
				username: true,
				avatar: true
			}
		});
		const friendship = await this.prisma.beFriends.findUnique({
			where: {
				requestorID_recipientID: {
					requestorID: userID,
					recipientID: recipientID
				},
			},
		});

		if (null == friendship) {
			await this.prisma.beFriends.create({
				data: {
					requestorID: userID,
					recipientID: recipientID
				},
			})
		}
		else if (false == friendship.pending_friendship) {
			await this.prisma.beFriends.update({
				where: {
					requestorID_recipientID: {
						requestorID: userID,
						recipientID: recipientID
					},
				},
				data: {
					pending_friendship: true,
				},
			})
		}

		return {
			requestorID: requestor.id,
			requestorUsername: requestor.username,
			requestorAvatar: `players/avatar/${requestor.id}`
		};
	}

	async findAllFrienshipRequests(userID: number): Promise<SendFriendshipRequestDto[]> {
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

		let requestors: SendFriendshipRequestDto[] = [];
		let recordFound: any;
		for (let requestorID of requestorsIDs) {
			recordFound = await this.prisma.player.findUnique({
				where: {
					id: requestorID.requestorID
				},
				select: {
					id: true,
					username: true,
					avatar: true
				}
			});
			if (null != recordFound)
				requestors.push({
					requestorID: recordFound.id,
					requestorUsername: recordFound.username,
					requestorAvatar: `players/avatar/${recordFound.id}`
				});
		}
		return requestors;
	}

	async updateFrienshipRequest(updateFrienshipDto: UpdateFrienshipDto): Promise<BeFriends> {
		return await this.prisma.beFriends.update({
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
