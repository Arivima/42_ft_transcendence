import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { FrienshipsService } from './frienships.service';
import { CreateFrienshipDto } from './dto/create-frienship.dto';
import { UpdateFrienshipDto } from './dto/update-frienship.dto';
import { Socket, Server } from 'socket.io';
import { Player } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class FrienshipsGateway implements OnGatewayConnection {

	@WebSocketServer()
	private server: Server;
	/**
	 * key: userID
	 * value: connected Socket
	 */
	private clients: Map<number, Socket>;

	constructor(
		private readonly frienshipsService: FrienshipsService,
		private readonly jwtService: JwtService
		) {
			this.clients = new Map<number, Socket>();
		}

	//TODO add JWT guard -- && understand how to reuse the jwt guard and check wether we are on http or websockets
	async handleConnection(client: Socket, ...args: any[]) {
		const user = await this.jwtService.verifyAsync(client.handshake.auth.token, {
			secret: process.env.JWT_SECRET
		});
		
		// https://socket.io/docs/v4/client-options/#auth
		this.clients.set(Number(user.sub), client);
	}

	@SubscribeMessage('createFrienshipRequest')
	async createFrienshipRequest(
		@MessageBody('id') userID: number,
		@MessageBody('recipientID') recipientID: number,
		@ConnectedSocket() socket: Socket
	) {
		try {
			const requestor = await this.frienshipsService.createFrienshipRequest(userID, recipientID);
			
			// https://socket.io/docs/v3/rooms/#default-room
			this.server.to(`Socket#${this.clients[recipientID]}`).emit('newFriendShipRequest', {
				requestorID: requestor.requestorID,
				requestorAvatar: requestor.requestorAvatar
			})
		}
		catch(error) {
			this.server.to(`Socket#${this.clients[recipientID]}`).emit('frienship-error', {
				msg: error.toString(),
				requestorID: userID,
				recipientID: recipientID,
			})
		}
	}

	@SubscribeMessage('findAllFrienshipRequests')
	async findAllFrienshipRequests(
			@MessageBody('id') userID: number,
			@ConnectedSocket() socket: Socket
	) {
		try {
			const friendshipRequests = await this.frienshipsService.findAllFrienshipRequests(userID);

			this.server.to(`Socket#${socket.id}`).emit('friendship-requests', {
				requests: friendshipRequests
			});
		}
		catch(error) {
			this.server.to(`Socket#${socket.id}`).emit('frienship-error', {
				msg: error.toString(),
				requestorID: userID,
				recipientID: NaN
			});
		}
	}

	@SubscribeMessage('updateFrienshipRequest')
	async updateFrienshipRequest(
		@MessageBody() updateFrienshipDto: UpdateFrienshipDto,
	) {
		try {
			const updatedRecord
				= await this.frienshipsService
					.updateFrienshipRequest(updateFrienshipDto);

			this.server
				.to(`Socket#${this.clients[updateFrienshipDto.requestorID]}`)
				.emit('update-friendship-request', {
					...updatedRecord
			});
			this.server
				.to(`Socket#${this.clients[updateFrienshipDto.recipientID]}`)
				.emit('update-friendship-request', {
				...updatedRecord
			});
		}
		catch (error) {
			this.server
				.to(`Socket#${this.clients[updateFrienshipDto.requestorID]}`)
				.emit('friendship-error', {
					msg: error.toString(),
					requestorID: updateFrienshipDto.requestorID,
					recipientID: updateFrienshipDto.recipientID
			});
			this.server
				.to(`Socket#${this.clients[updateFrienshipDto.recipientID]}`)
				.emit('friendship-error', {
					msg: error.toString(),
					requestorID: updateFrienshipDto.requestorID,
					recipientID: updateFrienshipDto.recipientID
			});
		}
	}
}
