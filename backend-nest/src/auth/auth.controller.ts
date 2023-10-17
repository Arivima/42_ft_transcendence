/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.controller.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: earendil <earendil@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/08 20:49:41 by earendil          #+#    #+#             */
/*   Updated: 2023/10/17 16:40:59 by earendil         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	Post,
	Redirect,
	Request,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/auth.guard.42';
import { PlayersService } from 'src/players/players.service';
import { Public } from './decorators/auth.public.decorator';
import { Protected } from './decorators/auth.protected.decorator';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly pservice: PlayersService,
	) {}

	/**
	 * this endpoint is to be called during oauth login through 42 API. It is both starting endpoint and callback url.
	 * @param req
	 * @returns
	 */
	@Public()
	@UseGuards(FortyTwoAuthGuard) //OAUTH guard, not jwt
	@Redirect('', 302)
	@Get('42')
	async login42(@Request() req) {
		const userID = Number(req.user.id);

		try {
			console.log('DEBUG | Controller | login42() : called');

			// after validate(), user is stored in req.user
			// now let's sign in the app (find/register user, create a token)
			const token = await this.authService.signIn(req.user);

			// log the user in
			if (false == (await this.authService.is2FAset(userID)))
				this.pservice.addConnection(userID);

			// let's share the session token with the user
			const redirect_url = new URL(`${req.protocol}:${req.hostname}`);
			redirect_url.port = process.env.FRONTEND_PORT;
			redirect_url.searchParams.append('token', `${token.toString()}`);
			return `${redirect_url.href}`;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	@Delete('42')
	async logOut(@Request() req): Promise<void> {
		this.pservice.removeConnection(Number(req.user.sub));
	}

	/**
	 * this endpoint is to be called during enablement of 2fa authentication once logged in.
	 * @param req
	 * @returns
	 */
	@Get('2fa/qrcode')
	async getQRCode(@Request() req) {
		const userID = Number(req.user.sub);

		try {
			const qrcode = await this.authService.generate2FAQRCode(userID);
			return { qrcode };
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	/**
	 * this endpoint is to be called during 2fa login
	 * @param otp
	 * @param req
	 */
	@Protected()
	@Post('2fa/login')
	async login2fa(@Body('otp') otp: string, @Request() req) {
		if (false == (await this.authService.verifyOTP(Number(req.user.sub), otp)))
			throw new UnauthorizedException('Invalid TOTP');
		this.pservice.addConnection(Number(req.user.sub));
	}

	/**
	 * this endpoint is to be used during enablement of 2fa authentication after generation of qr code.
	 * @param otp
	 * @param req
	 */
	@Post('2fa')
	async verify2fa(@Body('otp') otp: string, @Request() req) {
		if (
			false == (await this.authService.verifyOTP(Number(req.user.sub), otp))
		) {
			throw new UnauthorizedException('Invalid TOTP');
		}
	}
}
