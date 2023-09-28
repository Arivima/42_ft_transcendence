import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './passport.strategy'; // Import using forwardRef

@Module({
  imports: [
    forwardRef(() => AuthModule), // Use forwardRef for circular dependencies
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy],
  exports: [AuthService], // Export AuthService if needed
})
export class AuthModule {}