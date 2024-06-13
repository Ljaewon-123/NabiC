import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { CloudUser } from 'src/auth/entity';
import { 
  Entity, 
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  ManyToMany,
  Unique,
} from 'typeorm';
import { Folders } from './folders.entity';

@Entity()
@Unique(['fileName', 'directory'])
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[^\\\/:*?"<>|]+$/, { message: 'Filename contains invalid characters.' })
  fileName: string

  @Column('bytea')
  file: Buffer

  @Column()
  fileType: string

  @Column({ type: 'text', nullable: true })
  directory: string

  @Column()
  size: number

  @Column({ nullable: true})
  lastModified: string
  
  @Column({ nullable: true})
  lastModifiedDate: string

  @ManyToMany(() => Folders, folders => folders.folderName, { nullable:true })
  folder: string

  @ManyToOne(() => CloudUser, user => user.id ,{
    onDelete: 'CASCADE',
  })
  userId: number // CloudUser?? 
}

// 내부에 사진이있는 사용자 로드 
//  orm사용시 설정해야함 
// relations: {
//   user: true,
// },