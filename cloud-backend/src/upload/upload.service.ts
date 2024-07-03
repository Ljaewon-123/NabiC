import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudUser } from 'src/auth/entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Files } from './entity/files.entity';
import { Folders } from './entity/folders.entity';
import { ModifiedFile, ModifiedFolder } from './types';
import { FolderDto } from './dto';

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

  // 파일은 부모가 없음
  async createFiles(userId: number, files: ModifiedFile[]){

    const validatorFiles = await this.validateFiles(files)

    console.log(validatorFiles, 'null인데 왜저장?')
    
    this.filesRepository.insert(validatorFiles)

  }

  async validateFiles(files: ModifiedFile[]){
    const userId = files[0].userId
    const uniqueFiles: ModifiedFile[] = [];

    for (const file of files) {
      let existingFile = await this.filesRepository
          .createQueryBuilder('file')
          .where('file.fileName = :fileName', { fileName: file.fileName })
          .andWhere('(file.directory = :directory )', { directory: file.directory ?? '/' })
          .andWhere('file.userId = :userId', { userId })
          .getOne();

      if (existingFile) {
          let copyNumber = 1;
          let newFileName = `${file.fileName}-copy(${copyNumber})`;

          while (await this.filesRepository
              .createQueryBuilder('file')
              .where('file.fileName = :fileName', { fileName: newFileName })
              .andWhere('(file.directory = :directory )', { directory: file.directory ?? '/' })
              .andWhere('file.userId = :userId', { userId })
              .getOne()) {
              copyNumber++;
              newFileName = `${file.fileName}-copy(${copyNumber})`;
          }

          file.fileName = newFileName;
      }

      uniqueFiles.push(file);
    }

    return uniqueFiles
  }

  // 빈폴더만 선택하면 아무것도 안온다 
  // 실직적으로 폴더 전송은 내부 파일만 보내는 거라서
  // 그래서 폴더 생성이 따로있는건가?? 
  async createPathFiles(files: ModifiedFile[] | Files[], currentPath: string){

    const folders = []

    files.forEach( file => {
      const directorySegments = file.directory.split('/');
      console.log(directorySegments, directorySegments.slice(0, -1).join('/'))
      directorySegments.reduce( (acc: ModifiedFolder[], current: string, index:number, arr: string[] ) => {
        const existingFolder = acc.find(folder => folder.folderName == current );

        const folder = new Folders();

        if (existingFolder) {
          // 기존 폴더가 있으면 파일을 배열에 추가
          if (index == arr.length - 1) {
            acc.at(-1).file.push(file);
          }
        } 
        else {
          const result = this.defaultPath(currentPath) + directorySegments.slice(0, -1).join('/');
          // 기존 폴더가 없으면 새 폴더를 추가
          folder.folderName = current
          folder.file = index == arr.length - 1 ? [file] : []
          folder.userId = file.userId
          folder.directory = result
          acc.push(folder)
        }

        return acc
      }, folders)
    })

    // console.log(folders, '결과||||||||||||||')

    const parentFolder = folders[0];
    const newParentName = await this.validatorFolder(parentFolder)
    // console.log('newname', newParentName)
    // folders[0].folderName = newParentName.folderName

    const updatedChildFolders = await this.renameChildFolders(folders, parentFolder, newParentName.folderName);
    
    const renamedFiles = await this.renameFilesDirectory(files, parentFolder.folderName, newParentName.folderName);
    
    updatedChildFolders[0].folderName = newParentName.folderName
    // console.log(folders)
    console.log(updatedChildFolders,'update name')
    // console.log('|||||||||')
    // console.log(renamedFiles)


    // m : m은 save여야 join까지 가나보네...
    // const vaildate = await this.validateFiles(files) // 안해도될듯?? 다 쌔거라서 어차피 경로다 다다름 

    const path = this.defaultPath(currentPath)
    if(path !== ''){
      files.forEach( file => {
        file.directory = path + '/' + file.directory
      })
    }
    
    console.log(files, renamedFiles)
    // await this.filesRepository.save(files)
    // await this.foldersRepository.save(folders)

  }

  async validatorFolder(
    { folderName, userId, directory }: 
    { 
      folderName: string, 
      userId: number, 
      directory:string,
    }
  ) {

    // 중복된 폴더 이름이 있는지 확인
    let existingFolder = await this.foldersRepository
      .createQueryBuilder()
      .where('folder_name = :name', { name: folderName })
      .andWhere('user_id_id = :userId', { userId: userId })
      .andWhere('(directory = :directory )', { directory: directory ?? '/' })
      .getOne();

    // 중복되지 않으면 그대로 반환
    if (!existingFolder) {
      return { folderName, userId };
    }

    // 폴더 이름이 중복되는 경우 '-copy(n)'을 붙임
    let copyNumber = 1;
    let newFolderName = `${folderName}-copy(${copyNumber})`;

    // 새로운 폴더 이름이 중복되지 않는지 확인
    while (true) {
      existingFolder = await this.foldersRepository
        .createQueryBuilder()
        .where('folder_name = :name', { name: newFolderName })
        .andWhere('user_id_id = :userId', { userId: userId })
        .andWhere('(directory = :directory )', { directory: directory ?? '/' })
        .getOne();

      if (!existingFolder) {
        break;
      }

      copyNumber++;
      newFolderName = `${folderName}-copy(${copyNumber})`;
    }

    // 새로운 폴더 이름을 반환
    return { folderName: newFolderName, userId };
  }

  // async validatorFolder(
  //   { folderName, userId, parent }: 
  //   { 
  //     folderName: string, 
  //     userId: number ,
  //     parent?: string
  //   }
  // ): Promise<Folders>{
  //   const validatorFolder = await this.foldersRepository
  //     .createQueryBuilder()
  //     .where('folder_name = :name', { name: folderName })
  //     .andWhere('user_id_id = :userId',{ userId: userId })
  //     .andWhere('(parent = :parent )', { parent: parent ?? 'root' })
  //     .getOne();

  //   return validatorFolder
  // }

  async validatorFolders(
    { folderNames, userId }: 
    { folderNames: string[], 
      userId: number ,
    }
  ): Promise<Folders[]>{
    const validatorFolders = await this.foldersRepository
    .createQueryBuilder()
    .where('folder_name IN (:...names)', { names: folderNames })
    .andWhere('user_id_id = :userId',{ userId: userId })
    .getMany();
  
    // 중복된 폴더 이름 처리
    for (let i = 0; i < validatorFolders.length; i++) {
      let copyCount = 1;
      let originalName = validatorFolders[i].folderName;
      while (folderNames.includes(validatorFolders[i].folderName)) {
        validatorFolders[i].folderName = `${originalName}-copy(${copyCount})`;
        copyCount++;
      }
    }
  
    return validatorFolders;
  }

  async createOneFolder(userId:number,  dto: FolderDto){
    
    const validate = await this.validatorFolder({
      folderName: dto.fileName, 
      directory: dto.directory,
      userId,
    })

    console.log(validate, 'validate')
    // 기존 중복은 저장하지 않는다 -> -copy(n)으로 저장한다로 바뀜 
    // if(validate) throw 'already match'

    const folder = this.foldersRepository.create({
      folderName: dto.fileName,
      userId: userId,
      directory: dto.directory,
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

  async renameChildFolders(folders: ModifiedFolder[], parentFolder: ModifiedFolder, newFolderName: string) {
    for (const folder of folders) {
      if (folder.directory.startsWith(parentFolder.folderName)) {
        // 디렉토리의 첫 번째 세그먼트가 부모 폴더와 같은 경우 이름 변경
        folder.directory = folder.directory.replace(parentFolder.folderName, newFolderName);
      }
    }
    return folders;
  }

  async renameFilesDirectory(files: (ModifiedFile | Files)[], oldFolderName: string, newFolderName: string) {
    for (const file of files) {
      const directorySegments = file.directory.split('/');
      if (directorySegments[0] == oldFolderName) {
        directorySegments[0] = newFolderName;
        file.directory = directorySegments.join('/');
      }
    }

    return files
  }

  defaultPath(currentPath:string){
    if(currentPath == '/') return ''

    return currentPath 
  }

}
