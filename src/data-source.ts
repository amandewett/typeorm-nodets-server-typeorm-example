import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const AppDataSource: DataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    migrationsRun: false,
    namingStrategy: new SnakeNamingStrategy(),
    entities: ["src/entity/**/*.{ts,js}"],
    migrations: ["src/migration/**/*.{ts,js}"],
    subscribers: [],
})
