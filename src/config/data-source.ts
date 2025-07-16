import { DataSource } from "typeorm";
import 'dotenv/config';
import { Post } from "../entities/Post";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jobdam",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../entities/*.{js,ts}"],
});
