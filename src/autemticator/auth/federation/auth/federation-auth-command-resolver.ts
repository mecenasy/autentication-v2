import { CommandBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { StatusType } from '../../login/dto/status.type';
import {
  SecurityContextInterceptor,
  type Security,
} from 'src/common/interceptors/security-context.interceptor';
import { SecurityContext } from 'src/common/decorators/security-context.decorator';
import { LoginType } from '../../login/dto/login-type';
import { LoginFederationCommand } from './commands/impl/login.command';
import { VerifyMfaFederationCommand } from './commands/impl/verify-mfa.command';
import { VerifyTfaFederationCommand } from './commands/impl/verify-tfa.command';
import { VerifyTokenFederationCommand } from './commands/impl/verify-token.command';
import { FederationTokenType } from './dto/federation-token.type';
import { RefreshTokenFederationCommand } from './commands/impl/refresh-token.command';
import GraphQLJSON from 'graphql-type-json';
import { VerifyPasskeyFederationCommand } from './commands/impl/verify-passkey.command';
import type { AuthenticationResponseJSON } from '@simplewebauthn/server';
import { UseInterceptors } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import express from 'express';

@Resolver('FederationAuth')
@UseInterceptors(SecurityContextInterceptor)
export class FederationAuthCommandResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Mutation(() => StatusType)
  async loginFederation(
    @Args('input') input: LoginType,
    @Args('token') token: string,
    @SecurityContext() security: Security,
  ) {
    return await this.commandBus.execute<LoginFederationCommand, StatusType>(
      new LoginFederationCommand(input.email, input.password, token, security),
    );
  }

  @Public()
  @Mutation(() => StatusType)
  async verifyMfaFederation(
    @Args('token') token: string,
    @Args('email') email: string,
    @Args('code') code: number,
  ) {
    return await this.commandBus.execute<
      VerifyMfaFederationCommand,
      StatusType
    >(new VerifyMfaFederationCommand(token, email, code));
  }

  @Public()
  @Mutation(() => StatusType)
  async verifyTfaFederation(
    @Args('token') token: string,
    @Args('email') email: string,
    @Args('code') code: string,
  ) {
    return await this.commandBus.execute<
      VerifyTfaFederationCommand,
      StatusType
    >(new VerifyTfaFederationCommand(token, email, code));
  }

  @Public()
  @Mutation(() => FederationTokenType)
  async verifyTokenFederation(
    @Args('token') token: string,
    @Args('secret') secret: string,
    @Args('clientId') clientId: string,
  ) {
    return await this.commandBus.execute<
      VerifyTokenFederationCommand,
      FederationTokenType
    >(new VerifyTokenFederationCommand(token, secret, clientId));
  }

  @Public()
  @Mutation(() => FederationTokenType)
  async refreshTokenFederation(
    @Args('token') token: string,
    @Args('secret') secret: string,
    @Args('clientId') clientId: string,
  ) {
    return await this.commandBus.execute<
      RefreshTokenFederationCommand,
      FederationTokenType
    >(new RefreshTokenFederationCommand(token, secret, clientId));
  }

  @Public()
  @Mutation(() => StatusType)
  async verifyPasskeyFederation(
    @Args('token') token: string,
    @Args('data', { type: () => GraphQLJSON }) data: AuthenticationResponseJSON,
    @Context() ctx: express.Response,
  ) {
    return await this.commandBus.execute<
      VerifyPasskeyFederationCommand,
      StatusType
    >(new VerifyPasskeyFederationCommand(token, data, ctx.req.session));
  }
}
