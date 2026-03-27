import { Module } from '@nestjs/common';
import { verify2faCommands } from './commands/handler';
import { Verify2faCodeResolver } from './tfa-command.resolver';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [...verify2faCommands, Verify2faCodeResolver],
})
export class TfaModule {}
