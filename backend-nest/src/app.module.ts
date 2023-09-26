import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [PlayersModule, AuthModule, PrismaModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
