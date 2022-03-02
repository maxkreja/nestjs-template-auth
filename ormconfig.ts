import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) ?? 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(__dirname, 'src', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'src', 'migrations', '**', '*.{ts,js}')],
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
};
