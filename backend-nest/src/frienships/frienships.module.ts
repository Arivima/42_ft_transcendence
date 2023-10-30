import { Module } from '@nestjs/common';
import { FrienshipsService } from './frienships.service';
import { FrienshipsGateway } from './frienships.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [FrienshipsGateway, FrienshipsService, JwtService],
})
export class FrienshipsModule {}
