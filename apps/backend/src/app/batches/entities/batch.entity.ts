import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Unit } from '../../../common/constants/constants';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { Type } from 'class-transformer';

export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Entity()
// TODO: fix issue with typeorm migrations and OmitType
export class BatchEntity {
  @PrimaryColumn({ type: 'varchar', unique: true })
  lotNumber: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt?: Date;

  @Column({ type: 'float' })
  leadContent: number;

  @Column({ type: 'float' })
  mercuryContent: number;

  @Column({ type: 'float' })
  cadmiumContent: number;

  @ManyToOne(() => CompanyEntity, { nullable: false })
  @Type(() => CompanyEntity)
  company: CompanyEntity;

  @Column()
  isRoHSCompliant: boolean;

  @Column({ nullable: true })
  hasJson?: boolean;

  @Column({ nullable: true })
  hasPDF?: boolean;

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
