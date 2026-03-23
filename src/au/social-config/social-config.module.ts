import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './commands/handlers';
import { queryHandlers } from './queries/handlers';
import { SocialConfigQueryResolver } from './social-config-query.resolver';
import { SocialConfigCommandResolver } from './social-config-command.resolver';

@Module({
  imports: [CqrsModule],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    SocialConfigCommandResolver,
    SocialConfigQueryResolver,
  ],
})
export class SocialConfigModule {}
