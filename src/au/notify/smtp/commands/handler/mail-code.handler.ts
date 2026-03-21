import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MailCodeCommand } from '../impl/mail-code.command';
import { MailerService } from '@nestjs-modules/mailer';

@CommandHandler(MailCodeCommand)
export class MailCodeHandler implements ICommandHandler<MailCodeCommand> {
  private logger: Logger;
  constructor(private mailerService: MailerService) {
    this.logger = new Logger(MailCodeHandler.name);
  }

  async execute({ code, email }: MailCodeCommand) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your verification code',
        template: './verification',
        context: {
          code: code.toString(),
        },
      });
    } catch (error) {
      this.logger.error('Failed to send OTP email.', error);
    }
  }
}
