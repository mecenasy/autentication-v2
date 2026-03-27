import { Module } from '@nestjs/common';
import { verifyCommands } from './commands/handler';
import { CommandVerifyMfaResolver } from './mfa-command.resolver';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [...verifyCommands, CommandVerifyMfaResolver],
})
export class MfaModule {}
