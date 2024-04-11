import { BaseEntity } from '../../../common/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Unit } from '../../../common/constants/constants';
import { CompanyEntity } from '../../companies/entities/company.entity';

@Entity()
export class BatchEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  lotNumber: string;

  @Column({ nullable: true })
  parentLotNumber: string;

  @Column()
  leadContent: number;

  @Column()
  mercuryContent: number;

  @Column()
  cadmiumContent: number;

  @ManyToOne(() => CompanyEntity, (company) => company.batches)
  company: CompanyEntity;

  @Column()
  isRoHSCompliant: boolean;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: Unit })
  unit: Unit;
}
