/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express from 'express';
import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
  Profile,
} from 'passport-google-oauth20';
import { Provider } from 'src/libs/utils/provider';
import { SocialUser } from 'src/libs/utils/is-social-user';
import { StrategyService } from './strategy.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  currentConfigHash = '';
  internalStrategy: any;

  constructor(private readonly strategyService: StrategyService) {
    const strategy: StrategyOptions = {
      clientID: 'placeholder',
      clientSecret: 'placeholder',
      callbackURL: 'placeholder',
      scope: ['email', 'profile'],
    };
    super(strategy);
  }

  authenticate(req: express.Request, options?: any): void {
    this.strategyService
      .getStrategy(Provider.google)
      .then((config) => {
        if (!config || !config.clientId || !config.secret) {
          return this.fail('Facebook auth is not configured.', 401);
        }

        const newHash = `${config.clientId}-${config.secret}`;

        if (this.currentConfigHash !== newHash) {
          const strategy: StrategyOptions = {
            clientID: config?.clientId ?? '',
            clientSecret: config?.secret ?? '',
            callbackURL: config?.callbackUrl ?? '',
            scope: ['email', 'profile'],
          };

          this.internalStrategy = new Strategy(
            strategy,
            (
              accessToken: string,
              refreshToken: string,
              profile: Profile,
              done: (error: any, user?: any, info?: any) => void,
            ) => {
              this.validate(accessToken, refreshToken, profile, done);
            },
          );

          this.currentConfigHash = newHash;
        }

        if (this.internalStrategy) {
          this.internalStrategy.success = this.success.bind(this);
          this.internalStrategy.fail = this.fail.bind(this);
          this.internalStrategy.error = this.error.bind(this);
          this.internalStrategy.redirect = this.redirect.bind(this);
          this.internalStrategy.pass = this.pass.bind(this);
          this.internalStrategy.authenticate(req, options);
        }
      })
      .catch((err: Error) => {
        this.error(
          new InternalServerErrorException(
            `Auth manager error:  ${err.message || err}`,
          ),
        );
      });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { emails, id, displayName } = profile ?? {};

    const user: SocialUser = {
      email: emails?.[0].value ?? '',
      name: displayName,
      provider: Provider.google,
      providerId: id,
    };
    done(null, user);
  }
}
