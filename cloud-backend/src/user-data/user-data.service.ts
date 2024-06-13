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

  async test(userId: number){
    const result = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.files', 'files', 'files.directory IS NULL')
      .leftJoinAndSelect('user.folders', 'folders', 'folders.depth = 0')
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
        'folders.depth'
      ])
      .where('user.id = :userId', { userId })
      .getOne();

    console.log(result)
    return result;
  }
}
