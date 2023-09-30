import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { PlayersService } from 'src/players/players.service';
dotenv.config();

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly pservice: PlayersService) {
    super({
      clientID: process.env.UID,
      clientSecret: process.env.SECRET,
      callbackURL: 'http://localhost:3000/auth/42/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done : Function) {
    // In a production application, you would typically associate the 42 profile
    // with a user in your database and return that user here.
    // For this example, we'll just return the profile.
    console.log(profile);

      try {
        // implement insert of user in db
        // check if user is in db using findUnique
        // add user to db if present
        return done(null, profile);
      }
      catch (error) {
        return done(error, null);
      }
  }
}