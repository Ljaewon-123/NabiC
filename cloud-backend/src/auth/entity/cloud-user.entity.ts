import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

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
}