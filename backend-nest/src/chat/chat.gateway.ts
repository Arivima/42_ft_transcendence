import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtService } from '@nestjs/jwt';
import { async } from 'rxjs';
import { response } from 'express';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server
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
    this.clients.set(Number(user.sub), client);
  }

  handleDisconnect(client: any) {
    console.log('chat disconnected');
    this.clients.delete(client.id);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage("join")
  joinRoom() {
    console.log("join");
  }

  @SubscribeMessage("getmessages")
  getMessages(@MessageBody("userId") userId: string, @MessageBody("chatId") chatId: string, @MessageBody("isGroup") isGroup: string) {
    console.log(`DEBUG | chat.controller | getMessagesPrivateChat | userId: ${userId}`);
    if (isGroup)
      return this.chatService.getMessagesGroupChat(Number(userId), Number(chatId));
    else
      return this.chatService.getMessagesPrivateChat(Number(userId), Number(chatId));
  }

  @SubscribeMessage("getparents")
  getParents(@MessageBody("userId") userId: string) {
    console.log(`DEBUG | chat.controller | getParents | userId: ${userId}`);
    return this.chatService.getParents(Number(userId));
  }

  @SubscribeMessage("getfriendsnotingroup")
  getFriendsNotInGroup(@MessageBody("userId") userId: string, @MessageBody("groupId") groupId: string) {
    console.log(`DEBUG | chat.controller | getFriendsNotInGroup | userId: ${userId}`);
    return this.chatService.getFriendsNotInGroup(Number(userId), Number(groupId));
  }

  @SubscribeMessage("getgroupinfo")
  getGroupInfo(@MessageBody("groupId") groupId: string) {
    console.log(`DEBUG | chat.controller | getGroupInfo | groupId: ${groupId}`);
    return this.chatService.getGroupInfo(Number(groupId));
  }

  // @SubscribeMessage("addusertogroup")
  // addusertogroup(@MessageBody("group") group: CreateGroupDto) {
  //   console.log(`DEBUG | chat.controller | addusertogroup | group: ${group}`);
  //   return this.chatService.addusertogroup(group);
  // }
  // this.$props.socket.emit("editusersubscription", { 
  //   "userId": userInfo.id,
  //   "groupId": this.$props.groupId,
  //   "isAdmin": userInfo.isAdmin,
  //   "isMuted": userInfo.isMuted,
  //  }, (response) => {
  //   console.log("response", response);
  // });
  @SubscribeMessage("editusersubscription")
  editUserSubscription(@MessageBody("userId") userId: string, @MessageBody("groupId") groupId: string, @MessageBody("isAdmin") isAdmin: boolean, @MessageBody("isMuted") isMuted: boolean) {
    console.log(`DEBUG | chat.controller | editUserSubscription | userId: ${userId}`);
    this.chatService.editUserSubscription(Number(userId), Number(groupId), isAdmin, isMuted).then(response => {
      response.forEach((memberId) => {
        console.log(`DEBUG | chat.controller | editUserSubscription | memberId: ${memberId.playerID}`);
        let recClientId = this.clients.get(Number(memberId.playerID));

        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('editusersubscription', { userId, groupId, isAdmin, isMuted });
      }
      )
    });
    return { success: true };
  }

  @SubscribeMessage("addusertogroup")
  addUserToGroup(@MessageBody("groupId") groupId: string, @MessageBody("userIds") userIds: string[]) {
    console.log(`DEBUG | chat.controller | addUserToGroup | userId: ${userIds}`);
    let userIdsList = userIds.map((userId) => {
      return Number(userId);
    });

    this.chatService.addUsersToGroup(Number(groupId), userIdsList).then((otherMembers) => {
      if (!otherMembers)
        return { response: true };
      otherMembers.forEach((memberId) => {
        let recClientId = this.clients.get(Number(memberId.player.id));
        let newUsers = otherMembers.filter((otherMember) => {
          return userIdsList.includes(otherMember.player.id);
        });
        console.log(`DEBUG | chat.controller | addUserToGroup | memberId: ${recClientId}`);
        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('addusertogroup', { groupId, newUsers });
        return { response: true };
      }
      )
      return { response: true };
    });
    return { response: true };
  }

  @SubscribeMessage("removeuserfromgroup")
  removeUserFromGroup(@MessageBody("userId") userId: string, @MessageBody("groupId") groupId: string) {
    this.chatService.removeUserFromGroup(Number(userId), Number(groupId)).then((otherMembers) => {
      console.log(`DEBUG | chat.controller | removeUserFromGroup | otherMembers: ${otherMembers}`);
      if (!otherMembers)
        return { response: true };
      otherMembers.forEach((memberId) => {
        let recClientId = this.clients.get(Number(memberId.playerID));
        console.log(`DEBUG | chat.controller | removeUserFromGroup | memberId: ${recClientId}`);
        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('removeuserfromgroup', { userId, groupId });
        return { success: true };
      }
      )
      return { success: true };
    });
    return { success: true };

  }

  // @SubscribeMessage("editgroupname")
  // editGroupName(@MessageBody("groupId") groupId: string, @MessageBody("name") name: string) {
  //   console.log(`DEBUG | chat.controller | editGroupName | groupId: ${groupId}`);
  //   return this.chatService.editGroupName(Number(groupId), name);
  // }

  @SubscribeMessage("creategroupchat")
  createGroupChat(@MessageBody("group") group: CreateGroupDto) {
    console.log(`DEBUG | chat.controller | createGroupChat | group: ${group}`);
    this.chatService.createGroupChat(group).then((newparent) => {
      let id = newparent.groupID;
      let name = newparent.name;
      let lastMessage = null;
      let isGroup = true;

      group.members.forEach((memberId) => {
        let recClientId = this.clients.get(Number(memberId));
        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('newparent', { id, name, lastMessage, isGroup });
      });
    });
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(`DEBUG | chat.gateway | handleMessage | data: ${data}`);
    let CreateChatDto: CreateChatDto = JSON.parse(JSON.parse(data).data);
    let recClientId: Socket;

    let resIds = await this.chatService.create(CreateChatDto);
    if (!resIds)
      return
    for (let resId of resIds) {
      console.log(`DEBUG | chat.gateway | handleMessage | resId: ${resId}`);
      recClientId = this.clients.get(Number(resId.playerID));
      if (recClientId)
        this.server.to(`${recClientId.id}`).emit('message', data);
    }
  }
}
