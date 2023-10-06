import { Controller, ExecutionContext, Get, HttpException, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards, createParamDecorator  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/auth.guard.42';
import { Request, Response } from 'express';

//! TODO correct flow with path, redirect url (in the.env and the 42API)
//! TODO correct async / promises etc
//! TODO correct flow with path

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

    // @Get('/login')
    // login(@Req() req, @Res() res) {
    //   res.render('login');
    // }

	@Get('42')
	@UseGuards(FortyTwoAuthGuard)
	async login42() {
		console.log("DEBUG | Controller | login42() : called")
	}

	@Get('42/callback')	
	@UseGuards(FortyTwoAuthGuard)
	async login42Callback(@Req() req: Request, @Res() res: Response) {
		try {
			console.log('DEBUG | Controller | login42Callback() : called');

			// after validate(), user is stored in req.user
			// now let's sign in the app (find/register user, create a token)
			const token = await this.authService.signIn(req.user);

			// let's share the session token to the user
			res.json({token});

		}
		catch (error) {
			throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
