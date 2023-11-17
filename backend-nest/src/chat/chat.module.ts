import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtService } from '@nestjs/jwt';
// import { PlayersModule } from 'src/players/players.module';

@Module({
  providers: [ChatGateway, ChatService, JwtService],
  // imports: [PlayersModule],

})
export class ChatModule {}
