import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SmtpConfig } from './config/smtp.configs';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { SmtpSaga } from './smtp.saga';
import { smtpCommands } from './commands/handler';
import { TypeConfigService } from 'src/configs/types.config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: TypeConfigService) => ({
        transport: {
          host: configService.get<SmtpConfig>('smtp')?.host,
          port: configService.get<SmtpConfig>('smtp')?.port,
          secure: false,
          ignoreTLS: false,
          requireTLS: true,
          auth: {
            user: configService.get<SmtpConfig>('smtp')?.user,
            pass: configService.get<SmtpConfig>('smtp')?.password,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<SmtpConfig>('smtp')?.from}>`,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [SmtpSaga, ...smtpCommands],
})
export class SmtpModule {}
