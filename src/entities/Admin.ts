import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum Position {
  OCCUPATIONAL_THERAPIST = '작업치료사',
  VOCATIONAL_COUNSELOR = '직업재활사',
  OTHER = '기타'
}

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column({ unique: true, length: 20 })
  id!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: Position
  })
  position!: Position;

  @Column({ length: 100, nullable: true })
  credentials!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}