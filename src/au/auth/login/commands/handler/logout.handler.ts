import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { LogoutCommand } from '../impl/logout.command';
import { Handler } from 'src/common/handler/handler';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(LogoutCommand)
export class LogoutHandler extends Handler<LogoutCommand, StatusType> {
  constructor() {
    super();
  }

  async execute({ session }: LogoutCommand) {
    await new Promise<void>((resolve, reject) => {
      session.destroy((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session.'));
          this.logger.error(err);
        } else {
          resolve();
        }
      });
    });

    return { status: AuthStatus.logout };
  }
}
