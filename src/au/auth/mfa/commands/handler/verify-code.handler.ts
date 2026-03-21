import { Handler } from 'src/common/handler/handler';
import {
  VERIFY_MFA_PROXY_SERVICE_NAME,
  VerifyMfaProxyServiceClient,
} from 'src/proto/verify-code';
import { VerifyCodeCommand } from '../impl/verify-code.command';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';

@CommandHandler(VerifyCodeCommand)
export class VerifyCodeHandler extends Handler<
  VerifyCodeCommand,
  StatusType,
  VerifyMfaProxyServiceClient
> {
  constructor() {
    super(VERIFY_MFA_PROXY_SERVICE_NAME);
  }
  async execute({
    code,
    email,
    session,
  }: VerifyCodeCommand): Promise<StatusType> {
    const verified = await this.cache.verifyInCache({
      identifier: email,
      data: code,
    });

    const { userId } = await lastValueFrom(
      this.gRpcService.getUserId({ email }),
    );

    session.user_id = userId;

    if (verified) {
      return { status: AuthStatus.login };
    } else {
      return { status: AuthStatus.logout };
    }
  }
}
