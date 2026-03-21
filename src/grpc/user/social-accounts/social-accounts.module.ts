import { Module } from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';

@Module({
  providers: [SocialAccountsService],
})
export class SocialAccountsModule {}
