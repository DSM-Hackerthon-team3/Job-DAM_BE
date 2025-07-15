import { AppDataSource } from "../../config/data-source";
import { Post } from "../../entities/Post";

export class PostRepository {
  private repository = AppDataSource.getRepository(Post);

  async findAll(): Promise<Post[]> {
    return this.repository.find({
      order: { createdAt: "DESC" },
      relations: ["comments"],
    });
  }

  async findById(id: number): Promise<Post | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["comments"],
    });
  }

  async save(data: { title: string; content: string }): Promise<Post> {
    const post = this.repository.create(data);
    return await this.repository.save(post);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async update(id: number, content: string): Promise<void> {
    await this.repository.update(id, { content });
  }
}
