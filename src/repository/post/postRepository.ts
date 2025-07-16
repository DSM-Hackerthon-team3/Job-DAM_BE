import { AppDataSource } from "../../config/data-source";
import { Comment } from "../../entities/Comment";
import { Post } from "../../entities/Post";

export class PostRepository {
  private postRepo = AppDataSource.getRepository(Post);
  private commentRepo = AppDataSource.getRepository(Comment);

  async findById(id: number): Promise<Post | null> {
    return await this.postRepo.findOneBy({ id });
  }

  async findAllWithCommentCount(): Promise<
    { id: number; title: string; content: string; createdAt: Date; commentsCnt: number }[]
  > {
    return await this.postRepo
      .createQueryBuilder("post")
      .leftJoin("post.comments", "comment")
      .select("post.id", "id")
      .addSelect("post.title", "title")
      .addSelect("post.content", "content")
      .addSelect("post.createdAt", "createdAt")
      .addSelect("COUNT(comment.id)", "commentsCnt")
      .groupBy("post.id")
      .getRawMany();
  }

  async countCommentsByPostId(postId: number): Promise<number> {
    return await this.commentRepo.count({
      where: { post: { id: postId } },
    });
  }

  async save(data: { title: string; content: string }): Promise<Post> {
    const post = this.postRepo.create(data);
    return await this.postRepo.save(post);
  }

  async delete(id: number): Promise<void> {
    await this.postRepo.delete(id);
  }

  async update(id: number, content: string): Promise<void> {
    await this.postRepo.update(id, { content });
  }
}