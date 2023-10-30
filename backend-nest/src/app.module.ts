import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/auth.guard.jwt';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';

@Module({
	imports: [PlayersModule, AuthModule, PrismaModule, ChatModule],
	// controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		JwtService,
	],
})
export class AppModule {}
