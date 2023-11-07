import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateGroupDto } from './dto/create-group.dto';
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

  @SubscribeMessage("getmessages")
  getMessages(@MessageBody("userId") userId: string, @MessageBody("chatId") chatId: string, @MessageBody("isGroup") isGroup: string) {
    console.log(`DEBUG | chat.controller | getMessagesPrivateChat | userId: ${userId}`);
    if (isGroup)
      return this.chatService.getMessagesGroupChat(Number(userId), Number(chatId));
    else
      return this.chatService.getMessagesPrivateChat(Number(userId), Number(chatId));
  }

  // @SubscribeMessage("getmessagesgroupchat")
  // getMessagesGroupChat(@MessageBody("userId") userId: string, @MessageBody("chatId") chatId: string) {
  //   console.log(`DEBUG | chat.controller | getMessagesGroupChat | userId: ${userId}`);
  //   return this.chatService.getMessagesGroupChat(Number(userId), Number(chatId));
  // }

  @SubscribeMessage("getparents")
  getParents(@MessageBody("userId") userId: string) {
    console.log(`DEBUG | chat.controller | getParents | userId: ${userId}`);
    return this.chatService.getParents(Number(userId));
  }

  @SubscribeMessage("creategroupchat")
  createGroupChat(@MessageBody("group") group: CreateGroupDto) {
    console.log(`DEBUG | chat.controller | createGroupChat | group: ${group}`);
    // newparent = {
    //   id: group
    // }
    // group.members.forEach((memberId) => {
    //   this.server.to(`${this.clients.get(Number(memberId)).id}`).emit('creategroupchat', group);
    // });
    this.chatService.createGroupChat(group).then((newparent) => {
      let id = newparent.groupID;
      let name = newparent.name;
      let lastMessage = null;
      let isGroup = true;
      
      group.members.forEach((memberId) => {
        let recClientId = this.clients.get(Number(memberId));
        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('newparent', {id, name, lastMessage, isGroup});
      });
      
    });
      // newparent = {
      //   id: newparent.groupID,
      //   name: newparent.name,
      //   lastMessage: null, // TODO: get last message
      //   isGroup: true
      // }
      // group.members.forEach((memberId) => {
      //   this.server.to(`${this.clients.get(Number(memberId)).id}`).emit('creategroupchat', newparent);
      // });
    
    // newparent = {
    //   id: newparent.groupID,
    //   name: newparent.name,
    //   lastMessage: null, // TODO: get last message
    //   isGroup: true
    // }
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(`DEBUG | chat.gateway | handleMessage | data: ${data}`);
    let CreateChatDto: CreateChatDto = JSON.parse(JSON.parse(data).data);
    let recClientId: Socket;

    let resIds = await this.chatService.create(CreateChatDto);
    if (!resIds)
      return 
    //  = await this.chatService.create(CreateChatDto);
    //  = this.chatService.create(CreateChatDto);
    console.log(`DEBUG | chat.gateway | handleMessage | resIds: ${resIds}`);
    for (let resId of resIds) {
      console.log(`DEBUG | chat.gateway | handleMessage | resId: ${resId.playerID}`);
      recClientId = this.clients.get(Number(resId.playerID));
      if (recClientId)
        this.server.to(`${recClientId.id}`).emit('message', data);
    }
    // resIds.then((resIds) => {
    //   console.log(`DEBUG | chat.gateway | handleMessage | resIds: ${resIds}`);
    //   // resIds.forEach((resId) => {
    //   //   console.log(`DEBUG | chat.gateway | handleMessage | resId: ${resId}`);
      
    //   // });
    // });

    // if (CreateChatDto.receiverID) {
    //   recClientId = this.clients.get(Number(CreateChatDto.receiverID));
    //   if (recClientId)
    //     this.server.to(`${recClientId.id}`).emit('message', data);
    // } else if (CreateChatDto.receiversID) {
    //   
    // }

  }
}
