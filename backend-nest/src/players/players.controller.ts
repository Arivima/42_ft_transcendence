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
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	UseInterceptors,
	Put,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path';//REMOVE
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Response } from 'express';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
			player.avatar = `/players/avatar/${req.user.sub}`
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
				returnedFilePath = path.join(
					process.cwd(),
					process.env.BACKEND_DEFAULT_ONERR_PFP
				);
			}
			else {
				fs.close(fd)
				returnedFilePath = filePath;
			}
			const file = fs.createReadStream(returnedFilePath)
			res.setHeader("Content-Type", `img/${filePath.split('.')[1]}`)
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

	@Get('me/addFriend/:id')
	sendFrendship(@Param('id') recipientID: string, @Request() req)
	{
		this.playersService.sendFriendship(Number(req.user.sub), Number(recipientID));
	}

	@Get('games/:id')
	getGames(@Param('id') id: string, @Query('limit') limit: string) {
		console.log(`CONTROLLER - getGames: id param = ${id}`);
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
	async findOne(@Param('id') id: string) {
		const player = await this.playersService.findOne(Number(id));

		if (player) {
			player.avatar = `players/avatar/${player.id}`;
		}
		return player;
	}
	
	@Put('me/avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	async updateAvatar(
		@Request() req,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1024*1024*2}),
					new FileTypeValidator({ fileType: 'image/*'}),
				]
			})
		) avatar: Express.Multer.File
	) {
		const newRelPath = `${process.env.BACKEND_PFP_BASEFOLDER}${avatar.originalname}`;
		const newfilePath = path.join(
			process.cwd(),
			newRelPath
		);

		try {
			const oldRelPath = (await this.playersService.findOne(Number(req.user.sub))).avatar;
			const oldFilePath = path.join(
				process.cwd(),
				oldRelPath
			);

			fs.unlinkSync(oldFilePath);
			await this.playersService.update(
				Number(req.user.sub),
				{avatar: newRelPath}
			);
			fs.writeFileSync(newfilePath, avatar.buffer);
		}
		catch (error) {
			throw new HttpException('Could Not Upload Avatar', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Patch('me')
	async updateMe(@Request() req, @Body() updatePlaterDto: UpdatePlayerDto)
	{
		try {
			await this.playersService.update(Number(req.user.sub), updatePlaterDto);
		}
		catch(err) {
			if (
				(err instanceof PrismaClientKnownRequestError) &&
				(err as PrismaClientKnownRequestError).code == 'P2002'
			)
				throw new HttpException(`username ${updatePlaterDto.username} is already in use`, HttpStatus.CONFLICT);
			else
				throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
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
