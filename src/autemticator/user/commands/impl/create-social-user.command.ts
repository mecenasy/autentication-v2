import { Command } from '@nestjs/cqrs';
import { CreateSocialUserType } from 'src/autemticator/user/dto/create-social-user.type';
import { StatusResponse } from '../../../auth/login/response/status.response';
import { SessionData } from 'express-session';

export class CreateSocialUserCommand extends Command<StatusResponse> {
  constructor(
    public readonly user: CreateSocialUserType,
    public readonly session: SessionData,
  ) {
    super();
  }
}
