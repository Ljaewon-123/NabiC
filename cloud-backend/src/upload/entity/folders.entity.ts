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
@Entity()
@Unique(['folderName', 'depth'])
export class Folders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Matches(/^[^\\\/:*?"<>|]+$/, { message: 'Folder contains invalid characters.' })
  folderName: string

  @Column()
  depth: number

  @ManyToMany(() => Files,{
    cascade: true, nullable: true
  })
  @JoinTable()
  file: ModifiedFile[]

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