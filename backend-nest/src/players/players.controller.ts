import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
// import { ApiBody } from '@nestjs/swagger';

@Controller('players')
export class PlayersController {
	constructor(private readonly playersService: PlayersService) {}

	// @ApiBody({
	// 	type: CreatePlayerDto,
	// 	required: true,
	// })
	@Post()
	create(@Body() createPlayerDto: CreatePlayerDto) {
		return this.playersService.create(createPlayerDto);
	}

	@Get()
	findAll() {
		return this.playersService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.playersService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
		return this.playersService.update(+id, updatePlayerDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.playersService.remove(+id);
	}

	// @Get(':id/getChats')
	// async getChats(
	// 	@Body('id') id: number,
	// 	@Body('limit') n: number = Infinity,
	// ): Promise<
	// 	{
	// 		name: string;
	// 		dm: boolean;
	// 		avatar: string;
	// 	}[]
	// > {
	// 	console.log(n);
	// 	return [
	// 		{
	// 			name: '',
	// 			dm: false,
	// 			avatar: '',
	// 		},
	// 		{
	// 			name: '',
	// 			dm: false,
	// 			avatar: '',
	// 		},
	// 	];
	// }
}
