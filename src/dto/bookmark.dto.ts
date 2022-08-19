import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    query: string;

    @IsString()
    @IsOptional()
    chartType?: string;

}