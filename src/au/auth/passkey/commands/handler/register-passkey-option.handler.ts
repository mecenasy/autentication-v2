import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { RegisterPasskeyOptionCommand } from '../impl/register-passkey-option.command';
import {
  generateRegistrationOptions,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/server';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';

@CommandHandler(RegisterPasskeyOptionCommand)
export class RegisterPasskeyOptionHandler extends Handler<
  RegisterPasskeyOptionCommand,
  PublicKeyCredentialCreationOptionsJSON
> {
  private clientUrl: string;

  constructor(private readonly configService: TypeConfigService) {
    super();

    this.clientUrl = this.configService.get<AppConfig>('app')?.clientUrl ?? '';
  }

  async execute({
    email,
    userId,
  }: RegisterPasskeyOptionCommand): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const options = await generateRegistrationOptions({
      rpName: 'Autenticator',
      rpID: this.clientUrl?.replace('https://', ''),
      userID: Buffer.from(userId),
      userName: email,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required',
        authenticatorAttachment: 'platform',
      },
    });

    await this.cache.saveInCache({
      identifier: userId,
      prefix: 'passkey-option',
      data: options.challenge,
    });

    return options;
  }
}
