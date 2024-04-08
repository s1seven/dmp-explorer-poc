import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base-entity';

@Entity()
export class User extends BaseEntity {
  // TODO: store auth0 user id
  @Index('user_email_index', { unique: true })
  @Column({ type: 'varchar', unique: true })
  email: string;
}
