import { LoginFederationHandler } from './login.handler';
import { VerifyMfaFederationHandler } from './verify-mfa.handler';
import { VerifyTfaFederationHandler } from './verify-tfa.handler';
import { VerifyTokenFederationHandler } from './verify-token.handler';
import { VerifyPasskeyFederationHandler } from './verify-passkey.handler';
import { RefreshTokenFederationHandler } from './refresh-token.handler';

export const federationCommands = [
  LoginFederationHandler,
  VerifyMfaFederationHandler,
  VerifyTfaFederationHandler,
  VerifyTokenFederationHandler,
  VerifyPasskeyFederationHandler,
  RefreshTokenFederationHandler,
];
