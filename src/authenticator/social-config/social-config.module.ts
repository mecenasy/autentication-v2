import { Module } from '@nestjs/common';

import { commandHandlers } from './commands/handlers';
import { queryHandlers } from './queries/handlers';
import { SocialConfigQueryResolver } from './social-config-query.resolver';
import { SocialConfigCommandResolver } from './social-config-command.resolver';

@Module({
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    SocialConfigCommandResolver,
    SocialConfigQueryResolver,
  ],
})
export class SocialConfigModule {}
