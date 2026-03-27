import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { QrChallengeCommand } from '../impl/qr-chanllenge.command';
import { QrChallengeType } from '../../dto/qr-challenge.type';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';
import { v4 as uuid } from 'uuid';
import { toDataURL } from 'qrcode';
import { InternalServerErrorException } from '@nestjs/common';
import { QrCache } from './types/types';

@CommandHandler(QrChallengeCommand)
export class QrChallengeHandler extends Handler<
  QrChallengeCommand,
  QrChallengeType
> {
  constructor(private readonly configService: TypeConfigService) {
    super();
  }

  async execute({ nonce }: QrChallengeCommand) {
    const { challenge, dataUrl } = await this.generateQrDataUrl(nonce);

    await this.cache.saveInCache<QrCache>({
      identifier: challenge,
      prefix: 'qr-challenge',
      EX: 1500,
      data: { status: 'pending', challenge, nonce },
    });

    return { challenge, dataUrl };
  }

  private async generateQrDataUrl(nonce: string) {
    const challenge = uuid();
    const config = this.configService.get<AppConfig>('app');
    const uri = `${config?.clientUrl}/qr-verify/${challenge}?nonce=${nonce}`;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      toDataURL(uri, (error, dataUrl) => {
        if (error) {
          reject(
            new InternalServerErrorException('Failed to generate QR code.'),
          );
        }

        resolve(dataUrl);
      });
    });
    return { challenge, dataUrl };
  }
}
