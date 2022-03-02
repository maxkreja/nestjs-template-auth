import { IsBoolean, IsOptional } from 'class-validator';

export class LogoutDto {
  @IsBoolean()
  @IsOptional()
  globally?: boolean;
}
