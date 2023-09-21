import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

dotenv.config();


async function bootstrap() {
  console.log(process.env.BACKEND_PORT);
  //  print type of BACKEND_PORT
  console.log(process.env.POSTGRES_DB);
  
  const app = await NestFactory.create(AppModule);
  // app.use(cookieParser());
  // app.use(
  //   session({
  //     secret: '!terceS',
  //     resave: false,
  //     saveUninitialized: false,
  //   })
  // );

  // // Initialize Passport
  // app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
