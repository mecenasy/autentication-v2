import { Command } from '@nestjs/cqrs';
import { SocialUserResponse } from 'src/proto/user';
import { CreateSocialUserType } from 'src/user/dto/create-social-user.type';

export class CreateSocialUserCommand extends Command<SocialUserResponse> {
  constructor(public readonly user: CreateSocialUserType) {
    super();
  }
}
