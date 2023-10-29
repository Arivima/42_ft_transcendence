import { Injectable } from '@nestjs/common';
import { CreateFrienshipDto } from './dto/create-frienship.dto';
import { UpdateFrienshipDto } from './dto/update-frienship.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BeFriends, Player } from '@prisma/client';
import { SendFriendshipRequestDto } from './dto/send-friendship-request.dto';

@Injectable()
export class FrienshipsService {

	constructor(private readonly prisma: PrismaService) {}

	async createFrienshipRequest(userID : number, recipientID: number): Promise<SendFriendshipRequestDto> {
		
		const requestor = await this.prisma.player.findUnique({
			where: {
				id: userID
			},
			select: {
				id: true,
				avatar: true
			}
		});

		await this.prisma.beFriends.create({
			data: {
				requestorID: userID,
				recipientID: recipientID
			},
		})

		return {
			requestorID: requestor.id,
			requestorAvatar: requestor.avatar
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
					avatar: true
				}
			});
			if (null != recordFound)
				requestors.push({
					requestorID: recordFound.id,
					requestorAvatar: recordFound.avatar
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
