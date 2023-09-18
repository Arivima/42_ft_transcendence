import { Controller, Get, Req, Res, UseGuards  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortytwo-auth.guard';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

// @Controller()
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}
//     @Get('/login')
//     login(@Req() req, @Res() res) {
//       res.render('login');
//     }

//     @Get('/login/42')
//     @UseGuards(FortyTwoAuthGuard)
//     login42() {
//       // The request will be redirected to 42 for authentication, so this
//       // function will not be called.
//     }

//     @Get('/login/42/return')
//     @UseGuards(FortyTwoAuthGuard)
//     login42return(@Req() req, @Res() res) {
//       // Successful authentication, redirect home.
//       return { auth: true };
//     }

// //     app.get('/auth/42',
// //   passport.authenticate('42'));

// // app.get('/auth/42/callback',
// //   passport.authenticate('42', { failureRedirect: '/login' }),
// //   function(req, res) {
// //     // Successful authentication, redirect home.
// //     res.redirect('/');
// //   });
// // ```
// }


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async login42() {
    // This route is handled by Passport and the FortyTwoStrategy.
    // You don't need to do anything here.
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async login42Callback(@Req() req: Request, @Res() res: Response) {
    // This route is also handled by Passport and the FortyTwoStrategy.
    // If authentication is successful, it will redirect to the specified callback URL.
    console.log('login42Callback');
    res.redirect('/');
  }

  @Get('logout')
  logout(@Req() req: Request) {
    // req.logout(); // Log the user out
    return { auth: false };
    // Redirect to the home page or any other appropriate URL
  }
}