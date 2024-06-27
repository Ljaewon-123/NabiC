import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudUser } from 'src/auth/entity';
import { Files } from 'src/upload/entity/files.entity';
import { Folders } from 'src/upload/entity/folders.entity';
import { Repository } from 'typeorm';
import { DeleteFilesDto, FolderDataDto } from './dto';

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

  async deleteUserFiles(userId:number, deleteFilesDto:DeleteFilesDto){
    deleteFilesDto.itemList.forEach( async item => {
      if(!item.isFolder) return await this.filesRepository.delete({ userId:userId, id: item.id })

      await Promise.all([
        this.foldersRepository.delete({ userId:userId, id: item.id }),
        this.filesRepository.delete({ userId:userId, directory: item.name })
      ])
      .catch((error) => {
        console.error(error);
      })
      
    })
    // console.log(deleteFilesDto)
    
  }

}
