import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const host = this.config.getOrThrow<string>('database.host');
    const port = this.config.getOrThrow<number>('database.port');
    const username = this.config.getOrThrow<string>('database.username');
    const password = this.config.getOrThrow<string>('database.password');
    const database = this.config.get<string>('database.database');
    const sync = this.config.get<string>('database.sync');

    return {
      type: 'postgres',

      // connection options
      host,
      port,
      username,
      password,
      database,

      ssl:
        this.config.get<string>('DATABASE_SSL', 'false') === 'true'
          ? { rejectUnauthorized: false }
          : false,

      // migrations options
      migrationsRun: sync === 'false',
      migrations: [
        path.join(__dirname, '/migrations/*.{ts,js}'),
        path.join(__dirname, '/seeds/*.{ts,js}'),
      ],

      // entity related options
      synchronize: sync === 'true',
      autoLoadEntities: true,
    };
  }
}
