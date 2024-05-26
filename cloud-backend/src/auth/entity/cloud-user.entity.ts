import { Files } from 'src/upload/entity/files.entity';
import { Entity, Column,
  PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn ,
  OneToMany
} from 'typeorm';

@Entity()
export class CloudUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ unique:true })
  email: string;

  @Column({ nullable: true })
  hashedRt: string;

  @Column({ type: 'varchar', length: 10, default: 'customer' })
  roles: string[]

  @Column('int', { default: 20 })
  hardSpace: number

  @CreateDateColumn()
  createdAt: Date

  @CreateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  // 생략해도 되는걸로 아는데 
  @OneToMany(() => Files, files => files.userId)
  files: Files[]
}