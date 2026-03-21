import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { SmsCodeEvent } from './commands/dto/sms-code.event';
import { SmsCodeCommand } from './commands/impl/sms-code.command';

@Injectable()
export class SmsSaga {
  constructor() {}
  @Saga()
  sendCode = (events$: Observable<SmsCodeEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SmsCodeEvent),
      map(({ code, phoneNumber }) => new SmsCodeCommand(phoneNumber, code)),
    );
  };
}
