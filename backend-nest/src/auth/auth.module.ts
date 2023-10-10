import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PlayersModule } from 'src/players/players.module';
import { FortyTwoStrategy } from './strategies/auth.strategy.passport.42'; // Import using forwardRef
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { TwoFaService } from './auth.2fa.service';

dotenv.config();

@Module({
	imports: [
		PlayersModule,
		forwardRef(() => AuthModule), // Use forwardRef for circular dependencies
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '2h' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, TwoFaService, FortyTwoStrategy],
	exports: [AuthService], // Export AuthService if needed
})
export class AuthModule {}
