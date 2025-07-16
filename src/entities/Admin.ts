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
  EDUCATION = "교육",
  HEALTHCARE = "보건의료",
  IT = "IT",
  ENGINEERING = "공학",
  LEGAL = "법률",
  BUSINESS = "경영",
  FINANCE = "금융",
  ART = "예술",
  SCIENCE = "과학",
  PUBLIC_SERVICE = "공무원",
  SALES = "영업",
  SERVICE = "서비스",
  SPORTS = "스포츠",
  ETC = "기타",
}

@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column({ unique: true, length: 20 })
  id!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({
    type: "enum",
    enum: Position,
  })
  position!: Position;

  @Column({ length: 100, nullable: true })
  credentials?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}
