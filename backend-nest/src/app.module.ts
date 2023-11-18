import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/auth.guard.jwt';
import { ChatModule } from './chat/chat.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FrienshipsModule } from './frienships/frienships.module';
import { GameModule } from './game/game.module';


@Module({
	imports: [
		PlayersModule, FrienshipsModule, AuthModule, PrismaModule,
		FrienshipsModule, ChatModule, GameModule
		// JwtModule.register({
		// 	secret: process.env.JWT_SECRET,
		// 	signOptions: { expiresIn: '2h' },
		// })
	],
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
