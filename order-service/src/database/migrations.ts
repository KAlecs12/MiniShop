import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from '../config';
import { DatabaseService } from './database.service';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [DatabaseService],
})
class MigrationModule {}

async function migration(): Promise<DataSource> {
  const app = await NestFactory.createApplicationContext(MigrationModule);

  const databaseConfigService = app.get(DatabaseService);

  return new DataSource(
    databaseConfigService.createTypeOrmOptions() as DataSourceOptions,
  );
}

// eslint-disable-next-line
export default migration();
