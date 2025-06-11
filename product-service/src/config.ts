import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'mysecretpassword',
  database: process.env.DATABASE_NAME || 'postgres',
  sync: process.env.DATABASE_SYNC || 'false',
}));
