import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "유저네임",
  password: "패스워드",
  database: "디비이름",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../entities/*.{js,ts}"],
});
