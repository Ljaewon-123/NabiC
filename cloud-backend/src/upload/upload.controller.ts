import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Request, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { isArray } from 'class-validator';
import { Files } from './entity/files.entity';
import { FolderDto } from './dto';
import { UndefinedPipe } from 'src/pipes/undefined-pipe';

// 이름이 같으면 -copy (n) , _copy (n)
// 혹은 fe에서 거부?? 명단을 가지고있으니까 
// 파일 결과보이는거 배열로 안보내고 하나씩 보내는건가??
// => XMLHttpRequest.upload 확인 
// 좋아요 기능 

//  lastModified lastModifiedDate file이랑 바디 값이랑 합치는 공통적인 과정을 미들웨어에서 할수있지 않을까?? 
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
  uploadFile( @UploadedFile() file: Express.Multer.File, @GetCurrentUserId() userId: number) {
    console.log(file, 'file');
    // this.uploadService.createFiles(userId, file)
    return file
  }

  
    // array of files
  @Post('files')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files'))
  uploadArrayFile(
    @UploadedFiles() files: Array<Express.Multer.File>, 
    @GetCurrentUserId() userId: number,
    @Body() body: {lastModified: string | string[], lastModifiedDate: string | string[]}
  ) {

    const lastModified = body.lastModified
    const lastModifiedDate = body.lastModifiedDate
    const newFileArray = files.map( (file:Express.Multer.File, index: number ) => {
      return {
        userId: userId,
        lastModified: isArray(lastModified) ? lastModified[index] : lastModified,
        lastModifiedDate: isArray(lastModifiedDate) ? lastModifiedDate[index] : lastModifiedDate,
        fileName : file.originalname,
        file : file.buffer,
        fileType : file.mimetype,
        size: file.size,
        folders: null
      }
    })

    // console.log(newFileArray, userId, files[0].destination, '목적지??')
    // console.log('body: ', body)
    this.uploadService.createFiles(userId, newFileArray)
    
    return files
  }

  // 커스텀 필터 필수같음 
  // 결국 path를 포함한 파일들이 오는거라 
  @Post('folder')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor(
    'pathFiles',
    50,
    {preservePath:true} ))
  async uploadMultiFile(
    @UploadedFiles() pathFiles: Express.Multer.File[] ,
    @GetCurrentUserId() userId: number,
    @Body() body: {
      lastModified: string | string[], 
      lastModifiedDate: string | string[],
    },
    @Body('parent', UndefinedPipe) parent: string | undefined
  ) {
    // console.log('arrive',parent, typeof parent )
    
    const lastModified = body.lastModified
    const lastModifiedDate = body.lastModifiedDate
    const newFileArray = pathFiles.map( (file:Express.Multer.File, index: number ) => {
      const nameArray = file.originalname.split('/')
      const fileName = nameArray.splice(-1, 1) // 마지막이 파일이름 

      return this.uploadService.createRepoFiles({
        userId: userId,
        lastModified: isArray(lastModified) ? lastModified[index] : lastModified,
        lastModifiedDate: isArray(lastModifiedDate) ? lastModifiedDate[index] : lastModifiedDate,
        directory: nameArray.join('/'),
        fileName : fileName[0],
        file : file.buffer,
        fileType : file.mimetype,
        size: file.size
      })
    })

    await this.uploadService.createPathFiles(newFileArray, parent )
    
    console.log(pathFiles)
  }

  @Post('create/folder')
  @HttpCode(HttpStatus.CREATED)
  async createFolder(
    @GetCurrentUserId() userId: number,
    @Body() dto: FolderDto,
  ){
    console.log(dto)
    return await this.uploadService.createOneFolder(userId, dto)
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
