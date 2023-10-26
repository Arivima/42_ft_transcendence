import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Request,
	Query,
	Res,
} from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path';//REMOVE
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Response } from 'express';
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

	@Get('me')
	async getMe(@Request() req) {
		const player = await this.playersService.findOne(Number(req.user.sub));

		if (player) {
			//TODO CORREGGERE
			player.avatar = `${req.protocol}://${req.hostname}:${process.env.BACKEND_PORT}/players/me/avatar`
		}
		console.log(`avatar address: ${player.avatar}`);
		return player;
	}

	@Get('avatar/:id')
	async getAvatar(@Param('id') id: string, @Res() res: Response) {
		const filePath = path.join(
			process.cwd(), (await this.playersService.findOne(Number(id))).avatar
		);

		fs.open(filePath, 'r', (err, fd) => {
			let returnedFilePath: string;

			if (err) {
				returnedFilePath = '/public/upload/Default_on_error.svg.png';
			}
			else {
				fs.close(fd)
				returnedFilePath = filePath;
			}
			const file = fs.createReadStream(filePath)
			file.pipe(res)
		});
	}

	// @Get('addFriend/:username')
	// addFriend(@Body() username: string) {}

	//TODO add interface "Connection" here for return type spec
	@Get('friends/:id')
	getFriends(@Param('id') id: string) {
		return this.playersService.getAllFriends(Number(id));
	}

	@Get('games/:id')
	getGames(@Param('id') id: string, @Query('limit') limit: string) {
		return this.playersService.getAllGames(
			Number(id),
			limit ? Number(limit) : undefined,
		);
	}

	@Get('achievements/:id')
	getAchievements(@Param('id') id: string) {
        console.log(`DEBUG | players.controller | getAchievements | id: ${id}`);
		return this.playersService.getAllAchievements(Number(id));
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.playersService.findOne(Number(id));
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
		return this.playersService.update(Number(id), updatePlayerDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.playersService.remove(Number(id));
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
