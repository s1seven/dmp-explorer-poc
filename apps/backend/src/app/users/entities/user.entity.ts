import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base-entity';

@Entity()
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  // TODO: use uuid or auth0 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Index('user_email_index', { unique: true })
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;
}
