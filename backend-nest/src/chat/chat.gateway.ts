import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtService } from '@nestjs/jwt';
import { async } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server
  // constructor(private readonly chatService: ChatService) {}
  private clients: Map<number, Socket>;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService
  ) {
    this.clients = new Map<number, Socket>();
  }


  async handleConnection(client: any, ...args: any[]) {
    console.log('chat connected');
    const user = await this.jwtService.verifyAsync(client.handshake.auth.token, {
			secret: process.env.JWT_SECRET
		});
    console.log(`socket chat: ${client.id}, userID: ${Number(user.sub)}, connected`)
    // this.server.emit('message', 'Hello world!');
    this.clients.set(Number(user.sub), client);
    // client.emit('message', 'Hello world!');
  }

  handleDisconnect(client: any) {
    console.log('chat disconnected');
    // client.emit('message', 'Hello world!');
    this.clients.delete(client.id);
  }

  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }



  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage("join")
  joinRoom() {
    console.log("join");
  }

  // @SubscribeMessage("typing")
  // typing(@MessageBody("isTyping") isTyping: boolean, @ConnectedSocket() client: Socket) {
  //   client.broadcast.emit("typing", isTyping);
  // }

  @SubscribeMessage("getmessagesprivatechat")
  getMessagesPrivateChat(@MessageBody("userId") userId: string, @MessageBody("receiverId") receiverId: string) {
    console.log(`DEBUG | chat.controller | getMessagesPrivateChat | userId: ${userId}`);
    return this.chatService.getMessagesPrivateChat(Number(userId), Number(receiverId));
  }

  @SubscribeMessage("getparents")
  getParents(@MessageBody("userId") userId: string) {
    console.log(`DEBUG | chat.controller | getParents | userId: ${userId}`);
    return this.chatService.getParents(Number(userId));
  }
  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }

  // @SubscribeMessage('message')
  // handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  //   console.log(`DEBUG | chat.gateway | handleMessage | data: ${data}`);
  //   let CreateChatDto: CreateChatDto = JSON.parse(JSON.parse(data).data);
  //   this.chatService.create(CreateChatDto);
  //   if (CreateChatDto.receiverID) {
  //     this.server.to(`${this.clients.get(Number(CreateChatDto.receiverID)).id}`).emit('message', data);
  //   } else if (CreateChatDto.receiversID) {
  //     for (let receiverID of CreateChatDto.receiversID) {
  //       this.server.to(`${this.clients.get(Number(receiverID)).id}`).emit('message', data);
  //     }
  //   }

  // }
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(`DEBUG | chat.gateway | handleMessage | data: ${data}`);
    let CreateChatDto: CreateChatDto = JSON.parse(JSON.parse(data).data);
    let recClientId;

    await this.chatService.create(CreateChatDto);
    if (CreateChatDto.receiverID) {
      recClientId = this.clients.get(Number(CreateChatDto.receiverID));
      if (recClientId)
        this.server.to(`${recClientId.id}`).emit('message', data);
    } else if (CreateChatDto.receiversID) {
      for (let receiverID of CreateChatDto.receiversID) {
        recClientId = this.clients.get(Number(receiverID));
        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('message', data);
      }
    }

  }
}
