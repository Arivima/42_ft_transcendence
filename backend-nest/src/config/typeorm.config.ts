import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Player } from "../players/entities/player.entity";
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
	// host: 'localhost' // for local development
    host: "database",
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [
        Player,
    ],
    synchronize: true,
    logging: false,
    autoLoadEntities : true,
}