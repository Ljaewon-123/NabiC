import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class FileDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsBoolean()
  isFolder: boolean;

  @IsString()
  @IsOptional()
  data?: string;
}

export class CheckedFilesDto {
  @IsString()
  directory: string;

  @ValidateNested({ each: true })
  @Type(() => FileDto)
  itemList: FileDto[];
}


