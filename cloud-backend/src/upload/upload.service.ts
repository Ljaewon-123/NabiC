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

    const validatorFiles = await this.validateFiles(files)

    console.log(validatorFiles, 'null인데 왜저장?')
    
    this.filesRepository.insert(validatorFiles)

  }

  async validateFiles(files: ModifiedFile[]){
    const userId = files[0].userId
    const uniqueFiles: ModifiedFile[] = [];

    for (const file of files) {
      const existingFile = await this.filesRepository
        .createQueryBuilder('file')
        .where('file.fileName = :fileName', { fileName: file.fileName })
        .andWhere('(file.directory = :directory OR file.directory IS NULL)',
          { directory: file.directory ?? null })
        .andWhere('file.userId = :userId', { userId })
        .getOne();
  
      // console.log(existingFile,'중복 파일', file.fileName, file.directory)
      if (!existingFile) uniqueFiles.push(file)
    }

    return uniqueFiles
  }

  // 빈폴더만 선택하면 아무것도 안온다 
  // 실직적으로 폴더 전송은 내부 파일만 보내는 거라서
  // 그래서 폴더 생성이 따로있는건가?? 
  async createPathFiles(files: ModifiedFile[] | Files[]){

    // console.log(files, 'files!!!')

    const folders = []

    files.forEach( file => {
      file.directory.split('/').reduce( (acc: ModifiedFolder[], current: string, index:number, arr: string[] ) => {
        const existingFolder = acc.find(folder => folder.folderName == current && folder.depth == index);

        const folder = new Folders();

        if (existingFolder) {
          // 기존 폴더가 있으면 파일을 배열에 추가
          if (index == arr.length - 1) {
            acc.at(-1).file.push(file);
          }
        } else {
          // 기존 폴더가 없으면 새 폴더를 추가
          // 아래랑 똑같은 객체배열인데 뭐 때문에 제약위반인지 모르겠다 
          folder.folderName = current
          folder.depth = index
          folder.file = index == arr.length - 1 ? [file] : []
          folder.userId = file.userId
          acc.push(folder)
          // acc.push(this.foldersRepository.create({
          //   folderName: current,
          //   depth: index,
          //   file: index == arr.length - 1 ? [file] : [],
          //   userId: file.userId
          // }))
        }
        return acc
      }, folders)
    })

    const folderNames = folders.map(folder => folder.folderName);
    const depths = folders.map(folder => folder.depth);
    const userId = folders[0].userId

    // 객체로 안해도되나? 
    const validatorFolder = await this.validatorFolders({
      folderNames, depths, userId
    })

    if(validatorFolder.length == 0) {
      const vaildate = await this.validateFiles(files)
      await this.filesRepository.save(vaildate)
      await this.foldersRepository.save(folders)
      return 
    } 

    validatorFolder.forEach(validator => {
      for (let i = folders.length - 1; i >= 0; i--) {
        const folder = folders[i];
        if (validator.folderName === folder.folderName && validator.depth === folder.depth) {
          folders.splice(i, 1);
        }
      }
    });

    if(folders.length == 0) return 

    // m : m은 save여야 join까지 가나보네...
    const vaildate = await this.validateFiles(files)
    await this.filesRepository.save(vaildate)
    await this.foldersRepository.save(folders)

  }

  async validatorFolder(
    { folderName, depth, userId }: 
    { 
      folderName: string, 
      depth: number, 
      userId: number 
    }
  ): Promise<Folders>{
    const validatorFolder = await this.foldersRepository
      .createQueryBuilder()
      .where('folder_name = :name', { name: folderName })
      .andWhere('depth = :depth', { depth: depth })
      .andWhere('user_id_id = :userId',{ userId: userId })
      .getOne();

    return validatorFolder
  }

  async validatorFolders(
    { folderNames, depths, userId }: 
    { folderNames: string[], 
      depths: number[], 
      userId: number }
  ): Promise<Folders[]>{
    const validatorFolders = await this.foldersRepository
      .createQueryBuilder()
      .where('folder_name IN (:...names)', { names: folderNames })
      .andWhere('depth IN (:...depths)', { depths: depths })
      .andWhere('user_id_id = :userId',{ userId: userId })
      .getMany();

    return validatorFolders
  }

  async createOneFolder(userId:number, folderName: string, depth:number){
    const validate = await this.validatorFolder({folderName, userId, depth})

    console.log(validate, 'validate')
    if(validate) throw 'faile'

    const folder = this.foldersRepository.create({
      folderName: folderName,
      depth: depth,
      userId: userId
    })

    await this.foldersRepository.save(folder)
    return 'done!'
  }

  // 하나로 합쳐?? 아니면 분리상태로??
  createRepoFiles(data:any){
    return this.filesRepository.create(data) as unknown as Files
  }
  createRepoFolders(data: any){
    return this.foldersRepository.create(data)
  }

}
