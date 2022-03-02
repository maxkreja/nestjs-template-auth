import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from '../../users/entities/user.entity';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthenticationService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    });
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    return this.auth.validatePassword(username, password);
  }
}
