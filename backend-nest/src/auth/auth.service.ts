import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PlayersService } from 'src/players/players.service';
import { Player } from '@prisma/client';
import { JwtPayload } from './strategies/auth.strategy.jwt'
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';

@Injectable()
export class AuthService {
	constructor (
		private prisma : PrismaService,
		private readonly playerService: PlayersService,
		private readonly jwtService: JwtService,
		) {
	}

	// takes the full object as argument in case we need 
	// to add more info to the token in the future
	async generateJwt(player : Player) : Promise<string> {
		console.log('DEBUG | Service | generateJwt() : called');

		const payload  : JwtPayload = { sub: String(player.id) };
		const token : string = await this.jwtService.signAsync(payload);
		return token; 

	  }

	async registerPlayer(user : any)  : Promise<Player>  {
		console.log('DEBUG | Service | registerPlayer() : called');

		// using the nestjs response object to create a new entry in the database
		const playerDto : CreatePlayerDto = {
			id: Number(user.id),
			username: user.username,
			avatar: user.avatar,
			firstName: user.firstName,
			lastName: user.lastName,
			profileIntra: user.profileIntra,
		} as CreatePlayerDto;

		return await this.playerService.create(playerDto);
	}

	async signIn(user : any) : Promise<string> {
		console.log('DEBUG | Service | signIn() : called');
	
		// finds the player in the database
		let player : Player = await this.playerService.findOne(Number(user.id));

		// or register as new player
		if ( player == null )
			player = await this.registerPlayer(user);

		// creates a 2h session token for this player
		const token  : string = await this.generateJwt(player);		

		return token;
	  }

}

















// import { Injectable } from '@nestjs/common';
// import { PlayersService } from 'src/players/players.service';

// var passport = require('passport')
// var FortyTwoStrategy = require('passport-42').Strategy;

// // passport.use(new FortyTwoStrategy({

// // 		clientID: process.env.UID,
// // 		clientSecret: process.env.SECRET,
// // 		callbackURL: process.env.CALLBACK_URL,
// // 		},
// // 		async function(accessToken: string, refreshToken: string, profile: any, cb: any) {
// // 			const user = {
// // 				id: profile._json.id,
// // 				login: profile._json.login,
// // 				accessToken: accessToken,
// // 				refreshToken: refreshToken,
// // 			}
// // 			cb(null, user);
// // 		}
// // 	));

// // Configure 42 OAuth2 Strategy
// 	passport.use(
//     	new FortyTwoStrategy(
// 		{
// 			clientID: process.env.UID,
// 			clientSecret: process.env.SECRET,
// 			callbackURL: 'http://127.0.0.1:3000/login/42/return',
// 		},
// 		(accessToken, refreshToken, profile, done) => {
// 			// In a real application, you would link the 42 profile to a user in your database.
// 			return done(null, profile);
// 		},
// 		),
// 	);

//   passport.serializeUser((user, done) => {
//     done(null, user);
//   });

//   passport.deserializeUser((obj, done) => {
//     done(null, obj);
//   });

// @Injectable()
// export class AuthService {
// 	constructor(
// 		private readonly playerService: PlayersService
// 		// private jwtService: JwtService,
// 	) {}

// }
