import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  create(createChatDto: CreateChatDto) {
    console.log(`DEBUG | chat.service | create | senderID: ${Number(createChatDto.senderID)}, receiverID: ${Number(createChatDto.receiverID)}`);
    createChatDto.senderID = Number(createChatDto.senderID);
    createChatDto.receiverID = Number(createChatDto.receiverID);
    console.log(`DEBUG | chat.service | create | createChatDto: ${createChatDto.createdAt}`);
    let res = this.prisma.message.create({
      data: {
        content: createChatDto.content,
        timestamp: createChatDto.createdAt,
        sender: {
            connect: {
                id: createChatDto.senderID
            }
        },
        receiver: {
            connect: {
                id: createChatDto.receiverID
            }
        }
      },
    });
    res.then((res) => {
      console.log(`DEBUG | chat.service | create | res: ${res}`);
      return res;

    });
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
    }));
  
    const roomsWithLastMessage = user.founded_channels.map((room) => ({
      id: room.groupID,
      name: room.name,
      lastMessage: room.messages.length > 0 ? room.messages[0].timestamp : null,
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
  
    return sortedData;
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
