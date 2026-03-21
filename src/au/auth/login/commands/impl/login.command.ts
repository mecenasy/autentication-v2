import { Command } from '@nestjs/cqrs';
import { StatusType } from '../../dto/status.type';

export class LoginCommand extends Command<StatusType> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
