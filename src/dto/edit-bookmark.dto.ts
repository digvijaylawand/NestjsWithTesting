import { IsOptional, IsString } from "class-validator";

export class EditBookmarkDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    url?: string;

    @IsString()
    @IsOptional()
    discription?: string;
}