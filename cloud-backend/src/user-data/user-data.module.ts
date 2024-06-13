import { Module } from '@nestjs/common';
import { UserDataController } from './user-data.controller';
import { UserDataService } from './user-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folders } from 'src/upload/entity/folders.entity';
import { Files } from 'src/upload/entity/files.entity';
import { CloudUser } from 'src/auth/entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([CloudUser, Files, Folders])
  ],
  controllers: [UserDataController],
  providers: [UserDataService]
})
export class UserDataModule {}
