import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base-entity';
import { BatchEntity } from '../../batches/entities/batch.entity';

@Entity()
export class UserEntity extends BaseEntity {
  // TODO: store auth0 user id?
  @Index('user_email_index', { unique: true })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @OneToMany(() => BatchEntity, (batch) => batch.owner)
  batches: BatchEntity[];
}
