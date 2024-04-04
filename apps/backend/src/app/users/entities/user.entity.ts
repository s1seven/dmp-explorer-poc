import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base-entity';

@Entity()
export class User extends BaseEntity {
  // TODO: use uuid or auth0 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Index('user_email_index', { unique: true })
  @Column({ type: 'varchar', unique: true })
  email: string;
}
