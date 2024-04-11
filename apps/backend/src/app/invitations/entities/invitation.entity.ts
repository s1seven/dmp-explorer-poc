import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base-entity';
import { CompanyEntity } from '../../companies/entities/company.entity';

@Entity()
export class InvitationEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  emailToInvite: string;

  @ManyToOne(() => CompanyEntity, (company) => company.id)
  company: CompanyEntity;
}
