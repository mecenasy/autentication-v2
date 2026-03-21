import { Query } from '@nestjs/cqrs';
import { StatusType } from '../../dto/status.type';

export class StatusAuthCommand extends Query<StatusType> {
  constructor(public readonly userId: string) {
    super();
  }
}
