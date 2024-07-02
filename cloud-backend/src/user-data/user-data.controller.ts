import { Body, Controller, Delete, Get, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { DeleteFilesDto, FolderDataDto } from './dto';

@Controller('user-data')
export class UserDataController {
  constructor(
    private userDataService: UserDataService
  ){}

  @Get()
  getFiles(@GetCurrentUserId() userId: number,){
    return this.userDataService.rootData(userId)
  }
  
  @Post()
  getFolderData(
    @GetCurrentUserId() userId: number,
    @Body() folderDataDto: FolderDataDto ,
  ){
    // console.log(userId, folderDataDto)
    return this.userDataService.folderInnerData(userId, folderDataDto)
  }

  @Delete()
  deleteUserFiles(
    @GetCurrentUserId() userId: number,
    @Body()deleteFilesDto: DeleteFilesDto,
  ){
    console.log(userId)
    // console.log(deleteFilesDto,' 옵셔널이라 그랬어~')
    return this.userDataService.deleteUserFiles(userId, deleteFilesDto)
  }
}
