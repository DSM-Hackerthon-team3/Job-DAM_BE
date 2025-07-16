import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";

export enum Position {
  교육 = '교육 / 강의',
  보건의료 = '보건 / 의료',
  IT = 'IT / 소프트웨어',
  공학 = '공학 / 엔지니어링',
  법률 = '법률 / 법조',
  경영 = '경영 / 기획 / 마케팅',
  금융 = '금융 / 회계',
  예술 = '예술 / 디자인 / 미디어',
  과학 = '과학 / 연구',
  공공서비스 = '공공서비스 / 공무원',
  영업 = '영업 / 유통 / 판매',
  관광 = '관광 / 서비스 / 항공',
  스포츠 = '스포츠 / 체육',
  기타 = '기타',
}

export enum Gender {
  MALE = '남성',
  FEMALE = '여성',
  OTHER = '기타',
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
    enum: Position,
  })
  position!: Position;

  @Column({ length: 100, nullable: true })
  credentials?: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}

