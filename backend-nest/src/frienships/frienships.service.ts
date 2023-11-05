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

		/**
		 * A friendship request may only be sent when the friendship
		 * relation instance does not exist
		 * 
		 * A friendship relation instance might exist when:
		 *	1. the friendship request is pending
		 *	2. a user blocked another user
		 */
		if (friendship) {
			if (friendship.recipient_blacklisted || friendship.requestor_blacklisted)
				throw Error('friendships requests cannot be among blocked users (both ways)');
			throw Error('friendship request already exist');
		}
		
		await this.prisma.beFriends.create({
			data: {
				requestorID: userID,
				recipientID: recipientID
			},
		})
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

	async toggleBlockUser(userID: number, requestorID: number, recipientID: number, block: boolean) {

		if (undefined == requestorID)
			throw Error('could not find friendship for these requestor and recipient');

		if (requestorID == userID)
			await this.prisma.beFriends.update({
				where: {
					requestorID_recipientID: {
						requestorID,
						recipientID
					}
				},
				data: {
					are_friends: false,
					pending_friendship: false,
					recipient_blacklisted: block
				}
			});
		else if (recipientID == userID)
			await this.prisma.beFriends.update({
				where: {
					requestorID_recipientID: {
						requestorID,
						recipientID
					}
				},
				data: {
					are_friends: false,
					pending_friendship: false,
					requestor_blacklisted: block
				}
			});
		else
			throw Error('could not find friendship for these requestor and recipient');
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

	async deleteFrienshipRequest(requestorID: number, recipientID: number) {

		if (undefined == requestorID)
			throw Error('Could not find friendhip');

		const friendship = await this.prisma.beFriends.findUnique({
			where: {
				requestorID_recipientID: {
					requestorID,
					recipientID
				}
			}
		});

		if (friendship.requestor_blacklisted || friendship.recipient_blacklisted)
			throw Error("Cannot delete friendship among blocked users")
		
		await this.prisma.beFriends.delete({
			where: {
				requestorID_recipientID: {
					requestorID,
					recipientID
				}
			}
		});
	}

	//Helpers

	async getFriendship(userID: number, friendID: number): Promise<number[]> {
		if (
			await this.prisma.beFriends.findUnique({
				where: {
					requestorID_recipientID: {
						requestorID: userID,
						recipientID: friendID
					}
				}
			})
		) {
			return [userID, friendID];
		}
		else if (
			await this.prisma.beFriends.findUnique({
				where: {
					requestorID_recipientID: {
						requestorID: friendID,
						recipientID: userID
					}
				}
			})
		) {
			return [friendID, userID];
		}
		else {
			return [];
		}
	}

}
