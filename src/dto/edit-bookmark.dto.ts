import { IsOptional, IsString } from "class-validator";

export class EditBookmarkDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    query?: string;

    @IsString()
    @IsOptional()
    chartType?: string;
}