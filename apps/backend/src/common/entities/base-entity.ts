import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = undefined;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt?: Date;
}
