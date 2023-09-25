import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { MessageModule } from './message/message.module';


@Module({
  
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    PlayersModule, AuthModule, MessageModule
  ],
  
  
  
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
