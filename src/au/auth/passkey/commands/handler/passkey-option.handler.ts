import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { PasskeyOptionCommand } from '../impl/passkey-option.command';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { InternalServerErrorException } from '@nestjs/common';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';

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
    const options = await generateAuthenticationOptions({
      rpID: this.clientUrl?.replace('https://', ''),
      allowCredentials: [],
      userVerification: 'required',
    });

    session.currentChallenge = options.challenge;

    await new Promise<void>((resolve, reject) => {
      session.save((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session.'));
          this.logger.error(err);
        } else {
          resolve();
        }
      });
    });
    return options;
  }
}
