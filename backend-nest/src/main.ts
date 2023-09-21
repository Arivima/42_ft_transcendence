import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
// import { CorsOptions } from '@nestjs/platform-express/interfaces/cors-options.interface';


dotenv.config();


async function bootstrap() {
  console.log(process.env.BACKEND_PORT);
  //  print type of BACKEND_PORT
  console.log(process.env.POSTGRES_DB);
  
  const corsOptions = {
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(corsOptions);

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
