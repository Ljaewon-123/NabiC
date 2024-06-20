import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator"

export class FolderDataDto {

  @IsString()
  @IsNotEmpty()
  folder: string

  // number로 들어와야 되긴하는데 pipe에서 바꿔주면 되긴하는데 
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'username must contain only digits (0-9)' })
  depth: number
}