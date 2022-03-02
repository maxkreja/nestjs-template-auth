import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig, JwtConfig } from '../config';

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);

  constructor(private readonly configService: ConfigService) {
    const change = (name: string) =>
      `Environment variable ${name} should be changed to a long, random string`;

    if (this.jwt.accessTokenSecret === 'CHANGEME') {
      this.logger.warn(change('JWT_ACCESS_SECRET'));
    }

    if (this.jwt.refreshTokenSecret === 'CHANGEME') {
      this.logger.warn(change('JWT_REFRESH_SECRET'));
    }

    if (this.jwt.refreshTokenSecret === this.jwt.accessTokenSecret) {
      this.logger.warn(
        'Environment variable JWT_ACCESS_SECRET and JWT_REFRESH_TOKEN should have different values',
      );
    }
  }

  get database(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>('database');
  }

  get jwt(): JwtConfig {
    return this.configService.get<JwtConfig>('jwt');
  }
}
