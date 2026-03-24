/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy, VerifyCallback } from 'passport-azure-ad';
import { Request } from 'express';
import { Provider } from 'src/libs/utils/provider';
import { SocialUser } from 'src/libs/utils/is-social-user';
import { StrategyService } from './strategy.service';

interface Data {
  oid: string;
  preferred_username: string;
  name: string;
}
@Injectable()
export class AzureStrategy extends PassportStrategy(BearerStrategy, 'azure') {
  [x: string]: any;
  private internalStrategy: any;
  private currentConfigHash: string = '';

  constructor(private readonly strategyService: StrategyService) {
    super({
      identityMetadata:
        'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
      clientID: 'placeholder',
      validateIssuer: false,
      passReqToCallback: false,
    });
  }

  authenticate(req: Request, options?: any): void {
    this.strategyService
      .getStrategy(Provider.microsoft)
      .then((config) => {
        if (!config || !config.clientId || !config.secret) {
          return this.fail('Azure auth is not configured.', 401);
        }

        const newHash = `${config.clientId}-${config.secret}`;

        if (this.currentConfigHash !== newHash) {
          this.internalStrategy = new BearerStrategy(
            {
              identityMetadata: `https://login.microsoftonline.com/${config.secret}/v2.0/.well-known/openid-configuration`,
              clientID: config.clientId,
              audience: [config.clientId, `api://${config.clientId}`],
              validateIssuer: true,
              passReqToCallback: false,
            },
            (token, done: any) => {
              const user = this.validate(token as unknown as Data);
              return (done as VerifyCallback)(null, user);
            },
          );

          this.currentConfigHash = newHash;
        }

        if (this.internalStrategy) {
          this.internalStrategy.success = this.success.bind(this);
          this.internalStrategy.fail = this.fail.bind(this);
          this.internalStrategy.error = this.error.bind(this);
        }

        this.internalStrategy.authenticate(req, options);
      })
      .catch((err: Error) => {
        this.error(
          new InternalServerErrorException(
            `Auth manager error:  ${err.message || err}`,
          ),
        );
      });
  }

  validate(data: Data): SocialUser | null {
    if (!data) {
      return null;
    }
    return {
      providerId: data.oid,
      provider: Provider.microsoft,
      email: data.preferred_username,
      name: data.name,
    };
  }
}
