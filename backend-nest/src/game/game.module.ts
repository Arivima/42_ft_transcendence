import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { PlayersService } from 'src/players/players.service';


@Module({
	providers: [GameGateway, GameService, PlayersService, JwtService ],
})
export class GameModule {}
