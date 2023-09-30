import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePlayerDto {

	id: number;
	username: string;
	avatar: string;
	
	firstName?: string;
	lastName?: string;
	profileIntra?: string;

}
