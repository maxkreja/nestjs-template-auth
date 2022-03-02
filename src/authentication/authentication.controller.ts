import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';
import JwtAuthGuard from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import RefreshAuthGuard from './guards/refresh.guard';
import { UserWithIdentifier } from './strategies/jwt.strategy';
import { UserWithToken } from './strategies/refresh.strategy';

interface RequestWithUser extends Request {
  user: UserEntity;
}

interface RequestWithIdentifier extends Request {
  user: UserWithIdentifier;
}

interface RequestWithToken extends Request {
  user: UserWithToken;
}

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly auth: AuthenticationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async root(@Req() req: RequestWithIdentifier) {
    req.res.status(200).send();
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.auth.createUser(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Body() body: LoginDto) {
    return this.auth.createTokenPair(req.user, randomUUID());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: RequestWithIdentifier) {
    return this.auth.logout(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logoutWithBody(
    @Req() req: RequestWithIdentifier,
    @Body() body: LogoutDto,
  ) {
    return this.auth.logout(req.user, body.globally);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: RequestWithToken, @Body() body: RefreshDto) {
    return this.auth.consumeRefreshToken(req.user.token, req.user.expires);
  }
}
