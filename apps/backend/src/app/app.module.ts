import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from '../common/config/env.validation';
import { AuthModule } from '../auth/auth.module';
import { join } from 'node:path';
import { BatchesModule } from './batches/batches.module';
import { InitialMigration1712761023143 } from '../migrations/1712761023143-InitialMigration';
import { UpdateBatches1712836157665 } from '../migrations/1712836157665-UpdateBatches';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../dist/apps/frontend/browser/'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        ssl: configService.get<string>('NODE_ENV') === 'production',
        extra: configService.get<string>('NODE_ENV') === 'production' && {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        synchronize: false,
        logging: true,
        migrationsTableName: 'typeorm_migrations',
        migrations: [InitialMigration1712761023143, UpdateBatches1712836157665],
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    BatchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
