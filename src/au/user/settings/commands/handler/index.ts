import { Verify2faHandler } from './verify-2fa.handler';
import { Accept2faHandler } from './accept-2fa.handler';
import { Reject2faHandler } from './reject-2fa.handler';

export const commandHandlers = [
  Accept2faHandler,
  Reject2faHandler,
  Verify2faHandler,
];
