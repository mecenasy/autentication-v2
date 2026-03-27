import { Module } from '@nestjs/common';
import { commandHandlers } from './commands/handler';
import { SettingsCommandResolver } from './settings-command.resolver';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [...commandHandlers, SettingsCommandResolver],
})
export class SettingsModule {}
