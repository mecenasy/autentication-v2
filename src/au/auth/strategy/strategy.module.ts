import { forwardRef, Module } from '@nestjs/common';
import { AzureStrategy } from './azure.strategy';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { GithubStrategy } from './github.strategy';
import { LinkedinStrategy } from './linkedin.strategy';
import { HttpModule } from '@nestjs/axios';
import { SocialConfigModule } from 'src/au/social-config/social-config.module';
import { StrategyService } from './strategy.service';

@Module({
  imports: [HttpModule, forwardRef(() => SocialConfigModule)],
  providers: [
    StrategyService,
    AzureStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
    LinkedinStrategy,
  ],
})
export class StrategyModule {}
