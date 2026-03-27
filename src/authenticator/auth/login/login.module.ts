import { Module } from '@nestjs/common';
import { loginCommand } from './commands/handler';
import { LoginCommandsResolver } from './login-command.resolver';

import { loginQueries } from './queries/handler';
import { LoginQueriesResolver } from './login-query.resolver';

import { AuthController } from './login.controller';
import { RiskModule } from '../risk/risk.module';

@Module({
  imports: [RiskModule],
  providers: [
    ...loginCommand,
    ...loginQueries,
    LoginCommandsResolver,
    LoginQueriesResolver,
  ],
  controllers: [AuthController],
})
export class LoginModule {}
