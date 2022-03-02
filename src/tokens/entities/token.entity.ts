import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { secure } from '../../util';

@Entity()
@Index(['user', 'identifier'])
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'uuid' })
  identifier: string;

  @Column({ nullable: false })
  token: string;

  @ManyToOne(() => UserEntity, user => user.tokens)
  user: UserEntity;

  @Column({ nullable: false })
  expiresAt: Date;

  @BeforeInsert()
  async hashToken() {
    this.token = await secure(this.token);
  }
}
