import { BaseEntity } from '../../../common/entities/base-entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Unit } from '../../../common/constants/constants';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';

export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Entity()
export class BatchEntity extends OmitType(BaseEntity, ['id']) {
  @PrimaryColumn({ type: 'varchar', unique: true })
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

  @ManyToOne(() => BatchEntity, { nullable: true })
  parent: BatchEntity;

  @OneToMany(() => BatchEntity, (batch) => batch.parent)
  subBatches: BatchEntity[];
}
