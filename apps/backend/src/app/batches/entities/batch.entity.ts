import { BaseEntity } from '../../../common/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Unit } from '../../../common/constants/constants';

@Entity()
export class BatchEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  lotNumber: string;

  @Column()
  leadContent: number;

  @Column()
  mercuryContent: number;

  @Column()
  cadmiumContent: number;

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.batches)
  owner: UserEntity;

  @Column()
  isRoHSCompliant: boolean;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: Unit })
  unit: Unit;
}
