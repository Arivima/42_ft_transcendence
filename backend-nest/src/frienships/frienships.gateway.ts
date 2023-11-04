import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { FrienshipsService } from './frienships.service';
import { CreateFrienshipDto } from './dto/create-frienship.dto';
import { UpdateFrienshipDto } from './dto/update-frienship.dto';
import { Socket, Server } from 'socket.io';
import { Player } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/auth/decorators/auth.public.decorator';

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_URL,
	},
})
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
	@Public()
	async handleConnection(client: Socket, ...args: any[]) {
		const user = await this.jwtService.verifyAsync(client.handshake.auth.token, {
			secret: process.env.JWT_SECRET
		});
		
		console.log(`socket: ${client.id}, userID: ${Number(user.sub)}, connected`)
		// https://socket.io/docs/v4/client-options/#auth
		this.clients.set(Number(user.sub), client);
	}
	
	@Public()
	@SubscribeMessage('createFrienshipRequest')
	async createFrienshipRequest(
		@MessageBody('id') userID: number,
		@MessageBody('recipientID') recipientID: number,
		@ConnectedSocket() socket: Socket
	) {
		console.log(`GATEWAY | createFrienshipRequest`);
		try {
			//TODO add jwt service to check if id user that sent the request matches either requestor or recipient
			//TODO otherwise, anyone connected can act upon anyone friendships
			// if (client.handshake.auth)
			const requestor = await this.frienshipsService.createFrienshipRequest(userID, recipientID);

			// https://socket.io/docs/v3/rooms/#default-room
			this.server.to(`${this.clients.get(Number(recipientID)).id}`).emit('new-friendship-request', {
				requestorID: requestor.requestorID,
				requestorUsername: requestor.requestorUsername,
				requestorAvatar: requestor.requestorAvatar
			})
		}
		catch(error) {
			const msg: string = `new-friendship-request: ${error.toString()}`;

			this.server.to(`${this.clients.get(Number(recipientID)).id}`).emit('frienship-error', {
				msg: msg,
				requestorID: userID,
				recipientID: recipientID,
			})
		}
	}

	@Public()
	@SubscribeMessage('findAllFrienshipRequests')
	async findAllFrienshipRequests(
			@MessageBody('id') userID: number,
			@ConnectedSocket() requestorSocket: Socket
	) {
		try {
			//TODO add jwt service to check if id user that sent the request matches either requestor or recipient
			//TODO otherwise, anyone connected can act upon anyone friendships
			// if (client.handshake.auth)
			const friendshipRequests = await this.frienshipsService.findAllFrienshipRequests(userID);

			this.server.to(`${requestorSocket.id}`).emit('friendship-requests', {
				requests: friendshipRequests
			});
		}
		catch(error) {
			const msg: string = `friendship-requests: ${error.toString()}`;

			this.server.to(`${requestorSocket.id}`).emit('frienship-error', {
				msg: msg,
				requestorID: userID,
				recipientID: NaN
			});
		}
	}

	/**
	 * a friendship must either be pending or "are_friends" is true
	 * if any of the user is blacklisted, the are_friends fielf must be false and pending must be false,
	 * when a friendship is rejected, the record is removed
	 * A record cannot be removed if any of the users is blacklisted
	 * 
	 * All these rules must be written as constraints in postgre (maybe not the last rule)
	 * Therefore, this function will automatically fail if any of the rules are violated.
	 */
	//TODO add constraints in db for frienship fields (when a user is blacklisted pending cannot be true, when pending is true friend cannot be, etc.)
	@Public()
	@SubscribeMessage('updateFrienshipRequest')
	async updateFrienshipRequest(
		@MessageBody() updateFrienshipDto: UpdateFrienshipDto,
	) {

		try {
			//TODO add jwt service to check if id user that sent the request matches either requestor or recipient
			//TODO otherwise, anyone connected can act upon anyone friendships
			// if (client.handshake.auth)
			const updatedRecord
				= await this.frienshipsService
					.updateFrienshipRequest(updateFrienshipDto);

			if (this.clients.has(Number(updateFrienshipDto.requestorID))) {
				this.server
					.to(`${this.clients.get(Number(updateFrienshipDto.requestorID)).id}`)
					.emit('update-friendship-request', {
						...updatedRecord
				});
			}
			if (this.clients.has(Number(updateFrienshipDto.recipientID))) {
				this.server
					.to(`${this.clients.get(Number(updateFrienshipDto.recipientID)).id}`)
					.emit('update-friendship-request', {
					...updatedRecord
				});
			}
		}
		catch (error) {
			const msg: string = `update-friendship-request: ${error.toString()}`;
			this.server
				.to(`${this.clients.get(Number(updateFrienshipDto.requestorID)).id}`)
				.emit('friendship-error', {
					msg: msg,
					requestorID: updateFrienshipDto.requestorID,
					recipientID: updateFrienshipDto.recipientID
			});
			this.server
				.to(`${this.clients.get(Number(updateFrienshipDto.recipientID)).id}`)
				.emit('friendship-error', {
					msg: msg,
					requestorID: updateFrienshipDto.requestorID,
					recipientID: updateFrienshipDto.recipientID
			});
		}
	}

	@Public()
	@SubscribeMessage('rejectFrienship')
	async deleteFriendship(
		@MessageBody('userID') userID: number,
		@MessageBody('friendID') friendID: number,
		@ConnectedSocket() client: Socket
	)
	{
		let [requestorID, recipientID] = await this.frienshipsService.getFriendship(userID, friendID);

		try {
			//TODO add jwt service to check if id user that sent the request matches either requestor or recipient
			//TODO otherwise, anyone connected can act upon anyone friendships
			// if (client.handshake.auth)
			await this.frienshipsService.deleteFrienshipRequest(requestorID, recipientID);

			this.server
				.to(`${this.clients.get(recipientID).id}`)
				.emit('reject-friendship-request', {
					requestorID,
					recipientID
				})
			this.server
				.to(`${this.clients.get(requestorID).id}`)
				.emit('reject-friendship-request', {
					requestorID,
					recipientID
				})
		}
		catch(err) {
			const msg = `rejectFrienship: ${err.toString()}`;

			this.server
				.to(`${this.clients.get(recipientID).id}`)
				.emit('friendship-error', {
					msg: msg,
					requestorID: requestorID,
					recipientID: recipientID
				});
			this.server
				.to(`${this.clients.get(requestorID).id}`)
				.emit('friendship-error', {
					msg: msg,
					requestorID: requestorID,
					recipientID: recipientID
				});
		}
	}
}
