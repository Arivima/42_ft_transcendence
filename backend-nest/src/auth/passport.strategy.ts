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

    try {

        if (await this.pservice.findOne(Number(profile.id)) == null)
          this.pservice.create({
            id : Number(profile.id),
            username : profile.username,
            avatar : profile._json.image.link,
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            profileIntra : profile.profileUrl,
            })

        return done(null, profile);
      }

      catch (error) {
        return done(error, null);
      }
  }
}