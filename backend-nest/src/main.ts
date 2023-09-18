import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();


async function bootstrap() {
  console.log(process.env.BACKEND_PORT);
  //  print type of BACKEND_PORT
  console.log(process.env.POSTGRES_DB);
  
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.BACKEND_PORT || 3000);
}
bootstrap();
