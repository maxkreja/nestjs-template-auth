import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';
import { TokenEntity } from '../tokens/entities/token.entity';
import { TokensService } from '../tokens/tokens.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { compareHash } from '../util';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { TokenPayload, UserWithIdentifier } from './strategies/jwt.strategy';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly config: AppConfigService,
    private readonly users: UsersService,
    private readonly tokens: TokensService,
    private readonly jwt: JwtService,
  ) {}

  async createUser(body: CreateUserDto) {
    try {
      const user = await this.users.create(body);
      return user;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('user exists');
      }

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async validatePassword(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    const match = await compareHash(password, user?.password);

    if (!user || !match) throw new UnauthorizedException();

    this.tokens.cleanupTokens(user);

    return user;
  }

  async createTokenPair(
    user: UserEntity,
    identifier: string,
  ): Promise<LoginResponseDto> {
    const payload: TokenPayload = { user: user.id, identifier };

    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    await this.tokens.createWithUser(refreshToken, identifier, user);

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(user: string, identifier: string, token: string) {
    const tokenEntity = await this.tokens.findByUserAndIdentifier(
      user,
      identifier,
    );
    const match = await compareHash(token, tokenEntity?.token);

    if (!tokenEntity || !match) {
      throw new UnauthorizedException();
    }

    this.tokens.cleanupTokens(user);

    return tokenEntity;
  }

  async consumeRefreshToken(
    token: TokenEntity,
    expires?: boolean,
  ): Promise<RefreshResponseDto> {
    const { user, identifier } = token;

    const payload: TokenPayload = {
      user: user.id,
      identifier: identifier,
    };

    const accessToken = this.createAccessToken(payload);
    const response: RefreshResponseDto = { accessToken };

    if (expires) {
      const newToken = this.createRefreshToken(payload);
      response.refreshToken = newToken;

      await this.tokens.createWithUser(newToken, identifier, user);
      await this.tokens.delete(token);
    }

    return response;
  }

  async logout(user: UserWithIdentifier, globally?: boolean) {
    if (globally) {
      await this.tokens.deleteAll(user.user);
      return;
    }

    await this.tokens.cleanupTokens(user.user);

    const token = await this.tokens.findByUserAndIdentifier(
      user.user,
      user.identifier,
    );

    if (token) await this.tokens.delete(token);
  }

  private createAccessToken(payload: TokenPayload) {
    return this.jwt.sign(payload, {
      secret: this.config.jwt.accessTokenSecret,
      expiresIn: this.config.jwt.accessTokenTTL,
    });
  }

  private createRefreshToken(payload: TokenPayload) {
    return this.jwt.sign(payload, {
      secret: this.config.jwt.refreshTokenSecret,
      expiresIn: this.config.jwt.refreshTokenTTL,
    });
  }
}
