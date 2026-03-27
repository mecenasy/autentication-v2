import { Command } from '@nestjs/cqrs';
import { StatusType } from 'src/autemticator/auth/login/dto/status.type';

export class VerifyTfaFederationCommand extends Command<StatusType> {
  constructor(
    public readonly token: string,
    public readonly email: string,
    public readonly code: string,
  ) {
    super();
  }
}
