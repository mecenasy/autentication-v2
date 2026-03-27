import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { DynamicAuthGuard } from 'src/common/guards/dynamic-auth.guard';
import express from 'express';
import { isSocialUser } from 'src/libs/utils/is-social-user';
import { StatusResponse } from '../auth/login/response/status.response';
import { CommandBus } from '@nestjs/cqrs';
import { CreateSocialUserCommand } from './commands/impl/create-social-user.command';

@ApiTags('user')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOkResponse({
    description: 'year registered by microsoft account',
  })
  @Public()
  @Post('azure-register')
  @UseGuards(AuthGuard('azure'))
  @HttpCode(HttpStatus.CREATED)
  async azureRegistration(
    @Req() req: express.Request,
  ): Promise<StatusResponse> {
    if (!req.user || !isSocialUser(req.user)) {
      throw new BadRequestException('Invalid user');
    }
    const user = req.user;
    return await this.commandBus.execute<
      CreateSocialUserCommand,
      StatusResponse
    >(new CreateSocialUserCommand(user, req.session));
  }

  @Public()
  @Get(':provider/register')
  @UseGuards(DynamicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async socialRegistration() {}
}
