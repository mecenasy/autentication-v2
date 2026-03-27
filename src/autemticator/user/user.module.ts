import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryUsersResolver } from './query-user.resolver';
import { CommandUsersResolver } from './command-user.resolver';
import { userCommands } from './commands/handlers';
// import { userQueries } from './queries/handlers';
import { SettingsModule } from './settings/settings.module';
import { UserController } from './user.controller';

@Module({
  imports: [CqrsModule, SettingsModule],
  providers: [
    ...userCommands,
    // ...userQueries,
    CommandUsersResolver,
    QueryUsersResolver,
  ],
  controllers: [UserController],
})
export class UserModule {}
