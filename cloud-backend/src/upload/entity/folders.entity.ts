import { CloudUser } from 'src/auth/entity';
import { 
  Entity, 
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { Files } from './files.entity';
import { ModifiedFile } from '../types';
import { Matches } from 'class-validator';

// 빈폴더만 있을경우.....
// 폴더이름, 깊이, 부모폴더이름 3개가 같아야 유효성 중복에러 
// nullable값이 있으면 null은 유효성에 포함을 안하네 
// 여기서 에러를 내면은 사실상 내가 체크안해도 되지않나?
// 중복안된다고 완전히 거부를 하냐 중간에 받냐 차이?
@Entity()
@Unique(['folderName', 'parent', 'userId'])
export class Folders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Matches(/^[^\\\/:*?"<>|]+$/, { message: 'Folder contains invalid characters.' })
  folderName: string

  @Column({ default: 'root' })
  parent: string

  @ManyToMany(() => Files,{
    cascade: true, nullable: true
  })
  @JoinTable()
  file: ModifiedFile[] // 왜 files라고 안했지....햇갈려 

  @ManyToOne(() => CloudUser, user => user.id ,{
    onDelete: 'CASCADE',
  })
  userId: number

}

// git book
// https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations
// relations: {
//   categories: true,
// },