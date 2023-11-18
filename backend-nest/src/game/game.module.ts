import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';


@Module({
	providers: [GameGateway, GameService, JwtService ],
})
export class GameModule {}
