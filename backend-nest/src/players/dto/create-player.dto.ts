import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePlayerDto {

	id: number;
	
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}
