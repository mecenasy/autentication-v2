import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { LogoutCommand } from '../impl/logout.command';
import { InternalServerErrorException } from '@nestjs/common';
import { Handler } from 'src/common/handler/handler';

@CommandHandler(LogoutCommand)
export class LogoutHandler extends Handler<LogoutCommand, StatusType> {
  constructor() {
    super();
  }

  async execute({ userId, session }: LogoutCommand) {
    await new Promise<void>((resolve, reject) => {
      session.destroy((err) => {
        if (err) {
          reject(
            new InternalServerErrorException('Failed to destroy session.'),
          );
          this.logger.error(err);
        } else {
          resolve();
        }
      });
    });

    await this.cache.removeFromCache({
      identifier: userId,
      prefix: 'user-state',
    });

    return { status: AuthStatus.logout };
  }
}
