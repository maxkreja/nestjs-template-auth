import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../app-config/app-config.module';
import { TokenEntity } from './entities/token.entity';
import { TokensService } from './tokens.service';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([TokenEntity])],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
