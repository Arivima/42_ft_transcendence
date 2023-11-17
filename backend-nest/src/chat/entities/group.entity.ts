import { IsArray, IsString, IsInt, IsBoolean } from 'class-validator';


export class Group {
	@IsString()
	name: string;
  
	@IsInt({ each: true })
	members: number[];
  
	@IsInt()
	founderId: number;
  
	@IsBoolean()
	visibility: string;
  
	@IsString()
	password?: string;
}
