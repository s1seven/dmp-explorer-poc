import { BaseEntity } from '../../../common/entities/base-entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BatchEntity } from '../../batches/entities/batch.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { InvitationEntity } from '../../invitations/entities/invitation.entity';

@Entity()
export class CompanyEntity extends BaseEntity {
  @Index('company_vat_index', { unique: true })
  @Column({ type: 'varchar', unique: true })
  VAT: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => BatchEntity, (batch) => batch.company)
  batches: BatchEntity;

  @OneToMany(() => UserEntity, (user) => user.company)
  users: UserEntity;

  @OneToMany(() => InvitationEntity, (invitation) => invitation.company)
  invitation: InvitationEntity;
}
