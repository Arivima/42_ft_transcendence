import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './passport.strategy'; // Import using forwardRef
// import { Player } from '@prisma/client';

@Module({
  imports: [
    forwardRef(() => AuthModule), // Use forwardRef for circular dependencies
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy],
  exports: [AuthService], // Export AuthService if needed
})
export class AuthModule {
  //! useless example to see if it compiles
  // user : Player = {
  //   createdAt : new Date(),
  //   updatedAt : new Date(),
  //   id : 1,
  //   firstName : "ciao",
  //   lastName : "salve",
  //   email: "email",
  //   password : "1234"
  // }
}