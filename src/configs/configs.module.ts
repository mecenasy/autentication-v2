import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './config.types';
import { redisConfig } from 'src/common/redis/config/redis.config';
import { sessionConfig } from './session.config';
import { postgresConfig } from 'src/common/postgres/config/postgres.config';
import { TypeConfigService } from './types.config.service';
import { appConfig } from './app.configs';
import { smsConfig } from 'src/au/notify/sms/config/sms.configs';
import { smtpConfig } from 'src/au/notify/smtp/config/smtp.configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
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
