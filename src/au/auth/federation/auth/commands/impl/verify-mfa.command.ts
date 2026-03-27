import { Command } from '@nestjs/cqrs';
import { StatusType } from 'src/au/auth/login/dto/status.type';

export class VerifyMfaFederationCommand extends Command<StatusType> {
  constructor(
    public readonly token: string,
    public readonly email: string,
    public readonly code: number,
  ) {
    super();
  }
}
