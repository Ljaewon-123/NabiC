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

  @CreateDateColumn()
  createdAt: Date

  @CreateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}