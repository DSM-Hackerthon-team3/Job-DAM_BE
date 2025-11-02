import { DataSource } from "typeorm";
import { User } from "../../entities/User";
import { SchoolLevel } from "../../entities/enum/SchoolLevel";

export class UserRepository {
  private repository: any;

  constructor(dataSource?: DataSource) {
    if (dataSource) {
      this.repository = dataSource.getRepository(User);
    }
  }

  async findByUserId(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async save(userData: any): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async updateUser(id: string, updateData: any): Promise<void> {
    await this.repository.update({ id }, updateData);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.repository.update({ id }, { password: hashedPassword });
  }

  async existsByUserId(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}
