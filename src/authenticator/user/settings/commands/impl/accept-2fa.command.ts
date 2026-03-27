import { Command } from '@nestjs/cqrs';
import { StatusType } from 'src/authenticator/auth/login/dto/status.type';

export class Accept2faCommand extends Command<StatusType> {
  constructor(public readonly id: string) {
    super();
  }
}
