import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";
import { JobPosition } from "./enum/Position";
import { Gender } from "./enum/Gender";
import { Role } from "./enum/Role";

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
    enum: JobPosition,
  })
  position!: JobPosition;

  @Column({
    type: "enum",
    enum: Gender,
  })
  gender!: Gender;

  @Column({
    type: "enum",
    enum: Role,
  })
  role: Role = Role.ADMIN;

  @Column()
  point: number = 0;

  @Column()
  rateCnt: number = 0;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}

