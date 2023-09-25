import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
  controllers: [MessageController],
  providers: [MessageService, ChatGateway],
})
export class MessageModule {}
