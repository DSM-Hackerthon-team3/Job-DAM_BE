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

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findById(id: number): Promise<Comment | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(comment: Comment): Promise<Comment> {
    return this.repository.save(comment);
  }
}
