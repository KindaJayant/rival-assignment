import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateBlogDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    content?: string;

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}
