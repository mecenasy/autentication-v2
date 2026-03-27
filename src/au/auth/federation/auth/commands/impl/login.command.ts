import { Command } from '@nestjs/cqrs';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { Security } from 'src/common/interceptors/security-context.interceptor';

export class LoginFederationCommand extends Command<StatusType> {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly token: string,
    public readonly security: Security,
  ) {
    super();
  }
}
