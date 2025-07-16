import { Repository, DataSource } from 'typeorm';
import { User, SchoolLevel } from '../../entities/User';

export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  
  async createUser(userData: {
    id: string;
    password: string;
    schoolLevel?: SchoolLevel;
  }): Promise<User> {
    const user = this.create(userData);
    return await this.save(user);
  }
  
  async findByUserId(id: string): Promise<User | null> {
    return await this.findOne({ where: { id } });
  }
  
  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.update({ id }, { password: newPassword });
  }
  
  async updateUser(id: string, updateData: Partial<User>): Promise<void> {
    await this.update({ id }, updateData);
  }
  
  async deleteUser(id: string): Promise<void> {
    await this.delete({ id });
  }
  
  async findAllUsers(): Promise<User[]> {
    return await this.find();
  }
  
  async findBySchoolLevel(schoolLevel: SchoolLevel): Promise<User[]> {
    return await this.find({ where: { schoolLevel } });
  }
  
  async existsByUserId(id: string): Promise<boolean> {
    const count = await this.count({ where: { id } });
    return count > 0;
  }
  
  async findUsersByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    return await this.createQueryBuilder('user')
      .where('user.createdAt >= :startDate', { startDate })
      .andWhere('user.createdAt <= :endDate', { endDate })
      .getMany();
  }
  
  async findRecentlyUpdatedUsers(limit: number = 10): Promise<User[]> {
    return await this.find({
      order: { updatedAt: 'DESC' },
      take: limit
    });
  }
}