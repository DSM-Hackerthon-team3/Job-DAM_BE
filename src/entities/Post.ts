import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text")
  content!: string;

  @ManyToOne(() => User, (user) => user.posts)
  author!: User; // 작성자

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
