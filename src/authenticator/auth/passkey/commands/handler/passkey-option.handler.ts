import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { PasskeyOptionCommand } from '../impl/passkey-option.command';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';
import { generateOption } from '../../helpers/option';
import { saveSession } from 'src/authenticator/auth/helpers/save-session';

@CommandHandler(PasskeyOptionCommand)
export class PasskeyOptionHandler extends Handler<
  PasskeyOptionCommand,
  PublicKeyCredentialRequestOptionsJSON
> {
  clientUrl: string;

  constructor(private readonly configService: TypeConfigService) {
    super();

    this.clientUrl = this.configService.get<AppConfig>('app')?.clientUrl ?? '';
  }

  async execute({
    session,
  }: PasskeyOptionCommand): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const options = await generateOption(this.clientUrl ?? '');

    session.currentChallenge = options.challenge;

    await saveSession(session, this.logger);

    return options;
  }
}
