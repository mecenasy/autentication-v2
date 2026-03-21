import { AggregateRoot } from '@nestjs/cqrs';

export class MailCodeEvent extends AggregateRoot {
  constructor(
    public readonly email: string,
    public readonly code: number,
  ) {
    super();
    this.autoCommit = true;
  }
}
