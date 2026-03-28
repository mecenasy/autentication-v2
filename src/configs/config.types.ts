import { PostgresConfig } from 'src/common/postgres/config/postgres.config';
import { AppConfig } from './app.configs';
import * as Joi from 'joi';
import { SessionConfig } from './session.config';
import { RedisConfig } from 'src/common/redis/config/redis.config';
import { SmsConfig } from 'src/authenticator/notify/sms/config/sms.configs';
import { SmtpConfig } from 'src/authenticator/notify/smtp/config/smtp.configs';
import { JwtConfig } from './auth.config';

export interface ConfigTypes {
  app: AppConfig;
  db: PostgresConfig;
  session: SessionConfig;
  redis: RedisConfig;
  sms: SmsConfig;
  smtp: SmtpConfig;
  jwt: JwtConfig;
}

export const configSchema = Joi.object({
  REDIS_URL: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  GRPC_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  MODE: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  SESSION_NAME: Joi.string().required(),
  SESSION_MAX_AGE: Joi.string().required(),
  SESSION_HTTP_ONLY: Joi.string().required(),
  SESSION_FOLDER: Joi.string().required(),
  ALLOWED_ORIGIN: Joi.string().required(),
  APP_URL: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().required(),
  ADMIN_PHONE: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),

  TWILO_SID: Joi.string().required(),
  TWILO_TOKEN: Joi.string().required(),
  TWILO_PHONE: Joi.string().required(),
  TWILO_WHATSAPP_PHONE: Joi.string().required(),

  WHATSAPP_PHONE: Joi.string().required(),
  WHATSAPP_ACCESS_TOKEN: Joi.string().required(),
  WHATSAPP_PHONE_ID: Joi.string().required(),
  WHATSAPP_BUSINESS_ID: Joi.string().required(),

  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.string().required(),
  SMTP_FROM: Joi.string().required(),
  SMTP_USER: Joi.string().required(),

  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRE_AT: Joi.string().required(),
});
