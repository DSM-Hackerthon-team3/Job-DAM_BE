import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Comment } from "./Comment";
import { Admin } from "./Admin";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text")
  content!: string;

  @ManyToOne(() => Admin, (admin) => admin.posts)
  author!: Admin;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
