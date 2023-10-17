import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
	@ApiProperty()
	username?: string;
	@ApiProperty()
	avatar?: string;
	@ApiProperty()
	twofaSecret?: string;
}
