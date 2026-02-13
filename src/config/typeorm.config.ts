import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Logger as TypeOrmLoggerInterface } from 'typeorm';
import { LoggerService } from '@nestjs/common';

export class TypeOrmLoggerConfig implements TypeOrmLoggerInterface {
  constructor(private readonly logger: LoggerService) {}

  logQuery(query: string, parameters?: any[]) {
    // Pakai optional chaining (?.) agar tidak crash jika logger belum siap
    this.logger?.log?.(
      `Query: ${query} -- Parameters: ${JSON.stringify(parameters)}`,
      'TypeORM',
    );
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.logger?.error?.(
      `Query Error: ${error}`,
      `Query: ${query} -- Params: ${JSON.stringify(parameters)}`,
      'TypeORM',
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger?.warn?.(
      `Slow Query [${time}ms]: ${query} -- Params: ${JSON.stringify(parameters)}`,
      'TypeORM',
    );
  }

  logSchemaBuild(message: string) {
    this.logger?.log?.(message, 'TypeORM');
  }

  logMigration(message: string) {
    this.logger?.log?.(message, 'TypeORM');
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    if (level === 'warn') this.logger?.warn?.(message, 'TypeORM');
    else this.logger?.log?.(message, 'TypeORM');
  }
}

export const typeormConfig = (
  configService: ConfigService,
  nestLogger: LoggerService,
): TypeOrmModuleOptions => {
  const typeormLogger = new TypeOrmLoggerConfig(nestLogger);
  const isProduction = configService.get<string>('env') === 'production';

  return {
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    entities: [User],
    synchronize: !isProduction, // Only auto-sync in development
    logging: !isProduction, // Only log queries in development
    logger: typeormLogger,
  };
};
