import { AggregateRoot } from '@nestjs/cqrs';

export class SmsCodeEvent extends AggregateRoot {
  constructor(
    public readonly phoneNumber: string,
    public readonly code: number,
  ) {
    super();
    this.autoCommit = true;
  }
}
