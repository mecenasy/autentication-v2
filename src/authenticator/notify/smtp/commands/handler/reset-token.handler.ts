import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetTokenCommand } from '../impl/reset-token.command';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';

@CommandHandler(ResetTokenCommand)
export class ResetTokenHandler implements ICommandHandler<ResetTokenCommand> {
  private logger: Logger;
  constructor(
    private mailerService: MailerService,
    private configService: TypeConfigService,
  ) {
    this.logger = new Logger(ResetTokenHandler.name);
  }

  async execute({ token, email }: ResetTokenCommand) {
    const frontendUrl = this.configService.get<AppConfig>('app')?.clientUrl;
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password',
        template: './reset-password',
        context: {
          url: resetUrl,
        },
      });
    } catch (error) {
      this.logger.error('Failed to send reset password email.', error);
    }
  }
}
