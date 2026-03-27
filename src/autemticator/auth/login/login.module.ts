import { Module } from '@nestjs/common';
import { loginCommand } from './commands/handler';
import { LoginCommandsResolver } from './login-command.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { loginQueries } from './queries/handler';
import { LoginQueriesResolver } from './login-query.resolver';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AuthController } from './login.controller';
import { RiskModule } from '../risk/risk.module';

@Module({
  imports: [CqrsModule, RiskModule],
  providers: [
    ...loginCommand,
    ...loginQueries,
    LoginCommandsResolver,
    LoginQueriesResolver,
    TypeConfigService,
  ],
  controllers: [AuthController],
})
export class LoginModule {}
