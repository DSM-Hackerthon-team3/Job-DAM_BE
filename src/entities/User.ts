import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";
import { SchoolLevel } from "./enum/SchoolLevel";
import { Gender } from "./enum/Gender";
import { Role } from "./enum/Role";
import { Comment } from "./Comment";

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

  @Column({
    type: "enum",
    enum: Gender,
  })
  gender!: Gender;

  @Column({
    type: "enum",
    enum: Role,
  })
  role: Role = Role.USER;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[];
}
