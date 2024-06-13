import { Controller, Get, Post } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('user-data')
export class UserDataController {
  constructor(
    private userDataService: UserDataService
  ){}

  @Get()
  getFiles(@GetCurrentUserId() userId: number,){
    return this.userDataService.test(userId)
  }
}
