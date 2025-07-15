import { DataSource } from 'typeorm';
import config from './ormconfig';

export const AppDataSource = new DataSource(config);

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('MySQL 데이터베이스 연결 성공');
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    process.exit(1);
  }
};
