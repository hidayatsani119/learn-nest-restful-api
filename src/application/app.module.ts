import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { typeormConfig } from '../config/typeorm.config';
import { WinstonConfig } from '../config/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const winstonLogger = new WinstonConfig(configService);
        return typeormConfig(configService, winstonLogger);
      },
    }),
    UserModule,
  ],
  providers: [
    {
      provide: Logger,
      useClass: WinstonConfig,
    },
  ],
  exports: [Logger],
})
export class AppModule {}
