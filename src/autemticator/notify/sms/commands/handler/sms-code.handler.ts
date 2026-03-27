import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TypeConfigService } from 'src/configs/types.config.service';
import { Twilio } from 'twilio';
import { Logger } from '@nestjs/common';
import { SmsConfig } from '../../config/sms.configs';
import { SmsCodeCommand } from '../impl/sms-code.command';

@CommandHandler(SmsCodeCommand)
export class SmsCodeHandler implements ICommandHandler<SmsCodeCommand> {
  private client: Twilio;
  private logger: Logger;
  constructor(private readonly configService: TypeConfigService) {
    const config = configService.get<SmsConfig>('sms');

    this.client = new Twilio(config?.sid, config?.token);
    this.logger = new Logger(SmsCodeHandler.name);
  }

  async execute({ code, phoneNumber }: SmsCodeCommand) {
    try {
      await this.client.messages.create({
        body: `Your code is: ${code}`,
        from: this.configService.get<SmsConfig>('sms')?.phone,
        to: phoneNumber,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
