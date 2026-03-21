import { Module } from '@nestjs/common';
import { loginCommand } from './commands/handler';
import { LoginCommandsResolver } from './login-command.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { loginQueries } from './queries/handler';
import { LoginQueriesResolver } from './login-query.resolver';

@Module({
  imports: [CqrsModule],
  providers: [
    ...loginCommand,
    ...loginQueries,
    LoginCommandsResolver,
    LoginQueriesResolver,
  ],
})
export class LoginModule {}
