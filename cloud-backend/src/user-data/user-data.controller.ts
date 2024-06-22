import { Body, Controller, Get, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { FolderDataDto } from './dto';

@Controller('user-data')
export class UserDataController {
  constructor(
    private userDataService: UserDataService
  ){}

  @Get()
  getFiles(@GetCurrentUserId() userId: number,){
    return this.userDataService.rootData(userId)
  }

  // depth가 숫자로 들어와야 되는건 맞는데 
  // 실제로는 문자열이고 검증도 필요하고 pipe변환도 필요한데 흠;
  @Post()
  getFolderData(
    @GetCurrentUserId() userId: number,
    @Body() folderDataDto: FolderDataDto ,
    @Body('folder') folder : string,
  ){
    console.log(userId, folderDataDto, folder)
    return this.userDataService.folderInnerData(userId, folder)
  }
}
