import { Module } from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialAccounts } from './entity/social-accounts.entity';
@Module({
  imports: [TypeOrmModule.forFeature([SocialAccounts])],
  providers: [SocialAccountsService],
  exports: [SocialAccountsService],
})
export class SocialAccountsModule {}
