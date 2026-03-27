import { Module } from '@nestjs/common';
import { qrCodeCommands } from './commands/handler';
import { QrCodeCommandsResolver } from './qr-code-command-resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeConfigService } from 'src/configs/types.config.service';

@Module({
  imports: [CqrsModule],
  providers: [...qrCodeCommands, QrCodeCommandsResolver, TypeConfigService],
})
export class QrCodeModule {}
