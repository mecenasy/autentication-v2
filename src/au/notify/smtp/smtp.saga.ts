import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { MailCodeCommand } from './commands/impl/mail-code.command';
import { MailCodeEvent } from './dto/mail-code.event';

@Injectable()
export class SmtpSaga {
  constructor() {}
  @Saga()
  sendCode = (events$: Observable<MailCodeEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(MailCodeEvent),
      map(({ code, email }) => new MailCodeCommand(email, code)),
    );
  };
}
