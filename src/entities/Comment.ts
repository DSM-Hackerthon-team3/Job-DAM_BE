import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Post } from "./Post";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  content!: string;

  // @ManyToOne(() => User, (user) => user.comments)
  // author: User; // 작성자

  @ManyToOne(() => Post, (post) => post.comments)
  post!: Post;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  isRated: Boolean = false;
}
