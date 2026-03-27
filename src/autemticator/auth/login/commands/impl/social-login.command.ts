import { Command } from '@nestjs/cqrs';
import { StatusType } from '../../dto/status.type';
import { SocialUser } from 'src/libs/utils/is-social-user';
import { SessionData } from 'express-session';

export class SocialLoginCommand extends Command<StatusType> {
  constructor(
    public readonly user: SocialUser,
    public readonly session: SessionData,
  ) {
    super();
  }
}
