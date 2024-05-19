import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AtStrategy } from 'src/auth/strategies';

@Module({
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule {}
