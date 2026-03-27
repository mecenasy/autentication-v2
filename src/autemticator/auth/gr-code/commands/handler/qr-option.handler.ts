import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { QrOptionCommand } from '../impl/qr-option.command';
import { QrCache } from './types/types';
import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/server';
import { BadRequestException } from '@nestjs/common';
import { generateOption } from 'src/autemticator/auth/passkey/helpers/option';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';

@CommandHandler(QrOptionCommand)
export class QrOptionHandler extends Handler<
  QrOptionCommand,
  PublicKeyCredentialRequestOptionsJSON
> {
  constructor(private readonly configService: TypeConfigService) {
    super();
  }

  async execute({ challenge, nonce, session }: QrOptionCommand) {
    if (!challenge) {
      throw new BadRequestException('Challenge is required');
    }

    const result = await this.cache.getFromCache<QrCache>({
      identifier: challenge,
      prefix: 'qr-challenge',
    });

    if (result?.status !== 'pending' || result.nonce !== nonce) {
      throw new BadRequestException('Wrong challenge.');
    }

    const options = await generateOption(
      this.configService.get<AppConfig>('app')?.clientUrl ?? '',
    );

    session.currentChallenge = result.challenge;

    await this.cache.saveInCache<QrCache>({
      identifier: challenge,
      prefix: 'qr-challenge',
      EX: 60,
      data: {
        ...result,
        status: 'optioned',
        optionChallenge: options.challenge,
      },
    });

    return options;
  }
}
