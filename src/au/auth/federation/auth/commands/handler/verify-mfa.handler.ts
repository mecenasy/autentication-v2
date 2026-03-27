import { Handler } from 'src/common/handler/handler';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { VerifyMfaFederationCommand } from '../impl/verify-mfa.command';
import { LoginProcessCache } from '../../../type/login-process';
import { AuthStatus } from 'src/au/auth/types/login-status';

@CommandHandler(VerifyMfaFederationCommand)
export class VerifyMfaFederationHandler extends Handler<
  VerifyMfaFederationCommand,
  StatusType
> {
  constructor() {
    super();
  }
  async execute({
    code,
    token,
  }: VerifyMfaFederationCommand): Promise<StatusType> {
    const loginProcess = await this.cache.getFromCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
    });

    if (loginProcess?.type !== 'login code') {
      throw new BadRequestException('Login process not found');
    }

    if (loginProcess?.code !== code) {
      await this.cache.removeFromCache({
        identifier: token,
        prefix: 'login-process',
      });
      return { status: AuthStatus.logout };
    }

    await this.cache.saveInCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
      data: { type: 'login success', userId: loginProcess.userId ?? '' },
      EX: 60,
    });

    return { status: AuthStatus.login };
  }
}
