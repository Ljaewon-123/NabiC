import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Request, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService
  ){}

  
  // 여러개가 들어오면 반응안함 
  // 이거 없어도 될거같긴한데
  @Post('file')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile( @UploadedFile() file: Express.Multer.File) {
    console.log(file, 'file');
    return file
  }

  // array of files
  @Post('files')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files'))
  uploadArrayFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files)
    // this.logger.log(files, 'nest logger')
  }


  // 커스텀 필터 필수같음 
  @Post('folder')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor(
    'pathFiles',
    50,
    {preservePath:true} ))
  uploadMultiFile(@UploadedFiles() pathFiles: Express.Multer.File[] ) {
    console.log(pathFiles)
  }


  // multiple files  
  // @Post('folder')
  // @HttpCode(HttpStatus.CREATED)
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'files'},
  //   { name: 'path'}
  // ],{preservePath:true} ))
  // uploadMultiFile(@UploadedFiles() files: { files?: Express.Multer.File[], path?: any[] }) {
  //   console.log(files)
  // }


}
