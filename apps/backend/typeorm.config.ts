// typeorm.config.ts

import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
  entities: ['dist/apps/backend/**/*.entity.js'],
  extra: process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
