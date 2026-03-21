import { registerAs } from '@nestjs/config';

export interface SmsConfig {
  sid: string;
  token: string;
  phone: string;
  watsappPhoneTwilio: string;
  watsappPhoneMeta: string;
  watsappPhoneId: string;
  watsappBusinessId: string;
  watsappAccessToken: string;
  watsappVerifyToken: string;
}

export const smsConfig = registerAs(
  'sms',
  (): SmsConfig => ({
    sid: process.env.TWILO_SID ?? '',
    token: process.env.TWILO_TOKEN ?? '',
    phone: process.env.TWILO_PHONE ?? '',
    watsappPhoneTwilio: process.env.TWILO_WHATSAPP_PHONE ?? '',
    watsappPhoneMeta: process.env.WHATSAPP_PHONE ?? '',
    watsappPhoneId: process.env.WHATSAPP_PHONE_ID ?? '',
    watsappBusinessId: process.env.WHATSAPP_BUSINESS_ID ?? '',
    watsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? '',
    watsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? '',
  }),
);
