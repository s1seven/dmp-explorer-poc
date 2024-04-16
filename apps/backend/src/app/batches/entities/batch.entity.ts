import { BaseEntity } from '../../../common/entities/base-entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Unit } from '../../../common/constants/constants';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { Type } from 'class-transformer';

export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Entity()
@Tree('closure-table')
export class BatchEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  lotNumber: string;

  @Column()
  leadContent: number;

  @Column()
  mercuryContent: number;

  @Column()
  cadmiumContent: number;

  @ManyToOne(() => CompanyEntity, { nullable: false })
  @Type(() => CompanyEntity)
  company: CompanyEntity;

  @Column()
  isRoHSCompliant: boolean;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: Unit })
  unit: Unit;

  @Column({ type: 'enum', enum: Status })
  status: Status = Status.ACCEPTED;

  @TreeChildren()
  subBatches: BatchEntity[];

  @TreeParent()
  parent: BatchEntity;
}
