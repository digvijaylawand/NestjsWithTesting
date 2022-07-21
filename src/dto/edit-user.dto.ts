import { IsOptional, IsString } from "class-validator";

export class EditUser {
    @IsString()
    @IsOptional()
    email:string;

    @IsString()
    @IsOptional()
    password:string;

    @IsString()
    @IsOptional()
    firstName:string;

    @IsString()
    @IsOptional()
    lastName:string;
    
}