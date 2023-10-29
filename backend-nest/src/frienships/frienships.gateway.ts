import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { FrienshipsService } from './frienships.service';
import { CreateFrienshipDto } from './dto/create-frienship.dto';
import { UpdateFrienshipDto } from './dto/update-frienship.dto';
import { Socket } from 'dgram';
import { Player } from '@prisma/client';

export class Outcome {
	outcome: boolean;
}

@WebSocketGateway()
export class FrienshipsGateway {
	constructor(private readonly frienshipsService: FrienshipsService) {}

	@SubscribeMessage('createFrienshipRequest')
	createFrienshipRequest(
		@MessageBody('id') userID: number,
		@MessageBody('recipientID') recipientID: number,
		@ConnectedSocket() socket: Socket
	) {
		let outcome: boolean;

		try {
			this.frienshipsService.createFrienshipRequest(userID, recipientID);
			outcome = true;
		}
		catch(_) {
			outcome = false;
		}
		return {outcome};
	}

	@SubscribeMessage('findAllFrienshipRequests')
	async findAllFrienshipRequests(
			@MessageBody('id') userID: number
	) : Promise<Player[]> {
		try {
			return await this.frienshipsService.findAllFrienshipRequests(userID);
		}
		catch(_) {
			return [] as Player[];
		}
	}

	@SubscribeMessage('updateFrienshipRequest')
	async updateFrienshipRequest(
		@MessageBody() updateFrienshipDto: UpdateFrienshipDto,
		@ConnectedSocket() socket: Socket
	) : Promise<Outcome> {
		let outcome: boolean;

		try {
			await this.frienshipsService.updateFrienshipRequest(updateFrienshipDto);
			outcome = true;
		}
		catch (_) {
			outcome = false;
		}
		return {outcome}
	}
}
