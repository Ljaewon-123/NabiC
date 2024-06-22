import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudUser } from 'src/auth/entity';
import { Files } from 'src/upload/entity/files.entity';
import { Folders } from 'src/upload/entity/folders.entity';
import { Repository } from 'typeorm';

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
      .leftJoinAndSelect('user.folders', 'folders', 'folders.parent = :rootParent', { rootParent: 'root' })
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
        'folders.folderName',
      ])
      .where('user.id = :userId', { userId })
      .getOne();

    console.log(result)
    return result;
  }

  // relations: {
//   categories: true,
// },
  async folderInnerData(userId: number, folderName: string) {
    const result = await this.foldersRepository
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.file', 'file')
      .where('folder.userId = :userId', { userId })
      .andWhere('folder.folderName = :folderName', { folderName })
      .orWhere('folder.parent = :folderName', { folderName }) 
      .getMany();

    console.log(result, 'what inner folder data?');
    return result;
  }

}
