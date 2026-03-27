import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './config.types';
import { redisConfig } from 'src/common/redis/config/redis.config';
import { sessionConfig } from './session.config';
import { postgresConfig } from 'src/common/postgres/config/postgres.config';
import { TypeConfigService } from './types.config.service';
import { appConfig } from './app.configs';
import { smsConfig } from 'src/autemticator/notify/sms/config/sms.configs';
import { smtpConfig } from 'src/autemticator/notify/smtp/config/smtp.configs';
import { jwtConfig } from './auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        jwtConfig,
        postgresConfig,
        sessionConfig,
        redisConfig,
        smsConfig,
        smtpConfig,
      ],
      validationSchema: configSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [TypeConfigService],
  exports: [ConfigModule, TypeConfigService],
})
export class ConfigsModule {}
