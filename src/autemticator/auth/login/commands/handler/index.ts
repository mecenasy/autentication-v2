import { LoginHandler } from './login.handler';
import { LogoutHandler } from './logout.handler';
import { ForgotPasswordHandler } from './forgot-password.handler';
import { ResetPasswordHandler } from './reset-password.handler';
import { ChangePasswordHandler } from './change-password.handler';
import { SocialLoginHandler } from './social-login.handler';
import { VerificationTokenHandler } from './verification-token.handler';
import { CreateUserHandler } from './social-create.handler';
import { TemporarySocialTokenHandler } from './temporary-token.handler';

export const loginCommand = [
  LoginHandler,
  LogoutHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
  ChangePasswordHandler,
  SocialLoginHandler,
  VerificationTokenHandler,
  CreateUserHandler,
  TemporarySocialTokenHandler,
];
