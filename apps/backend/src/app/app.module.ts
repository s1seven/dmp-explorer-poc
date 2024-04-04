import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from '../common/config/env.validation';
import { AuthModule } from '../auth/auth.module';
import { Auth0Module } from './auth0/auth0.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    UsersModule,
    AuthModule,
    // Auth0Module,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: ['dist/apps/backend/**/*.entity.js'],
        autoLoadEntities: true,
        ssl: configService.get<string>('NODE_ENV') === 'production',
        extra: configService.get<string>('NODE_ENV') === 'production' && {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        migrations: [],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
