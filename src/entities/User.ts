import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";

export enum SchoolLevel {
  초등학교 = "초등학교",
  중학교 = "중학교",
  고등학교 = "고등학교",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column({ unique: true, length: 20 })
  id!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({
    type: "enum",
    enum: SchoolLevel,
  })
  schoolLevel!: SchoolLevel;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}
