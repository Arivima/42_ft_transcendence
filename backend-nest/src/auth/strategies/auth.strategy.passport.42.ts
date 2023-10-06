import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
constructor() {
	super({
	clientID: process.env.UID,
	clientSecret: process.env.SECRET,
	callbackURL: process.env.CALLBACK_URL,
	});
	console.log('DEBUG | Strategy | constructor() : called');
}

async validate(
	accessToken: string,
	refreshToken: string,
	profile: any,
	done: Function,
) {
	console.log('DEBUG | Strategy | validate() : called');

	// store profile in req.user
	const user = {
	id : Number(profile.id),
	username : profile.username,
	avatar : profile._json.image.link,
	firstName : profile.name.givenName,
	lastName : profile.name.familyName,
	profileIntra : profile.profileUrl,
	};

	done(null, user);
}
}