import { Module } from '@nestjs/common';
import { passkeyHandlers } from './commands/handler';
import { passkeyQueries } from './queries/handler';
import { TypeConfigService } from 'src/configs/types.config.service';
import { PasskeyQueriesResolver } from './passkey-query.resolver';
import { PasskeyCommandsResolver } from './passkey-command.resolver';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [
    ...passkeyHandlers,
    ...passkeyQueries,
    TypeConfigService,
    PasskeyQueriesResolver,
    PasskeyCommandsResolver,
  ],
})
export class PasskeyModule {}
