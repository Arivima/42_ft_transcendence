import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { PlayersModule } from 'src/players/players.module';
// import { PlayersService } from 'src/players/players.service';


@Module({
	imports: [PlayersModule],
	// providers: [GameGateway, GameService, PlayersService, JwtService ],
	providers: [GameGateway, GameService, JwtService ],
})
export class GameModule {}
