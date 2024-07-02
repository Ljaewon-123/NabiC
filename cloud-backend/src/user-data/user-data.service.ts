import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudUser } from 'src/auth/entity';
import { Files } from 'src/upload/entity/files.entity';
import { Folders } from 'src/upload/entity/folders.entity';
import { Repository } from 'typeorm';
import { CheckedFilesDto, FolderDataDto } from './dto';
import { Like, Not, And } from "typeorm"

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(CloudUser)
    private userRepository: Repository<CloudUser>,

    @InjectRepository(Files)
    private filesRepository: Repository<Files>,

    @InjectRepository(Folders)
    private foldersRepository: Repository<Folders>,
  ){}

  async rootData(userId: number){
    const result = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.files', 'files', 'files.directory = \'/\' ')
      .leftJoinAndSelect('user.folders', 'folders', 'folders.directory = :rootdirectory', { rootdirectory: '/' })
      .select([
        'user.id',
        'files.id',
        'files.fileName',
        'files.fileType',
        'files.size',
        'files.file',
        'files.lastModified',
        'files.lastModifiedDate',
        'folders.id',
        'folders.directory',
        'folders.folderName',
      ])
      .where('user.id = :userId', { userId })
      .getOne();
      // .where('folders.depth = :depth')

    console.log(result)
    return result;
  }

  // relations: {
//   categories: true,
// },
  async folderInnerData(userId: number, folderDataDto: FolderDataDto) {
    // const result = await this.foldersRepository
    //   .createQueryBuilder('folder')
    //   .leftJoinAndSelect('folder.file', 'file')
    //   .where('folder.userId = :userId', { userId })
    //   .andWhere('folder.folderName = :folderName', { folderName: folderDataDto.folderName })
    //   .orWhere('folder.directory = :directory', { directory: folderDataDto.directory }) 
    //   .getMany();
    const directory = folderDataDto.directory;
    const folderName = folderDataDto.folderName
    const result = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.files', 'files', 'files.directory = :directory', { directory })
    .leftJoinAndSelect('user.folders', 'folders', 'folders.directory = :directory', { directory })
    .select([
      'user.id',
      'files.id',
      'files.fileName',
      'files.fileType',
      'files.size',
      'files.file',
      'files.lastModified',
      'files.lastModifiedDate',
      'folders.id',
      'folders.directory',
      'folders.folderName',
    ])
    .where('user.id = :userId', { userId })
    .getOne();

    // console.log(result, 'what inner folder data?');
    return result;
  }

  async downloadData(userId:number, downloadDto:CheckedFilesDto){
    const promiseMap = downloadDto.itemList.map( async item => {
      if(!item.isFolder) return this.findOneFileBuffer(userId, item.id)

      return this.findFolderInnderBuffer(userId, downloadDto, item.name)
      
    })

    promiseMap.push(Promise.reject('123'))

    console.log(promiseMap,'!!!!!!!!!!!!!!!!!!!!!!')
    
    // promise all은 에러가 나면 나머지를 못받음
    // allSettled에서 성공된 값만 리턴 ,실패한값은 어떻게??
    const downloadBuf = (await Promise.allSettled(promiseMap)).map( promise => {
      if(promise.status == 'fulfilled' ) return promise.value
      return { error: 'download error' }
    })

    console.log(downloadBuf)
    return downloadBuf
  }

  // name뒤에 '/'이게 있어야 -copy를 피하면서 잡음 언제 다고치지;; 한번에 못찾나?
  // 쿼리빌더 변경 이게 제일 수정 적임 
  findFolderInnderBuffer(userId:number, downloadDto:CheckedFilesDto, name:string){
    const directoryCondition = downloadDto.directory === '/' ? '' : `${downloadDto.directory}/`;
    return this.filesRepository.createQueryBuilder('file')
    .where('file.userId = :userId', { userId })
    .andWhere(`file.directory LIKE :directory`, { directory: `${directoryCondition}${name}%` })
    .andWhere(`file.directory NOT LIKE :notDirectory`, { notDirectory: `${directoryCondition}${name}-copy%` })
    .select(['file.id', 'file.file'])
    .getMany();
  }

  findOneFileBuffer(userId:number, id:number){
    return this.filesRepository.findOne({
      where:{
        userId: userId,
        id: id
      },
      select:{
        id:true,
        file: true
      }
    });
  }

  async deleteUserFiles(userId:number, deleteFilesDto:CheckedFilesDto){
    // console.log(deleteFilesDto,'delete?')
    deleteFilesDto.itemList.forEach( async item => {
      if(!item.isFolder) return await this.filesRepository.delete({ userId:userId, id: item.id })

      // console.log(item.name,'????')
      await Promise.all([
        this.foldersRepository.delete({ userId:userId, id: item.id }),
        this.deleteFiles(userId, deleteFilesDto, item.name)
      ])
      .catch((error) => {
        console.error(error);
      })
      
    })
    // console.log(deleteFilesDto)
    
  }

  deleteFiles(userId: number, deleteFilesDto: CheckedFilesDto, name:string) {
    const directoryCondition = deleteFilesDto.directory === '/' ? '' : `${deleteFilesDto.directory}/`;

    this.filesRepository.createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .andWhere(`directory LIKE :directory`, { directory: `${directoryCondition}${name}%` })
      .execute();
  }

  // this.filesRepository.delete({ 
  //   userId:userId, 
  //   directory: Like(
  //     `${deleteFilesDto.directory == '/' 
  //     ? '' 
  //     : deleteFilesDto.directory + '/'}${item.name}%`
  //   )
  // })

}
