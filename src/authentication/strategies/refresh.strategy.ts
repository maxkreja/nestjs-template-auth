import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { StringValue } from 'ms';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../app-config/app-config.service';
import { TokenEntity } from '../../tokens/entities/token.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { now, s } from '../../util';
import { AuthenticationService } from '../authentication.service';
import { TokenPayload } from './jwt.strategy';

export interface UserWithToken {
  user: UserEntity;
  token: TokenEntity;
  expires: boolean;
}

interface RequestWithRefreshDto extends Request {
  body: {
    refreshToken: string;
  };
}

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly config: AppConfigService,
    private readonly auth: AuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: config.jwt.refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestWithRefreshDto,
    payload: TokenPayload,
  ): Promise<UserWithToken> {
    const { user, identifier, exp } = payload;

    const expires =
      exp - now() < s(this.config.jwt.tokenIssueDelta as StringValue);

    const refreshToken = req.body.refreshToken;
    const token = await this.auth.validateRefreshToken(
      user,
      identifier,
      refreshToken,
    );

    if (!token) {
      return null;
    }

    return { expires, token, user: token.user };
  }
}
