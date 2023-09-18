import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';


@Module({
  
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    PlayersModule
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
