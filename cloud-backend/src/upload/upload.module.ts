import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AtStrategy } from 'src/auth/strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudUser } from 'src/auth/entity';
import { Files } from './entity/files.entity';
import { Folders } from './entity/folders.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([CloudUser, Files, Folders])
  ],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule {}
