import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePlayerDto {

	id: number;
	
	//? test
	@IsNotEmpty()
	@IsNumber()
	pippo: number;

	firstName: string;
	lastName: string;
	email: string;
	password: string;
}
