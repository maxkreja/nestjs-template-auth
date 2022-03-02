import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TokenEntity } from '../../tokens/entities/token.entity';
import { secure } from '../../util';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  @Index()
  username: string;

  @ApiHideProperty()
  @Column({ nullable: false })
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @ApiHideProperty()
  @OneToMany(() => TokenEntity, token => token.user)
  @Exclude()
  tokens: TokenEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await secure(this.password);
  }
}
