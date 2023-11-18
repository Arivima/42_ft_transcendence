import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtService } from '@nestjs/jwt';
import { async } from 'rxjs';
import { response } from 'express';

const debug = false;

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
    if (debug) console.log('chat connected');
    const user = await this.jwtService.verifyAsync(client.handshake.auth.token, {
      secret: process.env.JWT_SECRET
    });
    this.clients.set(Number(user.sub), client);
  }

  handleDisconnect(client: any) {
    if (debug) console.log('chat disconnected');
    this.clients.delete(client.id);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage("join")
  joinRoom() {
    if (debug) console.log("join");
  }

  @SubscribeMessage("getmessages")
  getMessages(@MessageBody("userId") userId: string, @MessageBody("chatId") chatId: string, @MessageBody("isGroup") isGroup: string) {
    if (debug) console.log(`DEBUG | chat.controller | getMessagesPrivateChat | userId: ${userId}`);
    if (isGroup)
      return this.chatService.getMessagesGroupChat(Number(userId), Number(chatId));
    else
      return this.chatService.getMessagesPrivateChat(Number(userId), Number(chatId));
  }

  @SubscribeMessage("getparents")
  getParents(@MessageBody("userId") userId: string) {
    if (debug) console.log(`DEBUG | chat.controller | getParents | userId: ${userId}`);
    return this.chatService.getParents(Number(userId));
  }

  @SubscribeMessage("getfriendsnotingroup")
  getFriendsNotInGroup(@MessageBody("userId") userId: string, @MessageBody("groupId") groupId: string) {
    if (debug) console.log(`DEBUG | chat.controller | getFriendsNotInGroup | userId: ${userId}`);
    return this.chatService.getFriendsNotInGroup(Number(userId), Number(groupId));
  }

  @SubscribeMessage("getgroupinfo")
  getGroupInfo(@MessageBody("groupId") groupId: string) {
    if (debug) console.log(`DEBUG | chat.controller | getGroupInfo | groupId: ${groupId}`);
    return this.chatService.getGroupInfo(Number(groupId));
  }

  // @SubscribeMessage("addusertogroup")
  // addusertogroup(@MessageBody("group") group: CreateGroupDto) {
  //   if (debug) console.log(`DEBUG | chat.controller | addusertogroup | group: ${group}`);
  //   return this.chatService.addusertogroup(group);
  // }
  // this.$props.socket.emit("editusersubscription", { 
  //   "userId": userInfo.id,
  //   "groupId": this.$props.groupId,
  //   "isAdmin": userInfo.isAdmin,
  //   "isMuted": userInfo.isMuted,
  //  }, (response) => {
  //   if (debug) console.log("response", response);
  // });
  @SubscribeMessage("editusersubscription")
  editUserSubscription(@MessageBody("userId") userId: string, @MessageBody("groupId") groupId: string, @MessageBody("isAdmin") isAdmin: boolean, @MessageBody("isMuted") isMuted: boolean, @ConnectedSocket() client: Socket) {
    if (debug) console.log(`DEBUG | chat.controller | editUserSubscription | userId: ${userId}`);
    // check if user is admin
    let adminId = this.jwtService.decode(client.handshake.auth.token)['sub'];
    if (debug) console.log(`DEBUG | chat.controller | editUserSubscription | adminId: ${adminId}`);
    this.chatService.editUserSubscription(Number(userId), Number(groupId), isAdmin, isMuted, Number(adminId)).then(response => {
      if (!response)
        return { success: false };
      response.forEach((memberId) => {
        if (debug) console.log(`DEBUG | chat.controller | editUserSubscription | memberId: ${memberId.playerID}`);
        let recClientId = this.clients.get(Number(memberId.playerID));

        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('editusersubscription', { userId, groupId, isAdmin, isMuted });
      }
      )
    });
    return { success: true };
  }

  @SubscribeMessage("addusertogroup")
  addUserToGroup(@MessageBody("groupId") groupId: string, @MessageBody("userIds") userIds: string[], @ConnectedSocket() client: Socket) {
    if (debug) console.log(`DEBUG | chat.controller | addUserToGroup | userId: ${userIds}`);
    let userIdsList = userIds.map((userId) => {
      return Number(userId);
    });
    let isAdminId = this.jwtService.decode(client.handshake.auth.token)['sub'];

    this.chatService.addUsersToGroup(Number(groupId), userIdsList, Number(isAdminId)).then((res) => {
      let otherMembers = res.subscriptions;
      if (!otherMembers)
        return { response: true };
      otherMembers.forEach((memberId) => {
        let recClientId = this.clients.get(Number(memberId.player.id));
        let newUsers = otherMembers.filter((otherMember) => {
          return userIdsList.includes(otherMember.player.id);
        });
        if (debug) console.log(`DEBUG | chat.controller | addUserToGroup | memberId: ${recClientId}`);
        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('addusertogroup', { groupId, newUsers });
        
        return { response: true };
      });
      for (let userId of userIdsList) {
        let recClientId = this.clients.get(Number(userId));
        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('newparent', { id: groupId, name: res.name, lastMessage: res.messages[0].createdAt, isGroup: true });
      }
      return { response: true };
    });
    return { response: true };
  }

  @SubscribeMessage("removemefromgroup")
  removeMeFromGroup(@MessageBody("groupId") groupId: string, @ConnectedSocket() client: Socket) {
    let me = this.jwtService.decode(client.handshake.auth.token)['sub'];
    if (!me)
      return { success: false };
    this.chatService.removeUserFromGroup(Number(me), Number(groupId), Number(me)).then((otherMembers) => {
      if (debug) console.log(`DEBUG | chat.controller | removeMeFromGroup | otherMembers: ${otherMembers}`);
      if (!otherMembers)
        return { success: false };
      otherMembers.forEach((memberId) => {
        let recClientId = this.clients.get(Number(memberId.playerID));
        if (debug) console.log(`DEBUG | chat.controller | removeMeFromGroup | memberId: ${recClientId}`);
        if (recClientId)
          this.server.to(`${recClientId.id}`).emit('removemefromgroup', { groupId });
        return { success: true };
      }
      )
      return { success: true };
    });
    return { success: true };
  }
  

  @SubscribeMessage("removeuserfromgroup")
  removeUserFromGroup(@MessageBody("userId") userId: string, @MessageBody("groupId") groupId: string, @ConnectedSocket() client: Socket) {
    let adminId = this.jwtService.decode(client.handshake.auth.token)['sub'];
    this.chatService.removeUserFromGroup(Number(userId), Number(groupId), Number(adminId)).then((otherMembers) => {
      if (debug) console.log(`DEBUG | chat.controller | removeUserFromGroup | otherMembers: ${otherMembers}`);
      if (otherMembers[0] === "not admin")
        return { success: false };
      if (otherMembers[0] === "delete group")
        return { success: true };
      otherMembers.forEach((memberId) => {
        let recClientId = this.clients.get(Number(memberId.playerID));
        if (debug) console.log(`DEBUG | chat.controller | removeUserFromGroup | memberId: ${recClientId}`);
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
  //   if (debug) console.log(`DEBUG | chat.controller | editGroupName | groupId: ${groupId}`);
  //   return this.chatService.editGroupName(Number(groupId), name);
  // }

  @SubscribeMessage("creategroupchat")
  createGroupChat(@MessageBody("group") group: CreateGroupDto) {
    if (debug) console.log(`DEBUG | chat.controller | createGroupChat | group: ${group}`);
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
    if (debug) console.log(`DEBUG | chat.gateway | handleMessage | data: ${data}`);
    let CreateChatDto: CreateChatDto = JSON.parse(JSON.parse(data).data);
    let recClientId: Socket;

    let senderID = this.jwtService.decode(client.handshake.auth.token)['sub']

    let resIds = await this.chatService.create(CreateChatDto, Number(senderID));
    if (!resIds)
      return
    for (let resId of resIds) {
      recClientId = this.clients.get(Number(resId.playerID));
      data = JSON.stringify({ data: JSON.stringify({ ...CreateChatDto, "senderName": resId.senderName}) });
      if (recClientId)
        this.server.to(`${recClientId.id}`).emit('message', data);
    }
  }

  // searchGroups() {
	// 	try {
	// 		this.socket.emit("searchgroups", { groupSearch: this.groupSearch }, (response) => {
	// 			if (debug) console.log("response", response);
	// 			this.groups = response.groups;
	// 		});
	// 	} catch (error) {
	// 		console.error("Error emitting 'searchgroups':", error);
	// 	}
	//   },

  @SubscribeMessage("searchgroups")
  searchGroups(@MessageBody("groupSearch") groupSearch: string, @ConnectedSocket() client: Socket) {
    if (debug) console.log(`DEBUG | chat.controller | searchGroups | groupSearch: ${groupSearch}`);
    let userId = this.jwtService.decode(client.handshake.auth.token)['sub'];
    return this.chatService.searchGroups(groupSearch, Number(userId));
  }

  @SubscribeMessage("joingroup")
  async joinGroup(@MessageBody("groupId") groupId: string, @MessageBody("password") password: string, @ConnectedSocket() client: Socket) {
    console.log(`DEBUG | chat.controller | joinGroup | groupId: ${groupId}`);
    let userId = this.jwtService.decode(client.handshake.auth.token)['sub'];
    let res = await this.chatService.joinGroup(Number(groupId), Number(userId), password);
    if (!res)
      return { error: "wrong password" };
    let recClientId = this.clients.get(Number(userId));
    console.log(`DEBUG | chat.controller | joinGroup | memberId: ${recClientId}`);
    if (recClientId)
      this.server.to(`${recClientId.id}`).emit('newparent', { id: groupId, name: res.name, lastMessage: res.messages[0]?.createdAt, isGroup: true });
  }
}
