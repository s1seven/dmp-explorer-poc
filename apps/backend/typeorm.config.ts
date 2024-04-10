import 'reflect-metadata';
// typeorm.config.ts

import { DataSource } from 'typeorm';
import { UserEntity } from './src/app/users/entities/user.entity';
import { BatchEntity } from './src/app/batches/entities/batch.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
  entities: [UserEntity, BatchEntity],
  extra: process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
