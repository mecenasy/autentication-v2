import { Module } from '@nestjs/common';
import { SmsModule } from './sms/sms.module';
// import { SmtpModule } from './smtp/smtp.module';
import { SmtpModule } from './smtp/smtp.module';

@Module({
  imports: [
    SmsModule,
    SmtpModule,
    //  SmtpModule
  ],
})
export class NotifyModule {}
