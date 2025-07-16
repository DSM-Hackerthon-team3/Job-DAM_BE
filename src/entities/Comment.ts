import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";
import { Admin } from "./Admin";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  content!: string;

  @ManyToOne(() => Admin)
  author!: Admin;

  @ManyToOne(() => Post, (post) => post.comments)
  post!: Post;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  isRated: Boolean = false;

  @Column({ type: "int", nullable: true })
  rating?: number;

  @ManyToOne(() => User, { nullable: true })
  ratedBy?: User;
}
