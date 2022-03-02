import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../app-config/app-config.service';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

export interface UserWithIdentifier {
  user: UserEntity;
  identifier: string;
}

export interface TokenPayload {
  user: string;
  identifier: string;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: AppConfigService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.accessTokenSecret,
    });
  }

  async validate(payload: TokenPayload): Promise<UserWithIdentifier> {
    const user = await this.users.findById(payload.user);

    if (!user) {
      return null;
    }

    return { user, identifier: payload.identifier };
  }
}
