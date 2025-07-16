import { Repository, DataSource } from "typeorm";
import { Admin } from "../../entities/Admin";
import { JobPosition } from "../../entities/enum/Position";

export class AdminRepository extends Repository<Admin> {
  constructor(private dataSource: DataSource) {
    super(Admin, dataSource.createEntityManager());
  }

  async createAdmin(adminData: {
    id: string;
    password: string;
    position?: JobPosition;
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

  async findByPosition(position: JobPosition): Promise<Admin[]> {
    return await this.find({ where: { position } });
  }
}
