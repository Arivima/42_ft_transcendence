import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PlayersModule } from 'src/players/players.module';
import { FortyTwoStrategy } from './strategies/auth.strategy.passport.42'; // Import using forwardRef
import { JwtStrategy } from './strategies/auth.strategy.jwt';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';


dotenv.config();


@Module({
  imports: [
    PlayersModule,
    forwardRef(() => AuthModule), // Use forwardRef for circular dependencies
    JwtModule.register({
      secret : process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy],
  exports: [AuthService], // Export AuthService if needed
})
export class AuthModule {}