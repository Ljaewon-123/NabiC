import { IsEmpty, IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator";

export class FolderDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^\\\/:*?"<>|]+$/, { message: 'Folder contains invalid characters.' })
  fileName: string

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Depth must be a non-negative integer.' })
  depth:number
}