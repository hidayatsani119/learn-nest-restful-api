import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class WinstonConfig implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private configService: ConfigService) {
    const env = this.configService.get<string>('env') || 'development';

    // Log level logic
    const logLevel = env === 'production' ? 'error' : 'debug';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, stack?: string, context?: string) {
    this.logger.error(message, { stack, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }
}
