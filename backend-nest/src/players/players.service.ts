import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  create(createPlayerDto: CreatePlayerDto) {
    this.playerRepository.save(createPlayerDto);
  }

  async findAll() {
    return await this.playerRepository.find();
  }

  async  findOne(id: number) : Promise<Player | undefined> {
    return await this.playerRepository.findOne({ where: { id } });
  }



  // update(id: number, updatePlayerDto: UpdatePlayerDto) {
  //   return `This action updates a #${id} player`;
  // }
  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<void> {
    await this.playerRepository.update(id, updatePlayerDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} player`;
  // }
  async remove(id: number): Promise<void> {
    await this.playerRepository.delete(id);
  }

}
