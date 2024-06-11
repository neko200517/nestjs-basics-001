import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { resolve } from 'path';
import { Item } from './entities/item.entity';
import { User } from './entities/user.entity';

const migrationsPath = resolve(__dirname, '../migration');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: true, // 本番環境ではfalse推奨
  logging: false,
  entities: [Item, User],
  migrations: [`${migrationsPath}/*.{ts,js}`],
});
