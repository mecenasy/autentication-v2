import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Session,
} from '@nestjs/common';
import express from 'express';
import { Get, Req } from '@nestjs/common';
import {
  type AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { isSocialUser } from 'src/libs/utils/is-social-user';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterPasskeyOptionCommand } from './commands/impl/register-passkey-option.command';
import { User } from 'src/grpc/user/entity/user.entity';
import { VerifyRegistrationOptionCommand } from './commands/impl/verify-registration-option.command';
import { PasskeyOptionCommand } from './commands/impl/passkey-option.command';
import { VerifyPasskeyCommand } from './commands/impl/verify-passkey.command.';
import { StatusType } from '../login/dto/status.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('passkey')
@Controller('passkey')
export class PasskeyController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOkResponse({
    description: 'ger registration options for pass key',
  })
  @Get('biometrics/register-options')
  async getRegisterOFaceId(@CurrentUser() user: User) {
    if (user && !isSocialUser(user)) {
      return await this.commandBus.execute<
        RegisterPasskeyOptionCommand,
        PublicKeyCredentialCreationOptionsJSON
      >(new RegisterPasskeyOptionCommand(user.id, user.email));
    }

    throw new BadRequestException('Invalid user');
  }

  @ApiOkResponse({
    description: 'verification pass key',
  })
  @Post('biometrics/verify-registration')
  async verifyRegistration(
    @Body() body: RegistrationResponseJSON,
    @Headers('user-agent') ua: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.commandBus.execute<
      VerifyRegistrationOptionCommand,
      StatusType
    >(new VerifyRegistrationOptionCommand(userId, body, ua));
  }

  @ApiOkResponse({
    description: 'get login options for pass key',
  })
  @Post('biometrics/options')
  @Public()
  async loginOptions(@Req() req: express.Request) {
    return await this.commandBus.execute<
      PasskeyOptionCommand,
      PublicKeyCredentialRequestOptionsJSON
    >(new PasskeyOptionCommand(req.session));
  }

  @ApiOkResponse({
    description: 'verification login by pass key',
  })
  @Post('biometrics/verify')
  @Public()
  async loginVerify(
    @Req() req: express.Request,
    @Body() body: AuthenticationResponseJSON,
  ) {
    return await this.commandBus.execute<VerifyPasskeyCommand, StatusType>(
      new VerifyPasskeyCommand(req.session, body),
    );
  }
}
