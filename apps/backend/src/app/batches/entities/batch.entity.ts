import { BaseEntity } from "../../../common/entities/base-entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Batch extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  lotNumber: string;

  @Column()
  leadContent: number;

  @Column()
  mercuryContent: number;

  @Column()
  cadmiumContent: number;

  owner: string;
  
  @Column()
  isRoHSCompliant: boolean;
}
