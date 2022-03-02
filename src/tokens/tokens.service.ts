import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfigService } from '../app-config/app-config.service';
import { UserEntity } from '../users/entities/user.entity';
import { now, s } from '../util';
import { TokenEntity } from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokens: Repository<TokenEntity>,
    private readonly config: AppConfigService,
  ) {}

  async findByUserAndIdentifier(user: UserEntity | string, identifier: string) {
    return await this.tokens.findOne(
      { identifier },
      {
        relations: ['user'],
        where: { user },
      },
    );
  }

  async createWithUser(token: string, identifier: string, user: UserEntity) {
    const expiresAt = new Date(
      (now() + s(this.config.jwt.refreshTokenTTL)) * 1000,
    );

    const tokenEntity = this.tokens.create({
      token,
      identifier,
      user,
      expiresAt,
    });

    await this.tokens.save(tokenEntity);
  }

  async delete(token: TokenEntity) {
    await this.tokens.delete(token);
  }

  async cleanupTokens(user: UserEntity | string) {
    if (typeof user !== 'string') {
      user = user.id;
    }

    await this.tokens
      .createQueryBuilder()
      .delete()
      .where({ user })
      .andWhere('expiresAt <= :today', { today: new Date() })
      .execute();
  }

  async deleteAll(user: UserEntity | string) {
    if (typeof user !== 'string') {
      user = user.id;
    }

    await this.tokens.createQueryBuilder().delete().where({ user }).execute();
  }
}
