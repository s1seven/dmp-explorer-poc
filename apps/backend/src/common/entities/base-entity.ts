import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class BaseEntity {
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @Column()
  createdOn: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @Column({ nullable: true })
  updatedOn: Date;
}
