import { Module } from '@nestjs/common';
import { FrienshipsService } from './frienships.service';
import { FrienshipsGateway } from './frienships.gateway';

@Module({
  providers: [FrienshipsGateway, FrienshipsService],
})
export class FrienshipsModule {}
