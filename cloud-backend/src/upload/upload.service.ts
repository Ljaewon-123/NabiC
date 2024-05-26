import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudUser } from 'src/auth/entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Files } from './entity/files.entity';
import { Folders } from './entity/folders.entity';
import { ModifiedFile, ModifiedFolder } from './types';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(CloudUser)
    private userRepository: Repository<CloudUser>,

    @InjectRepository(Files)
    private filesRepository: Repository<Files>,

    @InjectRepository(Folders)
    private foldersRepository: Repository<Folders>,
  ){}

  // 여기를 업로드만 쓸지 아니면?? 파일 관련 전반 작업을 할지 
  // 파일 저장 
  // 폴더 저장 
  // 일단 유저가 가지고있는 모든 폴더 & 파일 리턴 작업까지 

  // 여기 root경로 저장만 될거같은데 
  async createFiles(userId: number, files: ModifiedFile[]){

    const filename = files.map( file =>  file.fileName );

    const validatorFiles = await this.filesRepository
    .createQueryBuilder()
    .where('file_name IN (:...names)', { names: filename })
    .getMany();

    validatorFiles.forEach(validator => {
      for (let i = files.length - 1; i >= 0; i--) {
        const file = files[i];
        if (validator.fileName === file.fileName) {
          files.splice(i, 1);
        }
      }
    });

    console.log(validatorFiles, files)
    
    this.filesRepository.insert(files)

  }

  async createPathFiles(files: ModifiedFile[]){

    // console.log(files, 'files!!!')

    const folders = []

    files.forEach( file => {
      file.directory.reduce( (acc: ModifiedFolder[], current: string, index:number, arr: string[] ) => {
        const existingFolder = acc.find(folder => folder.folderName == current && folder.depth == index);

        const folder = new Folders();

        if (existingFolder) {
          // 기존 폴더가 있으면 파일을 배열에 추가
          if (index == arr.length - 1) {
            acc.at(-1).file.push(file);
          }
        } else {
          // 기존 폴더가 없으면 새 폴더를 추가
          folder.folderName = current
          folder.depth = index
          folder.file = index == arr.length - 1 ? [file] : []
          folder.userId = file.userId
          acc.push(folder)
          // acc.push({
          //   folderName: current,
          //   depth: index,
          //   file: index == arr.length - 1 ? [file] : [],
          //   userId: file.userId
          // });
        }
        return acc
      }, folders)
    })

    const folderNames = folders.map(folder => folder.folderName);
    const depths = folders.map(folder => folder.depth);


    const validatorFolder = await this.foldersRepository
    .createQueryBuilder()
    .where('folder_name IN (:...names)', { names: folderNames })
    .andWhere('depth IN (:...depths)', { depths: depths })
    .getMany();

    // console.log(validatorFolder)

    validatorFolder.forEach(validator => {
      for (let i = folders.length - 1; i >= 0; i--) {
        const folder = folders[i];
        if (validator.folderName === folder.folderName && validator.depth === folder.depth) {
          folders.splice(i, 1);
        }
      }
    });

    if(folders.length == 0) return 

    // console.log(folders)

    // const file2 = new Files();
    // file2.fileName = 'example.txt';
    // file2.file = Buffer.from('Hello, world!');
    // file2.fileType = 'text/plain';
    // file2.directory = ['folder1', 'folder2'];
    // file2.size = file2.file.length;
    // file2.lastModified = new Date().toISOString();
    // file2.lastModifiedDate = new Date().toISOString();
    // // file2.userId = 11
    // // file.userId 설정...

    // // Folders 인스턴스 생성
    // const folder2 = new Folders();
    // folder2.folderName = 'folder1';
    // folder2.depth = 0;
    // folder2.file = [file2];

    // await this.filesRepository.save(file2)
    // await this.foldersRepository.save(folder2)
    
    // m : m은 save여야 join까지 가나보네...
    await this.filesRepository.save(files)
    await this.foldersRepository.save(folders)

  }


}
