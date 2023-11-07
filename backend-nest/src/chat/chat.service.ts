import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { ChatRoomVisibility  } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

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
  
      result.subscriptions.forEach((subscription) => {
        console.log(`DEBUG | chat.service | createChatRoomMessage | subscription: ${subscription.playerID}`);
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

  // async createChatRoomMessage(createChatDto: CreateChatDto) {
  //   createChatDto.receiverID = null;
  //   createChatDto.receiversID = Number(createChatDto.receiversID);
    
  //   let res = this.prisma.message.create({
  //     data: {
  //       content: createChatDto.content,
  //       timestamp: createChatDto.createdAt,
  //       sender: {
  //           connect: {
  //               id: createChatDto.senderID
  //           }
  //       },
  //       receivers: {
  //           connect: {
  //               groupID: createChatDto.receiversID
  //           }
  //       }
  //     },
  //   });
  //   res.then((res) => {
  //     console.log(`DEBUG | chat.service | createChatRoomMessage | res: ${res}`);

  //     // update group last message
  //     this.prisma.chatRoom.update({
  //       where: {
  //         groupID: createChatDto.receiversID
  //       },
  //       data: {
  //         messages: {
  //           connect: {
  //             messageID: res.messageID
  //           }
  //         }
  //       }
  //     });
  //     return this.prisma.chatRoom.findUnique({
  //       where: {
  //         groupID: createChatDto.receiversID
  //       },
  //       select: {
  //         subscriptions: {
  //           select: {
  //             playerID: true
  //           },
  //           where: {
  //             isBanned: false
  //           }
  //         }
  //       }
  //     });
  //   }).then((res) => { // res is subscriptions  arrays
  //     console.log(`DEBUG | chat.service | createChatRoomMessage | res: ${res.subscriptions}`);
  //     res.subscriptions.forEach((subscription) => {
  //       console.log(`DEBUG | chat.service | createChatRoomMessage | subscription: ${subscription.playerID}`);
  //     });

  //     return res;
  //   });
  // }

  // async createChatMessage(createChatDto: CreateChatDto) {
  //   createChatDto.receiverID = Number(createChatDto.receiverID);
  //   createChatDto.receiversID = null;
    
  //   let res = this.prisma.message.create({
  //     data: {
  //       content: createChatDto.content,
  //       timestamp: createChatDto.createdAt,
  //       sender: {
  //           connect: {
  //               id: createChatDto.senderID
  //           }
  //       },
  //       receiver: {
  //           connect: {
  //               id: createChatDto.receiverID
  //           }
  //       }
  //     },
  //   });
  //   res.then((res) => {
  //     console.log(`DEBUG | chat.service | createChatMessage | res: ${res}`);
  //     return createChatDto.receiverID;
  //   });
  // }


  // async create(createChatDto: CreateChatDto): Promise<any> {
  //   console.log(`DEBUG | chat.service | create | senderID: ${Number(createChatDto.senderID)}, receiverID: ${Number(createChatDto.receiverID)}`);
  //   createChatDto.senderID = Number(createChatDto.senderID);
  //   console.log(`DEBUG | chat.service | create | senderID: ${createChatDto.receiverID}, receiverID: ${createChatDto.receiversID}`);
  //   if (createChatDto.receiversID)
  //     return await this.createChatRoomMessage(createChatDto).then((res) => { 
  //       console.log(`DEBUG | chat.service | create | res: ${res}`);
  //         return res; });
  //   else if (createChatDto.receiverID)
  //     return await this.createChatMessage(createChatDto).then((res) => { return [res]; });
  //     // return [await this.createChatMessage(createChatDto)];
  //   else
  //     return null;
    
  //   createChatDto.receiverID = Number(createChatDto.receiverID);
  //   console.log(`DEBUG | chat.service | create | createChatDto: ${createChatDto.createdAt}`);
  //   let res = this.prisma.message.create({
  //     data: {
  //       content: createChatDto.content,
  //       timestamp: createChatDto.createdAt,
  //       sender: {
  //           connect: {
  //               id: createChatDto.senderID
  //           }
  //       },
  //       receiver: {
  //           connect: {
  //               id: createChatDto.receiverID
  //           }
  //       }
  //     },
  //   });
  //   res.then((res) => {
  //     console.log(`DEBUG | chat.service | create | res: ${res}`);
  //     return res;

  //   });
  // }

  async createGroupChat(group: CreateGroupDto) {
    console.log(`DEBUG | chat.service | createGroupChat | group: ${group.name}`);
    const { name, members, founderId, isPublic, password } = group;
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
    }});
    
    // console.log(`DEBUG | chat.service | createGroupChat | me: ${me}, groupName: ${groupName}, receiversID: ${receiversID}`);
    // return this.prisma.chatRoom.create({
    //   data: {
    //     name: groupName,
    //     founder: {
    //       connect: {
    //         id: me,
    //       },
    //     },
    //     members: {
    //       connect: receiversID.map((receiverID) => ({
    //         id: receiverID,
    //       })),
    //     },
    //   },
    // });
    
    return chatGroup;

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
          select: { recipient: true },
        },
        founded_channels: {
          include: {
            messages: {
              take: 1,
              orderBy: { timestamp: 'desc' },
            },
          },
        },
      },
    });
  
    const friends = user.sentFriendshipRequests.map((friendship) => ({
      id: friendship.recipient.id,
      name: friendship.recipient.username,
      lastMessage: null,
      isGroup: false,
    }));
  
    const roomsWithLastMessage = user.founded_channels.map((room) => ({
      id: room.groupID,
      name: room.name,
      lastMessage: room.messages.length > 0 ? room.messages[0].timestamp : null,
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
  
    // let res = {
    //   friends: sortedData.filter((data) => 'name' in data),
    //   rooms: sortedData.filter((data) => 'name' in data),
    // };
    // }
    // return an object with 3 arrays: friends and rooms and sortedData
    return { friends: friends, rooms: roomsWithLastMessage, sortedData: sortedData };
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

    return await res.map((message) => ({
      ...message,
    }));
  }

  
// model ChatRoom {
// 	createdAt			DateTime				@default(now())
// 	updatedAt			DateTime				@updatedAt

// 	groupID				Int						@id @default(autoincrement())
// 	name				String

// 	visibility			ChatRoomVisibility
// 	password			String


// 	messages			Message[]				@relation("RecipientS")
// 	founder				Player					@relation("Founded", fields: [founderID], references: [id])
// 	founderID			Int
// 	subscriptions		Subscribed[]			@relation("hasParticipant")
// }

  async getMessagesGroupChat(me: number, group: number) {
    console.log(`DEBUG | chat.service | getMessagesGroupChat | me: ${me} | group: ${group}`);
    // let res = await this.prisma.chatRoom.findUnique({
    //   where: {
    //     groupID: group,
    //   },
    //   include: {
    //     messages: {
    //       orderBy: { timestamp: 'asc' },
    //     }
    //   },
    // });
    // select messagess and relative sender name for a group id and order by timestamp
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
      },
    });
    let r = res.messages.map((message) => ({
      ...message,
      sender: message.sender.username,
    }));
    console.log(`DEBUG | chat.service | getMessagesGroupChat | res: ${res}`); // [object PrismaPromise]
    return r
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
