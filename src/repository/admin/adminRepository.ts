import { Repository, DataSource } from 'typeorm';
import { Admin, Position } from '../../entities/Admin';

export class AdminRepository extends Repository<Admin> {
  constructor(private dataSource: DataSource) {
    super(Admin, dataSource.createEntityManager());
  }
  
  async createAdmin(adminData: {
    id: string;
    password: string;
    position?: Position;
    credentials?: string;
  }): Promise<Admin> {
    const admin = this.create(adminData);
    return await this.save(admin);
  }
  
  async findByAdminId(id: string): Promise<Admin | null> {
    return await this.findOne({ where: { id } });
  }
  
  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.update({ id }, { password: newPassword });
  }
  
  async updateAdmin(id: string, updateData: Partial<Admin>): Promise<void> {
    await this.update({ id }, updateData);
  }
  
  async deleteAdmin(id: string): Promise<void> {
    await this.delete({ id });
  }
  
  async findAllAdmins(): Promise<Admin[]> {
    return await this.find();
  }
  
  async existsByAdminId(id: string): Promise<boolean> {
    const count = await this.count({ where: { id } });
    return count > 0;
  }
  
  async findByPosition(position: Position): Promise<Admin[]> {
    return await this.find({ where: { position } });
  }
  
  async findByCredentials(credentials: string): Promise<Admin[]> {
    return await this.find({ where: { credentials } });
  }
}