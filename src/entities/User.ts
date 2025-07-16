import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Comment } from './Comment';

export enum SchoolLevel {
  초등학교 = '초등학교',
  중학교 = '중학교',
  고등학교 = '고등학교'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column({ unique: true, length: 20 })
  id!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: SchoolLevel
  })
  schoolLevel!: SchoolLevel;

  @Column({ type: 'json', nullable: true })
  aptitudeTestResult?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[];
}