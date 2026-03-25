import { QrChallengeHandler } from './gr-challenge.handler';
import { QrConfirmHandler } from './gr-confirm.handler';
import { QrOptionHandler } from './gr-option.handler';
import { QrLoginHandler } from './gr-login.handler';
import { QrRejectHandler } from './gr-reject.handler';

export const qrCodeCommands = [
  QrChallengeHandler,
  QrConfirmHandler,
  QrOptionHandler,
  QrLoginHandler,
  QrRejectHandler,
];
