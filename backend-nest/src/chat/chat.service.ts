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
    // let res = this.prisma.message.create({
    //   data: {
    //     content: createChatDto.content,
    //     timestamp: createChatDto.created_at,
    //     sender: {
    //         connect: {
    //             id: createChatDto.senderID
    //         }
    //     },
    //     receiver: {
    //         connect: {
    //             id: createChatDto.receiverID
    //         }
    //     },
    //     receivers: {
    //         connect: {
    //           groupID: 0
    //         }
    //     },
    
    //   },
    // });
    // res.then((res) => {
    //   console.log(`DEBUG | chat.service | create | res: ${res}`);
    //   return res;

    // });
    // console.log(`DEBUG | chat.service | create | res: ${res}`);
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
