import { Module } from '@nestjs/common';
import { SmsSaga } from './sms.saga';
import { HttpModule } from '@nestjs/axios';
import { TypeConfigService } from 'src/configs/types.config.service';
import { SmsCodeHandler } from './commands/handler/sms-code.handler';

@Module({
  imports: [HttpModule],
  providers: [SmsSaga, SmsCodeHandler, TypeConfigService],
})
export class SmsModule {}
