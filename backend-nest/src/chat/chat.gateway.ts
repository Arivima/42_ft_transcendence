import { WebSocketGateway, SubscribeMessage, MessageBody,ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server
  constructor(private readonly chatService: ChatService) {}
  

  handleConnection(client: any, ...args: any[]) {
    console.log('connected');
    // client.emit('message', 'Hello world!');
  }

  handleDisconnect(client: any) {
    console.log('disconnected');
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

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    
    console.log(`DEBUG | chat.gateway | handleMessage | data: ${data}`);
    let CreateChatDto : CreateChatDto = JSON.parse(JSON.parse(data).data);
    this.chatService.create(CreateChatDto);

    this.server.emit('message', data); // Broadcast the message to all connected clients
    // client.broadcast.emit('message', data); // Broadcast the message to all connected clients exept the one that sent it
  }
}
