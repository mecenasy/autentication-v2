/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express from 'express';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, StrategyOption } from 'passport-linkedin-oauth2';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Provider } from 'src/libs/utils/provider';
import { SocialUser } from 'src/libs/utils/is-social-user';
import { StrategyService } from './strategy.service';

interface LinkedinProfile {
  sub: string;
  email_verified: boolean;
  name: string;
  email: string;
}

type Option = StrategyOption & {
  userProfileURL: string;
  skipUserProfile: boolean;
};

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  currentConfigHash = '';
  internalStrategy: any;
  userProfileURL = 'https://api.linkedin.com/v2/userinfo';

  constructor(
    private readonly httpService: HttpService,
    private readonly strategyService: StrategyService,
  ) {
    const strategy: StrategyOption = {
      clientID: 'placeholder',
      clientSecret: 'placeholder',
      callbackURL: 'placeholder',
    };

    super(strategy);
  }

  authenticate(req: express.Request, options?: any): void {
    this.strategyService
      .getStrategy(Provider.linkedin)
      .then((config) => {
        if (!config || !config.clientId || !config.secret) {
          return this.fail('Facebook auth is not configured.', 401);
        }

        const newHash = `${config.clientId}-${config.secret}`;

        if (this.currentConfigHash !== newHash) {
          const strategy: Option = {
            clientID: config?.clientId ?? '',
            clientSecret: config?.secret ?? '',
            callbackURL: config?.callbackUrl ?? '',
            scope: ['openid', 'profile', 'email'],
            userProfileURL: this.userProfileURL,
            skipUserProfile: true,
          };

          this.internalStrategy = new Strategy(
            strategy,
            (
              accessToken: string,
              refreshToken: string,
              profile: Profile,
              done: (error: any, user?: any, info?: any) => void,
            ) => {
              this.validate(accessToken, refreshToken, profile, done).catch(
                (error: Error) => {
                  throw new UnauthorizedException(
                    'You are not authorized',
                    error,
                  );
                },
              );
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

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const { data } = await lastValueFrom(
      this.httpService.get<LinkedinProfile>(this.userProfileURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    const { email, name, sub } = data;
    const user: SocialUser = {
      email,
      name,
      provider: Provider.linkedin,
      providerId: sub,
    };

    done(null, user);
  }
}
