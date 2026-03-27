import {
  ClassSerializerInterceptor,
  Controller,
  SerializeOptions,
  UseInterceptors,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
  Get,
  Res,
  Post,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNonAuthoritativeInformationResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import express from 'express';
import { StatusResponse } from './response/status.response';
import { CommandBus } from '@nestjs/cqrs';
import { Public } from 'src/common/decorators/public.decorator';
import { isSocialUser } from 'src/libs/utils/is-social-user';
import { DynamicAuthGuard } from 'src/common/guards/dynamic-auth.guard';
import { SocialCreateCommand } from './commands/impl/social-create.command';
import { SocialLoginCommand } from './commands/impl/social-login.command';
import { TemporaryTokenCommand } from './commands/impl/temporary-token.command';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@ApiExtraModels(StatusResponse)
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOkResponse({
    description: 'you are logged by microsoft account',
    type: StatusResponse,
  })
  @ApiNonAuthoritativeInformationResponse({
    description: 'you are not authorized',
  })
  @Public()
  @UseGuards(AuthGuard('azure'))
  @Post('azure-login')
  @HttpCode(HttpStatus.OK)
  async azureLogin(@Req() req: express.Request): Promise<StatusResponse> {
    if (!req.user || !isSocialUser(req.user)) {
      throw new BadRequestException('Invalid user');
    }

    const user = req.user;
    const session = req.session;

    return await this.commandBus.execute<SocialLoginCommand, StatusResponse>(
      new SocialLoginCommand(user, session),
    );
  }

  @ApiOkResponse({
    description:
      'redirect callback from social login provider google, facebook, X, apple, github, etc account',
    type: StatusResponse,
  })
  @ApiNonAuthoritativeInformationResponse({
    description: 'you are not authorized',
  })
  @Public()
  @UseGuards(DynamicAuthGuard)
  @Get(':provider/verify')
  @HttpCode(HttpStatus.OK)
  async socialVerify(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ): Promise<StatusResponse> {
    if (!req.user || !isSocialUser(req.user)) {
      throw new BadRequestException('Invalid user');
    }

    const isRegister = req.session.isRegister;
    const user = req.user;
    const session = req.session;

    if (isRegister) {
      await this.commandBus.execute<SocialCreateCommand, StatusResponse>(
        new SocialCreateCommand(user, session),
      );
    } else {
      try {
        await this.commandBus.execute<SocialLoginCommand, StatusResponse>(
          new SocialLoginCommand(user, session),
        );
      } catch {
        return await this.commandBus.execute<
          TemporaryTokenCommand,
          StatusResponse
        >(new TemporaryTokenCommand(true, user.email, res, session));
      }
    }
    return await this.commandBus.execute<TemporaryTokenCommand, StatusResponse>(
      new TemporaryTokenCommand(false, user.email, res, session),
    );
  }

  @ApiOkResponse({
    description:
      'you are logged by social like google, facebook, X, apple, github, etc. account',
    type: StatusResponse,
  })
  @ApiNonAuthoritativeInformationResponse({
    description: 'you are not authorized',
  })
  @Public()
  @UseGuards(DynamicAuthGuard)
  @Get(':provider/login')
  @HttpCode(HttpStatus.OK)
  async socialLogin() {}
}
