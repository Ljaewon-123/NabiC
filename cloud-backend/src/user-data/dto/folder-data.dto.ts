import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator"

export class FolderDataDto {

  @IsString()
  @IsNotEmpty()
  folderName: string

  @IsOptional()
  @IsString({ message: 'Directory must be a string or null.' })
  directory: string | undefined

}