import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

export const typeormConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isDev = configService.get<string>('env');

  return {
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    entities: [User],
    synchronize: true,
    logging: isDev === 'development' ? true : ['warn', 'error'],
  };
};
