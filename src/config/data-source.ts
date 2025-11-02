import { DataSource } from "typeorm";
import { Post } from "../entities/Post";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "080516",
  database: "jobdam",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../entities/*.{js,ts}"],
});
