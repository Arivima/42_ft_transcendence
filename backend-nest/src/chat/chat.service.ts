import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { use } from 'passport';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) { }

  async createChatRoomMessage(createChatDto: CreateChatDto) {
    createChatDto.receiverID = null;
    createChatDto.receiversID = Number(createChatDto.receiversID);

    try {
      const res = await this.prisma.message.create({
        data: {
          content: createChatDto.content,
          timestamp: createChatDto.createdAt,
          sender: {
            connect: {
              id: createChatDto.senderID,
            },
          },
          receivers: {
            connect: {
              groupID: createChatDto.receiversID,
            },
          },
        },
      });

      console.log(`DEBUG | chat.service | createChatRoomMessage | res: ${res.messageID}`);

      // update group last message
      await this.prisma.chatRoom.update({
        where: {
          groupID: createChatDto.receiversID,
        },
        data: {
          messages: {
            connect: {
              messageID: res.messageID,
            },
          },
        },
      });

      const result = await this.prisma.chatRoom.findUnique({
        where: {
          groupID: createChatDto.receiversID,
        },
        select: {
          subscriptions: {
            select: {
              playerID: true,
            },
            where: {
              isBanned: false,
              playerID: {
                not: createChatDto.senderID,
              },
            },
          },
        },
      });
      return result.subscriptions;
    } catch (error) {
      // Handle errors here
      console.error(error);
      throw error; // Rethrow the error or handle it as needed
    }
  }

  async createChatMessage(createChatDto: CreateChatDto) {
    createChatDto.receiverID = Number(createChatDto.receiverID);
    createChatDto.receiversID = null;

    try {
      const res = await this.prisma.message.create({
        data: {
          content: createChatDto.content,
          timestamp: createChatDto.createdAt,
          sender: {
            connect: {
              id: createChatDto.senderID,
            },
          },
          receiver: {
            connect: {
              id: createChatDto.receiverID,
            },
          },
        },
      });

      console.log(`DEBUG | chat.service | createChatMessage | res: ${res}`);

      return createChatDto.receiverID;
    } catch (error) {
      // Handle errors here
      console.error(error);
      throw error; // Rethrow the error or handle it as needed
    }
  }

  async create(createChatDto: CreateChatDto): Promise<any> {
    console.log(`DEBUG | chat.service | create | senderID: ${Number(createChatDto.senderID)}, receiverID: ${Number(createChatDto.receiverID)}`);
    createChatDto.senderID = Number(createChatDto.senderID);
    console.log(`DEBUG | chat.service | create | senderID: ${createChatDto.receiverID}, receiversID: ${createChatDto.receiversID}`);

    if (createChatDto.receiversID) {
      return this.createChatRoomMessage(createChatDto);
    } else if (createChatDto.receiverID) {
      return [this.createChatMessage(createChatDto)];
    } else {
      return null;
    }
  }

  async createGroupChat(group: CreateGroupDto) {
    console.log(`DEBUG | chat.service | createGroupChat | group: ${group.name}`);
    const { name, members, founderId, isPublic, password } = group;
    const chatGroup = await this.prisma.chatRoom.create({
      data: {
        name,
        founder: { connect: { id: founderId } },
        visibility: isPublic ? "public" : "private",
        password,
        subscriptions: {
          create: members.map((memberId) => ({
            isAdmin: memberId === founderId,
            isMuted: false,
            isBanned: false,

            player: { connect: { id: Number(memberId) } },

          }),
          ),
        },
      }
    });

    return chatGroup;
  }

  async addUsersToGroup(groupId: number, userIds: number[]) {
    console.log(`DEBUG | chat.service | addUsersToGroup | groupId: ${groupId} | userIds: ${userIds}`);
    try {
      const res = await this.prisma.chatRoom.update({
        where: {
          groupID: groupId,
        },
        data: {
          subscriptions: {
            create: userIds.map((userId) => ({
              isAdmin: false,
              isMuted: false,
              isBanned: false,

              player: { connect: { id: userId } },

            }),
            ),
          },
        },
      });
      return await this.prisma.subscribed.findMany({
        where: {
          chatroomID: groupId,
        },
        select: {
          player: true,
          
          isAdmin: true,
          isMuted: true,
          isBanned: true,

        },

      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 
// model Subscribed {
// 	isAdmin					Boolean
// 	isMuted					Boolean
// 	isBanned				Boolean

// 	player					Player @relation("Subscribed", fields: [playerID], references: [id])
// 	playerID				Int
// 	chatroom				ChatRoom @relation("hasParticipant", fields: [chatroomID], references: [groupID])
// 	chatroomID				Int

// 	@@id([playerID, chatroomID])
// }

  async editUserSubscription(userId: number, groupId: number, isAdmin: boolean, isMuted: boolean) {
    console.log(`DEBUG | chat.service | editUserSubscription | userId: ${userId} | groupId: ${groupId} | isAdmin: ${isAdmin} | isMuted: ${isMuted}`);
    if (isAdmin === false) {
      let res = await this.prisma.subscribed.findMany({
        where: {
          chatroomID: groupId,
          isAdmin: true,
          playerID: {
            not: userId,
          },
        },
        select: {
          playerID: true,
        },
      });
      if (res.length === 0) {
        console.log(`DEBUG | chat.service | editUserSubscription | res.length: ${res.length}`);
        return null;
      }
    }
    
    let res = await this.prisma.subscribed.update({
      where: {
        playerID_chatroomID: {
          playerID: userId,
          chatroomID: groupId,
        },
      },
      data: {
        isAdmin: isAdmin,
        isMuted: isMuted
      },
    });
    return await this.prisma.subscribed.findMany({
      where: {
        chatroomID: groupId,
      },
      select: {
        playerID: true,
      },
    });
  }

  async removeUserFromGroup(userId: number, groupId: number) {
    console.log(`DEBUG | chat.service | removeUserFromGroup | userId: ${userId} | groupId: ${groupId}`);
    try {
      let res = await this.prisma.subscribed.delete({
        where: {
          playerID_chatroomID: {
            playerID: userId,
            chatroomID: groupId,
          },
        },
      });
      let res2 = await this.prisma.subscribed.findMany({
        where: {
          chatroomID: groupId,
        },
        select: {
          playerID: true,
        },
      });
      console.log(`DEBUG | chat.service | removeUserFromGroup | res2.length: ${res2.length}`);
      if (res2.length === 0) {
        await this.prisma.chatRoom.delete({
          where: {
            groupID: groupId,
          },
        });
        return null;
      }
      // console.log(`DEBUG | chat.service | removeUserFromGroup | res2: ${res2}`);
      // let user = await this.prisma.player.update({
      //   where: {
      //     id: userId,
      //   },
      //   data: {
      //     founded_channels: {
      //       delete: {
      //         groupID: groupId,
      //       },
      //     },
      //   },
      // });
      // console.log(`DEBUG | chat.service | removeUserFromGroup | user: ${user.founded_channels}`);
      return res2;
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return this.prisma.message.findMany();
  }

  findChatandMessageByUserId(userId: number) {
    console.log(`DEBUG | chat.service | findChatandMessageByUserId | userId: ${userId}`);
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderID: userId,
          },
          {
            receiverID: userId,
          },
        ],
      },
    });
  }

  async getParents(userId: number) {
    const user = await this.prisma.player.findUnique({
      where: { id: userId },
      include: {
        sentFriendshipRequests: {
          where: { are_friends: true },
          select: {
            recipient: {
              select: {
                id: true,
                username: true,
                avatar: true,
                // sent_messages: {
                //   // select: {
                //   where: {
                //     OR: [
                //       {
                //         senderID: userId,
                //       },
                //       {
                //         receiverID: userId,
                //       },
                //     ],
                //   },
                //   take: 1,
                //   orderBy: { timestamp: 'desc' },
                //   // },
                // },
              },
            },
            requestor: {
              select: {
                id: true,
                username: true,
                //   sent_messages: {
                //     // select: {
                //     where: {
                //           receiverID: userId,
                //     },
                //     take: 1,
                //     orderBy: { timestamp: 'desc' },
                //     // },
                //   },
                //   received_messages_dm: {
                //     // select: {
                //     where: {
                //           senderID: userId,
                //     },
                //     take: 1,
                //     orderBy: { timestamp: 'desc' },
                //     // },
                //   },
              },

            },

          },
        },
        chatroomSubscriptions: {
          include: {
            chatroom: {
              select: {
                groupID: true,
                name: true,
                founder: {
                  select: {
                    username: true,
                  },
                
                },
                messages: {
                  take: 1,
                  orderBy: { timestamp: 'desc' },
                },

                },
              },
              // include: {
              //   messages: {
              //     take: 1,
              //     orderBy: { timestamp: 'desc' },
              //   },
              // },

            },
          },

          },
    });
    
    let listoffriends = [];
    for (const friendship of user.sentFriendshipRequests) {
      if (friendship.requestor.id === userId)
        listoffriends.push(friendship.recipient);
      else
        listoffriends.push(friendship.requestor);
      listoffriends[listoffriends.length - 1].lastMessage = await this.prisma.message.findMany({
        where: {
          OR: [
            {
              senderID: userId,
              receiverID: listoffriends[listoffriends.length - 1].id,
            },
            {
              senderID: listoffriends[listoffriends.length - 1].id,
              receiverID: userId,
            },
          ],
        },
        take: 1,
        orderBy: { timestamp: 'desc' },
      });
    }
    const friends = listoffriends.map((friendship) => ({
      id: friendship.id,
      name: friendship.username,
      lastMessage: friendship.lastMessage.length > 0 ? friendship.lastMessage[0].timestamp : null,
      isGroup: false,
    }));
    // for (const room of user.chatroomSubscriptions) {
    //   console.log(`DEBUG | chat.service | getParents | room: ${room.name}, room.messages.length: ${room.messages.length}`);
    // }
    const roomsWithLastMessage = user.chatroomSubscriptions.map((room) => ({
      
      id: room.chatroom.groupID,
      name: room.chatroom.name,
      lastMessage: room.chatroom.messages.length > 0 ? room.chatroom.messages[0].timestamp : null,
      isGroup: true,
    }));

    const sortedData = [...friends, ...roomsWithLastMessage].sort((a, b) => {
      if (!('lastMessage' in a) && !('lastMessage' in b)) {
        return 0;
      } else if (!('lastMessage' in a)) {
        return 1;
      } else if (!('lastMessage' in b)) {
        return -1;
      } else {
        return ((b.lastMessage as Date) || new Date(0)).getTime() - ((a.lastMessage as Date) || new Date(0)).getTime();
      }
    });
    return { friends: friends, rooms: roomsWithLastMessage, sortedData: sortedData };
  }

  async getGroupInfo(groupId: number) {
    console.log(`DEBUG | chat.service | getGroupInfo | groupId: ${groupId}`);
    const group = await this.prisma.chatRoom.findUnique({
      where: { groupID: groupId },
      include: {
        founder: true,
        subscriptions: {
          include: {
            player: true,
          },
        },
      },
    });
    return {
      id: group.groupID,
      name: group.name,
      founder: group.founder.username,
      members: group.subscriptions.map((subscription) => ({
        id: subscription.player.id,
        name: subscription.player.username,
        isAdmin: subscription.isAdmin,
        isMuted: subscription.isMuted,
        isBanned: subscription.isBanned,
      })),
    };
  }

  async getFriendsNotInGroup(userId: number, groupId: number) {
    console.log(`DEBUG | chat.service | getFriendsNotInGroup | userId: ${userId} | groupId: ${groupId}`);
    const group = await this.prisma.chatRoom.findUnique({
      where: { groupID: groupId },
      include: {
        subscriptions: {
          select: {
            playerID: true,
          },
        },
      },
    });
    // console.log(`DEBUG | chat.service | getFriendsNotInGroup | group.subscriptions: ${group.subscriptions}, group.subscriptions.length: ${group.subscriptions.length}`);
    const friends = await this.prisma.player.findMany({
      where: { id: userId },
      include: {
        sentFriendshipRequests: {
          where: { are_friends: true },
          select: {
            recipient: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            requestor: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
    let newFriends = [];
    for (const friendship of friends[0].sentFriendshipRequests) {
      if (friendship.requestor.id === userId)
        newFriends.push(friendship.recipient);
      else
        newFriends.push(friendship.requestor);
      
    }
    const friendsNotInGroup = newFriends.filter((friend) => {
      return !group.subscriptions.some((subscription) => {
        return subscription.playerID === friend.id;
      });
    });
    // console.log(`DEBUG | chat.service | getFriendsNotInGroup | friendsNotInGroup: ${friendsNotInGroup[0].username}`); // [object PrismaPromise
    return { friends: friendsNotInGroup };
  }

  async getMessagesPrivateChat(me: number, friend: number) {
    console.log(`DEBUG | chat.service | getMessagesPrivateChat | me: ${me} | friend: ${friend}`);
    let res = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderID: me,
            receiverID: friend,
          },
          {
            senderID: friend,
            receiverID: me,
          },
        ],
      },
    });
    console.log(`DEBUG | chat.service | getMessagesPrivateChat | res: ${res}`); // [object PrismaPromise]

    let res1 = await res.map((message) => ({
      ...message,
    }));
    return { messages: res1, subscriptions: null };
  }

  async getMessagesGroupChat(me: number, group: number) {
    console.log(`DEBUG | chat.service | getMessagesGroupChat | me: ${me} | group: ${group}`);

    let res = await this.prisma.chatRoom.findUnique({
      where: {
        groupID: group,
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                username: true,
              },
            },
          },
          orderBy: { timestamp: 'asc' },
        },
        subscriptions: {
          select: {
            playerID: true,
            isAdmin: true,
            isMuted: true,
            isBanned: true,

          }

        },

      },
    });
    let ret1 = res.messages.map((message) => ({
      ...message,
      sender: message.sender.username,
    }));
    let ret2 = res.subscriptions.map((subscription) => ({
      ...subscription,
      playerID: subscription.playerID,
      isAdmin: subscription.isAdmin,
      isMuted: subscription.isMuted,
      isBanned: subscription.isBanned,

    }));
    return { messages: ret1, subscriptions: ret2 };
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
