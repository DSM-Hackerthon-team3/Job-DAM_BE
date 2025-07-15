import { AppDataSource } from "../../config/data-source";
import { Comment } from "../../entities/Comment";

export class CommentRepository {
  private repository = AppDataSource.getRepository(Comment);

  async save(data: { postId: number; content: string }): Promise<Comment> {
    const comment = this.repository.create({
      content: data.content,
      post: { id: data.postId },
    });
    await this.repository.save(comment);
    return comment;
  }
}
