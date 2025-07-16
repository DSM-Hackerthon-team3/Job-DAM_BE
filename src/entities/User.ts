import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum SchoolLevel {
  ELEMENTARY = '초등학교',
  MIDDLE = '중학교',
  HIGH = '고등학교'
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}