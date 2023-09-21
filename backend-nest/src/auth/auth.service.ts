


// auth.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Your authentication service logic can go here
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
