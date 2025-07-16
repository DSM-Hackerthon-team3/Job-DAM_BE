import { Repository, DataSource } from "typeorm";
import { User, SchoolLevel } from "../../entities/User";
import { AppDataSource } from "../../config/data-source";

export class UserRepository {
  public repository = AppDataSource.getRepository(User);

  async createUser(userData: {
    id: string;
    password: string;
    schoolLevel?: SchoolLevel;
  }): Promise<User> {
    return this.repository.save(userData);
  }

  async findByIdx(idx: number): Promise<User | null> {
    return await this.repository.findOne({ where: { idx } });
  }

  async findByUserId(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.repository.update({ id }, { password: newPassword });
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<void> {
    await this.repository.update({ id }, updateData);
  }

  async deleteUser(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.repository.find();
  }

  async findBySchoolLevel(schoolLevel: SchoolLevel): Promise<User[]> {
    return await this.repository.find({ where: { schoolLevel } });
  }

  async existsByUserId(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async findUsersByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    return await this.repository
      .createQueryBuilder("user")
      .where("user.createdAt >= :startDate", { startDate })
      .andWhere("user.createdAt <= :endDate", { endDate })
      .getMany();
  }

  // async findRecentlyUpdatedUsers(limit: number = 10): Promise<User[]> {
  //   return await this.repository.find({
  //     order: { updatedAt: 'DESC' },
  //     take: limit
  //   });
  // }
}
